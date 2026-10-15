/**
 * Aura v1: Cryptographic Primitives & Audit Hash Chaining
 * Implements salted password hashing, SHA-256 digests, and tamper-evident audit chaining.
 */

import crypto from 'node:crypto';

/**
 * Computes SHA-256 hash of a string or buffer.
 * @param {string|Buffer} data
 * @returns {string} Hex string (64 characters)
 */
export function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Hashes a plaintext password using crypto.scrypt with cryptographically random salt.
 * Formats output as: scrypt$N=16384,r=8,p=1$<salt_hex>$<hash_hex>
 * @param {string} password
 * @returns {Promise<string>}
 */
export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`scrypt$N=16384,r=8,p=1$${salt}$${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifies a plaintext password against a formatted scrypt hash.
 * @param {string} password
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
export function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'scrypt') {
      return resolve(false);
    }

    const salt = parts[2];
    const key = parts[3];

    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
      if (err) return reject(err);
      const derivedHex = derivedKey.toString('hex');
      // Constant-time comparison to prevent timing attacks
      const keyBuf = Buffer.from(key, 'hex');
      const derivedBuf = Buffer.from(derivedHex, 'hex');
      if (keyBuf.length !== derivedBuf.length) {
        return resolve(false);
      }
      resolve(crypto.timingSafeEqual(keyBuf, derivedBuf));
    });
  });
}

/**
 * Computes the tamper-evident hash for an audit ledger event according to the canonical formula:
 * CanonicalString = prev_hash | seq | org_id | timestamp | actor_id | action | resource_type | resource_id | status | SHA256(context_json)
 * event_hash = SHA256(CanonicalString)
 * 
 * @param {Object} event
 * @param {string} event.prev_event_hash
 * @param {number|string} event.sequence_number
 * @param {string} event.organization_id
 * @param {string} event.timestamp_utc - ISO string
 * @param {string} event.actor_id
 * @param {string} event.action
 * @param {string} event.resource_type
 * @param {string} event.resource_id
 * @param {string} event.status
 * @param {Object|string} event.context_json
 * @returns {string} SHA-256 hex string
 */
export function computeAuditEventHash(event) {
  const contextStr = typeof event.context_json === 'string' 
    ? event.context_json 
    : JSON.stringify(event.context_json || {});
  
  const contextHash = sha256(contextStr);

  const canonicalString = [
    event.prev_event_hash,
    String(event.sequence_number),
    event.organization_id,
    new Date(event.timestamp_utc).toISOString(),
    event.actor_id,
    event.action,
    event.resource_type,
    event.resource_id,
    event.status,
    contextHash
  ].join('|');

  return sha256(canonicalString);
}

/**
 * Validates a sequence of audit events to ensure unbroken cryptographic hash chain.
 * @param {Array<Object>} events - Chronologically sorted events
 * @returns {{ valid: boolean, brokenSequence?: number, reason?: string }}
 */
export function verifyAuditChain(events) {
  if (!events || events.length === 0) {
    return { valid: true };
  }

  for (let i = 0; i < events.length; i++) {
    const current = events[i];

    // Verify hash of current event
    const expectedHash = computeAuditEventHash(current);
    if (current.event_hash !== expectedHash) {
      return {
        valid: false,
        brokenSequence: current.sequence_number,
        reason: `Hash mismatch at sequence ${current.sequence_number}: expected ${expectedHash}, got ${current.event_hash}`
      };
    }

    // Verify chain linkage to previous event
    if (i > 0) {
      const prev = events[i - 1];
      if (current.prev_event_hash !== prev.event_hash) {
        return {
          valid: false,
          brokenSequence: current.sequence_number,
          reason: `Chain broken at sequence ${current.sequence_number}: prev_event_hash ${current.prev_event_hash} != prev.event_hash ${prev.event_hash}`
        };
      }
    }
  }

  return { valid: true };
}
