/**
 * Aura v1: RFC 6238 TOTP Multi-Factor Authentication
 * Time-based One-Time Password generation and verification.
 */

import * as OTPAuth from 'otpauth';
import { AppError, ErrorCode } from '@aura/common/errors';

export class TotpService {
  /**
   * @param {Object} [options]
   * @param {string} [options.issuer='Aura Vision']
   */
  constructor(options = {}) {
    this.issuer = options.issuer || 'Aura Vision';
  }

  /**
   * Generates a new TOTP secret and setup URI for a user.
   * @param {string} userEmail
   * @returns {{ secret: string, uri: string }}
   */
  generateMfaSetup(userEmail) {
    const totp = new OTPAuth.TOTP({
      issuer: this.issuer,
      label: userEmail,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: new OTPAuth.Secret({ size: 20 }), // 160-bit secure random secret
    });

    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    };
  }

  /**
   * Verifies a 6-digit TOTP token against a user's base32 secret.
   * @param {string} token - 6-digit string
   * @param {string} secret - Base32 secret string
   * @param {number} [timestamp] - Optional custom timestamp (ms) for testing
   * @returns {boolean}
   */
  verifyToken(token, secret, timestamp = Date.now()) {
    if (!token || !secret) {
      return false;
    }

    // Clean input
    const cleanToken = String(token).trim();
    if (!/^\d{6}$/.test(cleanToken)) {
      return false;
    }

    try {
      const totp = new OTPAuth.TOTP({
        issuer: this.issuer,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret),
      });

      // delta is non-null if token is within window [-1, 0, +1]
      const delta = totp.validate({
        token: cleanToken,
        window: 1,
        timestamp,
      });

      return delta !== null;
    } catch {
      return false;
    }
  }

  /**
   * Generates the current valid token for testing purposes.
   * @param {string} secret
   * @param {number} [timestamp]
   * @returns {string}
   */
  generateCurrentToken(secret, timestamp = Date.now()) {
    const totp = new OTPAuth.TOTP({
      issuer: this.issuer,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    return totp.generate({ timestamp });
  }
}
