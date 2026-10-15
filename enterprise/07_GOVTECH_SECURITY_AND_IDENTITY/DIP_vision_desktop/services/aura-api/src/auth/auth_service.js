/**
 * Aura v1: Primary Authentication Service
 * Implements login, account enumeration defense, Argon2id verification,
 * JWT access token issuance, session management, and RFC 6238 TOTP MFA.
 */

import { AppError, ErrorCode } from '@aura/common/errors';
import { logger } from '@aura/common/logger';
import { hashPasswordArgon2id, verifyPasswordArgon2id } from './argon2id.js';
import { JwtService } from './jwt.js';
import { SessionService } from './session_service.js';
import { TotpService } from './totp.js';
import { AuditRecorder } from '../audit/recorder.js';

// Dummy hash used for constant-time comparison when user does not exist (prevents timing attacks)
const DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export class AuthService {
  /**
   * @param {Object} db - DatabaseClient
   * @param {Object} [options]
   */
  constructor(db, options = {}) {
    this.db = db;
    this.jwt = new JwtService(options.jwt);
    this.session = new SessionService(db, options.session);
    this.totp = new TotpService(options.totp);
    this.audit = new AuditRecorder(db);
  }

  /**
   * Authenticates a user with email and password, defending against account enumeration.
   * 
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} [params.mfaCode]
   * @param {string} [params.userAgent]
   * @param {string} [params.ipAddress]
   * @returns {Promise<Object>} Auth payload with access and refresh tokens
   */
  async login({ email, password, mfaCode = null, userAgent = null, ipAddress = null }) {
    if (!email || !password) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid email or password');
    }

    const cleanEmail = email.toLowerCase().trim();

    // Look up user by email across tenants using SuperAdmin context
    const userRes = await this.db.withSuperAdmin(async (tx) => {
      return tx.query(`
        SELECT id, organization_id, email, password_hash, full_name, status, mfa_enabled, mfa_secret
        FROM users
        WHERE email = $1;
      `, [cleanEmail]);
    });

    const user = userRes.rows[0];

    // =========================================================================
    // ANTI-ENUMERATION & TIMING ATTACK DEFENSE:
    // If user does not exist, compute verification against a dummy hash anyway!
    // =========================================================================
    const passwordHashToTest = user ? user.password_hash : DUMMY_HASH;
    const isPasswordValid = await verifyPasswordArgon2id(password, passwordHashToTest);

    if (!user || !isPasswordValid) {
      if (user) {
        await this.db.withSuperAdmin(async (tx) => {
          await this.audit.record(tx, {
            organizationId: user.organization_id,
            actorType: 'USER',
            actorId: user.id,
            actorEmail: user.email,
            action: 'USER_LOGIN_FAILED',
            resourceType: 'SESSION',
            resourceId: user.id,
            status: 'FAILURE',
            ipAddress,
            userAgent,
            context: { reason: 'INVALID_CREDENTIALS' }
          });
        });
      }
      logger.warn('Failed login attempt', {
        extra: { email: cleanEmail, reason: 'INVALID_CREDENTIALS', ip: ipAddress }
      });
      // Generic message: never disclose whether the account exists
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      logger.warn('Login attempt for inactive user', {
        extra: { email: cleanEmail, status: user.status }
      });
      throw new AppError(ErrorCode.FORBIDDEN, 'Account is not active');
    }

    // =========================================================================
    // TOTP MULTI-FACTOR AUTHENTICATION CHECK
    // =========================================================================
    if (user.mfa_enabled) {
      if (!mfaCode) {
        return {
          mfaRequired: true,
          userId: user.id,
          message: 'MFA code is required for this account',
        };
      }

      const isMfaValid = this.totp.verifyToken(mfaCode, user.mfa_secret);
      if (!isMfaValid) {
        await this.db.withSuperAdmin(async (tx) => {
          await this.audit.record(tx, {
            organizationId: user.organization_id,
            actorType: 'USER',
            actorId: user.id,
            actorEmail: user.email,
            action: 'MFA_VERIFICATION_FAILED',
            resourceType: 'SESSION',
            resourceId: user.id,
            status: 'FAILURE',
            ipAddress,
            userAgent,
            context: { reason: 'INVALID_MFA_TOKEN' }
          });
        });
        logger.warn('Failed MFA verification', {
          extra: { email: cleanEmail, ip: ipAddress }
        });
        throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid or expired MFA code');
      }
    }

    // =========================================================================
    // RESOLVE USER ROLES
    // =========================================================================
    const rolesRes = await this.db.withTenant(user.organization_id, async (tx) => {
      return tx.query(`
        SELECT role_id FROM user_roles WHERE user_id = $1;
      `, [user.id]);
    });

    const roles = rolesRes.rows.map(r => r.role_id);
    if (roles.length === 0) {
      roles.push('CUSTOMER_USER');
    }

    // =========================================================================
    // ISSUE TOKENS & RECORD SESSION
    // =========================================================================
    const accessToken = this.jwt.issueAccessToken({
      userId: user.id,
      organizationId: user.organization_id,
      email: user.email,
      roles,
    });

    const session = await this.session.createSession({
      userId: user.id,
      organizationId: user.organization_id,
      userAgent,
      ipAddress,
    });

    // Record audit event for successful login
    await this.db.withTenant(user.organization_id, async (tx) => {
      await this.audit.record(tx, {
        organizationId: user.organization_id,
        actorType: 'USER',
        actorId: user.id,
        actorEmail: user.email,
        action: 'USER_LOGIN_SUCCESS',
        resourceType: 'SESSION',
        resourceId: session.sessionId,
        status: 'SUCCESS',
        ipAddress,
        userAgent,
        context: { roles }
      });
    });

    logger.info('User successfully authenticated', {
      user_id: user.id,
      organization_id: user.organization_id,
      extra: { email: user.email, ip: ipAddress }
    });

    return {
      accessToken,
      refreshToken: session.refreshToken,
      expiresIn: this.jwt.expiresInSeconds,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        organizationId: user.organization_id,
        roles,
      },
    };
  }

  /**
   * Refreshes an access token with rotation and session family theft detection.
   * 
   * @param {Object} params
   * @param {string} params.refreshToken
   * @param {string} [params.userAgent]
   * @param {string} [params.ipAddress]
   */
  async refresh({ refreshToken, userAgent = null, ipAddress = null }) {
    const rotated = await this.session.rotateSession({ refreshToken, userAgent, ipAddress });

    // Fetch user details & roles
    const userRes = await this.db.withTenant(rotated.organizationId, async (tx) => {
      const uRes = await tx.query('SELECT id, email FROM users WHERE id = $1', [rotated.userId]);
      const rRes = await tx.query('SELECT role_id FROM user_roles WHERE user_id = $1', [rotated.userId]);
      return {
        user: uRes.rows[0],
        roles: rRes.rows.map(r => r.role_id),
      };
    });

    const roles = userRes.roles.length > 0 ? userRes.roles : ['CUSTOMER_USER'];

    const newAccessToken = this.jwt.issueAccessToken({
      userId: rotated.userId,
      organizationId: rotated.organizationId,
      email: userRes.user ? userRes.user.email : '',
      roles,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: rotated.newRefreshToken,
      expiresIn: this.jwt.expiresInSeconds,
      tokenType: 'Bearer',
    };
  }

  /**
   * Logs out a session by revoking the refresh token.
   * @param {string} refreshToken
   */
  async logout(refreshToken) {
    const session = await this.session.revokeSession(refreshToken);
    if (session) {
      await this.db.withSuperAdmin(async (tx) => {
        await this.audit.record(tx, {
          organizationId: session.organization_id,
          actorType: 'USER',
          actorId: session.user_id,
          action: 'USER_LOGOUT',
          resourceType: 'SESSION',
          resourceId: session.id,
          status: 'SUCCESS',
          context: {}
        });
      });
    }
  }

  /**
   * Sets up TOTP MFA for a user. Returns setup secret and URI.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.organizationId
   */
  async setupMfa({ userId, organizationId }) {
    const userRes = await this.db.withTenant(organizationId, async (tx) => {
      return tx.query('SELECT email FROM users WHERE id = $1', [userId]);
    });

    if (userRes.rows.length === 0) {
      throw new AppError(ErrorCode.NOT_FOUND, 'User not found');
    }

    const { secret, uri } = this.totp.generateMfaSetup(userRes.rows[0].email);

    // Store secret in pending state
    await this.db.withTenant(organizationId, async (tx) => {
      await tx.query(`
        UPDATE users
        SET mfa_secret = $1, mfa_enabled = FALSE
        WHERE id = $2;
      `, [secret, userId]);

      await this.audit.record(tx, {
        organizationId,
        actorType: 'USER',
        actorId: userId,
        action: 'MFA_SETUP_REQUESTED',
        resourceType: 'USER',
        resourceId: userId,
        status: 'SUCCESS',
        context: { mfa_type: 'TOTP' } // NEVER LOG SECRET
      });
    });

    // Never log secret!
    logger.info('MFA setup generated for user', { user_id: userId, organization_id: organizationId });

    return { secret, uri };
  }

  /**
   * Confirms and enables MFA by verifying the first token.
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.organizationId
   * @param {string} params.token
   */
  async confirmMfa({ userId, organizationId, token }) {
    const userRes = await this.db.withTenant(organizationId, async (tx) => {
      return tx.query('SELECT mfa_secret FROM users WHERE id = $1', [userId]);
    });

    if (userRes.rows.length === 0 || !userRes.rows[0].mfa_secret) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'MFA has not been initialized for this user');
    }

    const secret = userRes.rows[0].mfa_secret;
    const isValid = this.totp.verifyToken(token, secret);

    if (!isValid) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid MFA verification code');
    }

    await this.db.withTenant(organizationId, async (tx) => {
      await tx.query('UPDATE users SET mfa_enabled = TRUE WHERE id = $1', [userId]);
      await this.audit.record(tx, {
        organizationId,
        actorType: 'USER',
        actorId: userId,
        action: 'MFA_ENABLED',
        resourceType: 'USER',
        resourceId: userId,
        status: 'SUCCESS',
        context: { mfa_type: 'TOTP' }
      });
    });

    logger.info('MFA successfully enabled for user', { user_id: userId, organization_id: organizationId });
    return { success: true };
  }
}
