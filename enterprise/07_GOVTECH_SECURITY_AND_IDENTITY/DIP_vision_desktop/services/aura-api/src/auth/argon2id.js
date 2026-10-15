/**
 * Aura v1: Argon2id Password Hashing Engine
 * Production-grade password derivation using Argon2id (RFC 9106)
 */

import crypto from 'node:crypto';
import { argon2id } from 'hash-wasm';

const ARGON2ID_PARAMS = Object.freeze({
  iterations: 3,
  memorySize: 65536, // 64 MB
  parallelism: 4,
  hashLength: 32, // 256-bit derived key
});

/**
 * Derives an Argon2id hash for a plaintext password.
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Standard modular crypt format $argon2id$v=19$m=65536,t=3,p=4$...
 */
export async function hashPasswordArgon2id(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  // 16 cryptographically random bytes for salt
  const saltBytes = crypto.randomBytes(16);

  const hashHex = await argon2id({
    password,
    salt: saltBytes,
    iterations: ARGON2ID_PARAMS.iterations,
    memorySize: ARGON2ID_PARAMS.memorySize,
    parallelism: ARGON2ID_PARAMS.parallelism,
    hashLength: ARGON2ID_PARAMS.hashLength,
    outputType: 'hex',
  });

  const saltB64 = saltBytes.toString('base64url');
  const hashB64 = Buffer.from(hashHex, 'hex').toString('base64url');

  return `$argon2id$v=19$m=${ARGON2ID_PARAMS.memorySize},t=${ARGON2ID_PARAMS.iterations},p=${ARGON2ID_PARAMS.parallelism}$${saltB64}$${hashB64}`;
}

/**
 * Verifies a plaintext password against an Argon2id modular crypt format string.
 * @param {string} password - Plaintext password
 * @param {string} storedHash - Stored Argon2id hash
 * @returns {Promise<boolean>} True if valid, false otherwise
 */
export async function verifyPasswordArgon2id(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }

  const parts = storedHash.split('$');
  // Format: ["", "argon2id", "v=19", "m=65536,t=3,p=4", "<salt>", "<hash>"]
  if (parts.length !== 6 || parts[1] !== 'argon2id') {
    return false;
  }

  const paramsStr = parts[3];
  const saltB64 = parts[4];
  const expectedHashB64 = parts[5];

  const paramsMatch = paramsStr.match(/m=(\d+),t=(\d+),p=(\d+)/);
  if (!paramsMatch) {
    return false;
  }

  const memorySize = parseInt(paramsMatch[1], 10);
  const iterations = parseInt(paramsMatch[2], 10);
  const parallelism = parseInt(paramsMatch[3], 10);
  const saltBytes = Buffer.from(saltB64, 'base64url');

  try {
    const computedHex = await argon2id({
      password,
      salt: saltBytes,
      iterations,
      memorySize,
      parallelism,
      hashLength: ARGON2ID_PARAMS.hashLength,
      outputType: 'hex',
    });

    const computedB64 = Buffer.from(computedHex, 'hex').toString('base64url');
    const expectedBuf = Buffer.from(expectedHashB64);
    const computedBuf = Buffer.from(computedB64);

    if (expectedBuf.length !== computedBuf.length) {
      return false;
    }

    // Constant-time buffer comparison to prevent timing attacks
    return crypto.timingSafeEqual(expectedBuf, computedBuf);
  } catch {
    return false;
  }
}
