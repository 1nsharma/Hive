/**
 * Aura v1: JWT Token Service
 * Cryptographic token issuance with explicit claims and strict algorithm allowlisting.
 */

import jwt from 'jsonwebtoken';
import { AppError, ErrorCode } from '@aura/common/errors';

export const JWT_ISSUER = 'aura-vision';
export const JWT_AUDIENCE = 'aura-api';
export const ALLOWED_ALGORITHMS = ['HS256'];
const DEFAULT_ACCESS_TOKEN_EXPIRY = 900; // 15 minutes in seconds

export class JwtService {
  /**
   * @param {Object} [options]
   * @param {string} [options.secret]
   * @param {number} [options.expiresInSeconds=900]
   */
  constructor(options = {}) {
    this.secret = options.secret || process.env.JWT_SIGNING_KEY || 'default-secret-min32-characters-required!';
    this.expiresInSeconds = options.expiresInSeconds || DEFAULT_ACCESS_TOKEN_EXPIRY;
  }

  /**
   * Issues a signed access token with explicit tenant and subject claims.
   * @param {Object} payload
   * @param {string} payload.userId
   * @param {string} payload.organizationId
   * @param {Array<string>} payload.roles
   * @param {string} [payload.email]
   * @returns {string} Signed JWT string
   */
  issueAccessToken(payload) {
    if (!payload.userId || !payload.organizationId) {
      throw new Error('userId and organizationId are required claims');
    }

    const claims = {
      sub: payload.userId,
      tenant_id: payload.organizationId,
      roles: payload.roles || ['CUSTOMER_USER'],
      email: payload.email || '',
      typ: 'access',
    };

    return jwt.sign(claims, this.secret, {
      algorithm: 'HS256',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: this.expiresInSeconds,
    });
  }

  /**
   * Verifies an access token with strict claims and algorithm validation.
   * @param {string} token
   * @returns {Object} Decoded payload
   */
  verifyAccessToken(token) {
    if (!token || typeof token !== 'string') {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Access token is required');
    }

    try {
      const decoded = jwt.verify(token, this.secret, {
        algorithms: ALLOWED_ALGORITHMS,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        complete: false,
      });

      // Explicit token type assertion
      if (decoded.typ !== 'access') {
        throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid token type: expected access token');
      }

      return decoded;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      if (err.name === 'TokenExpiredError') {
        throw new AppError(ErrorCode.UNAUTHORIZED, 'Access token expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new AppError(ErrorCode.UNAUTHORIZED, `Invalid access token: ${err.message}`);
      }
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Authentication failed');
    }
  }
}
