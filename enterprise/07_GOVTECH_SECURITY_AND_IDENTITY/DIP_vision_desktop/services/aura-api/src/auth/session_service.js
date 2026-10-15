/**
 * Aura v1: Session Service & Refresh Token Rotation Engine
 * Manages opaque refresh tokens with SHA-256 hash storage, cryptographic rotation,
 * and automatic session-family revocation upon token reuse (theft defense).
 */

import crypto from 'node:crypto';
import { sha256 } from '@aura/common/crypto';
import { AppError, ErrorCode } from '@aura/common/errors';
import { AuditRecorder } from '../audit/recorder.js';

const DEFAULT_REFRESH_EXPIRY_DAYS = 7;

export class SessionService {
  /**
   * @param {Object} db - DatabaseClient instance
   * @param {Object} [options]
   * @param {number} [options.refreshExpiryDays=7]
   */
  constructor(db, options = {}) {
    this.db = db;
    this.refreshExpiryDays = options.refreshExpiryDays || DEFAULT_REFRESH_EXPIRY_DAYS;
    this.audit = new AuditRecorder(db);
  }

  /**
   * Generates a secure, cryptographically random opaque refresh token.
   * @returns {string} e.g. "rt_8f1a...64chars"
   */
  _generateOpaqueToken() {
    const raw = crypto.randomBytes(32).toString('hex');
    return `rt_${raw}`;
  }

  /**
   * Creates a new user session with a hashed refresh token.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.organizationId
   * @param {string} [params.userAgent]
   * @param {string} [params.ipAddress]
   * @returns {Promise<{ sessionId: string, refreshToken: string, expiresAt: Date }>}
   */
  async createSession({ userId, organizationId, userAgent = null, ipAddress = null }) {
    const rawRefreshToken = this._generateOpaqueToken();
    const tokenHash = sha256(rawRefreshToken);
    const expiresAt = new Date(Date.now() + this.refreshExpiryDays * 24 * 60 * 60 * 1000);

    const res = await this.db.withTenant(organizationId, async (tx) => {
      return tx.query(`
        INSERT INTO sessions (
          user_id, organization_id, refresh_token_hash, user_agent, ip_address, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, created_at;
      `, [userId, organizationId, tokenHash, userAgent, ipAddress, expiresAt.toISOString()]);
    });

    return {
      sessionId: res.rows[0].id,
      refreshToken: rawRefreshToken, // Return raw token ONLY to the client once
      expiresAt,
    };
  }

  /**
   * Rotates a refresh token. Detects token reuse and revokes entire session family if compromised.
   * 
   * @param {Object} params
   * @param {string} params.refreshToken - Raw refresh token from client
   * @param {string} [params.userAgent]
   * @param {string} [params.ipAddress]
   * @returns {Promise<{ userId: string, organizationId: string, newRefreshToken: string, newSessionId: string }>}
   */
  async rotateSession({ refreshToken, userAgent = null, ipAddress = null }) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Refresh token is required');
    }

    const tokenHash = sha256(refreshToken);

    // Look up session by token hash across any tenant under SuperAdmin
    const sessionLookup = await this.db.withSuperAdmin(async (tx) => {
      return tx.query(`
        SELECT id, user_id, organization_id, expires_at, revoked_at
        FROM sessions
        WHERE refresh_token_hash = $1;
      `, [tokenHash]);
    });

    if (sessionLookup.rows.length === 0) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid refresh token');
    }

    const session = sessionLookup.rows[0];

    // =========================================================================
    // CRITICAL THEFT DETECTION: SESSION FAMILY REVOCATION ON REUSE
    // =========================================================================
    if (session.revoked_at !== null) {
      // Token was already revoked! An attacker is replaying an old token.
      // Immediately revoke all active sessions for this user across the tenant!
      await this.db.withSuperAdmin(async (tx) => {
        await tx.query(`
          UPDATE sessions
          SET revoked_at = NOW()
          WHERE user_id = $1 AND revoked_at IS NULL;
        `, [session.user_id]);

        await this.audit.record(tx, {
          organizationId: session.organization_id,
          actorType: 'SYSTEM',
          actorId: session.user_id,
          action: 'SESSION_FAMILY_REVOKED',
          resourceType: 'SESSION',
          resourceId: session.id,
          status: 'FAILURE',
          ipAddress,
          userAgent,
          context: { reason: 'REFRESH_TOKEN_REUSE_DETECTED' }
        });
      });

      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Compromised refresh token reuse detected. All active user sessions have been terminated for security.'
      );
    }

    // Check expiration
    if (new Date(session.expires_at) < new Date()) {
      await this.db.withSuperAdmin(async (tx) => {
        await tx.query('UPDATE sessions SET revoked_at = NOW() WHERE id = $1', [session.id]);
      });
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Refresh token has expired');
    }

    // Valid token: rotate it atomically
    const newRawToken = this._generateOpaqueToken();
    const newTokenHash = sha256(newRawToken);
    const newExpiresAt = new Date(Date.now() + this.refreshExpiryDays * 24 * 60 * 60 * 1000);

    const rotationResult = await this.db.withTenant(session.organization_id, async (tx) => {
      // 1. Invalidate old session
      await tx.query('UPDATE sessions SET revoked_at = NOW() WHERE id = $1', [session.id]);

      // 2. Insert new session
      const insertRes = await tx.query(`
        INSERT INTO sessions (
          user_id, organization_id, refresh_token_hash, user_agent, ip_address, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
      `, [session.user_id, session.organization_id, newTokenHash, userAgent, ipAddress, newExpiresAt.toISOString()]);

      return insertRes.rows[0].id;
    });

    return {
      userId: session.user_id,
      organizationId: session.organization_id,
      newSessionId: rotationResult,
      newRefreshToken: newRawToken,
    };
  }

  /**
   * Revokes a session on user logout.
   * @param {string} refreshToken - Raw token to revoke
   * @returns {Promise<Object|null>} Revoked session row
   */
  async revokeSession(refreshToken) {
    if (!refreshToken) return null;
    const tokenHash = sha256(refreshToken);

    return this.db.withSuperAdmin(async (tx) => {
      const res = await tx.query(`
        UPDATE sessions
        SET revoked_at = NOW()
        WHERE refresh_token_hash = $1 AND revoked_at IS NULL
        RETURNING id, user_id, organization_id;
      `, [tokenHash]);

      return res.rows.length > 0 ? res.rows[0] : null;
    });
  }
}
