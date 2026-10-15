import { test, describe, before, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { PGlite } from '@electric-sql/pglite';
import { DatabaseClient, Migrator } from '@aura/database';
import { verifyAuditChain } from '@aura/common/crypto';
import { 
  hashPasswordArgon2id, 
  verifyPasswordArgon2id,
  JwtService,
  TotpService,
  SessionService,
  AuthService,
  JWT_ISSUER,
  JWT_AUDIENCE
} from '../src/auth/index.js';

describe('M0-TASK-03: Enterprise Authentication, Session Rotation & TOTP MFA', () => {
  let pglite;
  let db;
  let migrator;
  let authService;
  let jwtService;
  let totpService;

  let testOrgId;
  let testUserId;
  let precomputedPasswordHash;
  const testUserEmail = 'engineer@auravision.io';
  const testPassword = 'CorrectHorseBatteryStaple123!';

  before(async () => {
    // Precompute Argon2id hash once for the test suite
    precomputedPasswordHash = await hashPasswordArgon2id(testPassword);
  });

  beforeEach(async () => {
    pglite = new PGlite();
    db = new DatabaseClient({ adapter: pglite });
    migrator = new Migrator(db, path.resolve(process.cwd(), 'deploy/migrations'));

    await migrator.migrateUp();

    jwtService = new JwtService({ secret: 'super-secure-jwt-signing-key-minimum-32-chars!' });
    totpService = new TotpService();
    authService = new AuthService(db, {
      jwt: { secret: 'super-secure-jwt-signing-key-minimum-32-chars!' }
    });

    await db.withSuperAdmin(async (tx) => {
      const orgRes = await tx.query(`
        INSERT INTO organizations (slug, name) VALUES ('aura-core', 'Aura Core Org') RETURNING id;
      `);
      testOrgId = orgRes.rows[0].id;

      const userRes = await tx.query(`
        INSERT INTO users (organization_id, email, password_hash, full_name, status)
        VALUES ($1, $2, $3, 'Aura Engineer', 'ACTIVE')
        RETURNING id;
      `, [testOrgId, testUserEmail, precomputedPasswordHash]);
      testUserId = userRes.rows[0].id;

      await tx.query(`
        INSERT INTO user_roles (user_id, organization_id, role_id)
        VALUES ($1, $2, 'ORG_ADMIN');
      `, [testUserId, testOrgId]);
    });
  });

  afterEach(async () => {
    await db.close();
  });

  // =========================================================================
  // 1. ARGON2ID PASSWORD SECURITY
  // =========================================================================
  test('Argon2id: correct password succeeds', async () => {
    const hash = await hashPasswordArgon2id(testPassword);
    const valid = await verifyPasswordArgon2id(testPassword, hash);
    assert.equal(valid, true);
  });

  test('Argon2id: incorrect password fails', async () => {
    const hash = await hashPasswordArgon2id(testPassword);
    const invalid = await verifyPasswordArgon2id('WrongPassword123!', hash);
    assert.equal(invalid, false);
  });

  test('Argon2id: plaintext password absent from DB (only Argon2id format present)', async () => {
    const res = await db.withTenant(testOrgId, async (tx) => {
      return tx.query('SELECT password_hash FROM users WHERE id = $1', [testUserId]);
    });
    const stored = res.rows[0].password_hash;

    assert.ok(stored.startsWith('$argon2id$v=19$m=65536,t=3,p=4$'));
    assert.equal(stored.includes(testPassword), false);
  });

  // =========================================================================
  // 2. JWT TOKEN SECURITY
  // =========================================================================
  test('JWT: valid token verifies with claims', () => {
    const token = jwtService.issueAccessToken({
      userId: testUserId,
      organizationId: testOrgId,
      roles: ['ORG_ADMIN'],
    });

    const decoded = jwtService.verifyAccessToken(token);
    assert.equal(decoded.sub, testUserId);
    assert.equal(decoded.tenant_id, testOrgId);
    assert.deepEqual(decoded.roles, ['ORG_ADMIN']);
    assert.equal(decoded.iss, JWT_ISSUER);
    assert.equal(decoded.aud, JWT_AUDIENCE);
    assert.equal(decoded.typ, 'access');
  });

  test('JWT: expired token is rejected', () => {
    const shortLivedJwt = new JwtService({
      secret: 'super-secure-jwt-signing-key-minimum-32-chars!',
      expiresInSeconds: -10, // already expired
    });

    const token = shortLivedJwt.issueAccessToken({
      userId: testUserId,
      organizationId: testOrgId,
      roles: ['CUSTOMER_USER'],
    });

    assert.throws(() => {
      shortLivedJwt.verifyAccessToken(token);
    }, /expired/i);
  });

  test('JWT: wrong audience is rejected', () => {
    const wrongAudienceToken = jwt.sign(
      { sub: testUserId, tenant_id: testOrgId, typ: 'access' },
      'super-secure-jwt-signing-key-minimum-32-chars!',
      { issuer: JWT_ISSUER, audience: 'unauthorized-app', expiresIn: 900 }
    );

    assert.throws(() => {
      jwtService.verifyAccessToken(wrongAudienceToken);
    }, /jwt audience invalid/i);
  });

  test('JWT: wrong issuer is rejected', () => {
    const wrongIssuerToken = jwt.sign(
      { sub: testUserId, tenant_id: testOrgId, typ: 'access' },
      'super-secure-jwt-signing-key-minimum-32-chars!',
      { issuer: 'untrusted-issuer', audience: JWT_AUDIENCE, expiresIn: 900 }
    );

    assert.throws(() => {
      jwtService.verifyAccessToken(wrongIssuerToken);
    }, /jwt issuer invalid/i);
  });

  test('JWT: wrong token type is rejected', () => {
    const wrongTypeToken = jwt.sign(
      { sub: testUserId, tenant_id: testOrgId, typ: 'refresh' }, // wrong typ
      'super-secure-jwt-signing-key-minimum-32-chars!',
      { issuer: JWT_ISSUER, audience: JWT_AUDIENCE, expiresIn: 900 }
    );

    assert.throws(() => {
      jwtService.verifyAccessToken(wrongTypeToken);
    }, /expected access token/i);
  });

  // =========================================================================
  // 3. REFRESH TOKEN ROTATION & SESSION FAMILY REVOCATION
  // =========================================================================
  test('Refresh rotation succeeds and returns new access & refresh tokens', async () => {
    const loginResult = await authService.login({
      email: testUserEmail,
      password: testPassword,
    });

    assert.ok(loginResult.accessToken);
    assert.ok(loginResult.refreshToken.startsWith('rt_'));

    // Refresh
    const refreshResult = await authService.refresh({
      refreshToken: loginResult.refreshToken,
    });

    assert.ok(refreshResult.accessToken);
    assert.ok(refreshResult.refreshToken.startsWith('rt_'));
    assert.notEqual(refreshResult.refreshToken, loginResult.refreshToken);
  });

  test('Old refresh token cannot be reused after rotation', async () => {
    const loginResult = await authService.login({
      email: testUserEmail,
      password: testPassword,
    });

    // First rotation succeeds
    await authService.refresh({
      refreshToken: loginResult.refreshToken,
    });

    // Replay of original token must fail
    await assert.rejects(async () => {
      await authService.refresh({
        refreshToken: loginResult.refreshToken,
      });
    }, /reuse detected|terminated/i);
  });

  test('Session family revocation: replaying a revoked token terminates all user sessions', async () => {
    // 1. User logs in on Device 1
    const device1 = await authService.login({
      email: testUserEmail,
      password: testPassword,
      userAgent: 'Device 1',
    });

    // 2. User logs in on Device 2
    const device2 = await authService.login({
      email: testUserEmail,
      password: testPassword,
      userAgent: 'Device 2',
    });

    // 3. Device 1 rotates token normally
    const device1_v2 = await authService.refresh({
      refreshToken: device1.refreshToken,
    });

    // 4. ATTACK: An adversary attempts to replay Device 1's old token!
    await assert.rejects(async () => {
      await authService.refresh({
        refreshToken: device1.refreshToken,
      });
    }, /reuse detected|terminated/i);

    // 5. SECURITY PROOF: Device 2 and Device 1 v2 must BOTH be revoked now!
    await assert.rejects(async () => {
      await authService.refresh({
        refreshToken: device2.refreshToken,
      });
    }, /reuse detected|invalid/i);

    await assert.rejects(async () => {
      await authService.refresh({
        refreshToken: device1_v2.refreshToken,
      });
    }, /reuse detected|invalid/i);
  });

  test('Revoked session cannot refresh after explicit logout', async () => {
    const login = await authService.login({
      email: testUserEmail,
      password: testPassword,
    });

    await authService.logout(login.refreshToken);

    await assert.rejects(async () => {
      await authService.refresh({ refreshToken: login.refreshToken });
    }, /reuse detected|invalid/i);
  });

  // =========================================================================
  // 4. RFC 6238 TOTP MULTI-FACTOR AUTHENTICATION
  // =========================================================================
  test('TOTP MFA: setup, valid token confirms, invalid token fails', async () => {
    const { secret, uri } = await authService.setupMfa({
      userId: testUserId,
      organizationId: testOrgId,
    });

    assert.ok(secret);
    assert.ok(uri.startsWith('otpauth://totp/'));

    // Generate valid current code
    const validCode = totpService.generateCurrentToken(secret);

    // Confirm MFA
    const confirmRes = await authService.confirmMfa({
      userId: testUserId,
      organizationId: testOrgId,
      token: validCode,
    });
    assert.equal(confirmRes.success, true);

    // Verify user table has mfa_enabled = true (scoped to tenant under RLS)
    const userRes = await db.withTenant(testOrgId, async (tx) => {
      return tx.query('SELECT mfa_enabled FROM users WHERE id = $1', [testUserId]);
    });
    assert.equal(userRes.rows[0].mfa_enabled, true);

    // Next login requires MFA
    const mfaRequiredLogin = await authService.login({
      email: testUserEmail,
      password: testPassword,
    });
    assert.equal(mfaRequiredLogin.mfaRequired, true);

    // Login with invalid code fails
    await assert.rejects(async () => {
      await authService.login({
        email: testUserEmail,
        password: testPassword,
        mfaCode: '000000',
      });
    }, /invalid or expired mfa/i);

    // Login with valid code succeeds
    const fullLogin = await authService.login({
      email: testUserEmail,
      password: testPassword,
      mfaCode: totpService.generateCurrentToken(secret),
    });
    assert.ok(fullLogin.accessToken);
  });

  test('TOTP MFA: expired token fails outside tolerance window', () => {
    const { secret } = totpService.generateMfaSetup('test@user.com');
    // Generate token from 5 minutes ago (300,000 ms ago)
    const expiredTimestamp = Date.now() - 300000;
    const expiredToken = totpService.generateCurrentToken(secret, expiredTimestamp);

    const isValidNow = totpService.verifyToken(expiredToken, secret, Date.now());
    assert.equal(isValidNow, false);
  });

  // =========================================================================
  // 5. ANTI-ENUMERATION & SECURITY DEFENSES
  // =========================================================================
  test('Authentication failure does not disclose account existence', async () => {
    // Non-existent email
    await assert.rejects(async () => {
      await authService.login({
        email: 'ghost-account@doesnotexist.com',
        password: 'AnyPassword123!',
      });
    }, (err) => {
      assert.equal(err.code, 'UNAUTHORIZED');
      assert.equal(err.message, 'Invalid email or password');
      return true;
    });

    // Real email, wrong password
    await assert.rejects(async () => {
      await authService.login({
        email: testUserEmail,
        password: 'WrongPassword!',
      });
    }, (err) => {
      assert.equal(err.code, 'UNAUTHORIZED');
      assert.equal(err.message, 'Invalid email or password');
      return true;
    });
  });

  // =========================================================================
  // 6. AUDIT EVENTS FOR SECURITY-SENSITIVE AUTHENTICATION ACTIONS
  // =========================================================================
  test('Audit events: security-sensitive actions emit tamper-evident audit records', async () => {
    // 1. Successful Login
    const login = await authService.login({
      email: testUserEmail,
      password: testPassword,
    });

    // 2. Failed Login attempt
    try {
      await authService.login({
        email: testUserEmail,
        password: 'WrongPassword!',
      });
    } catch {}

    // 3. Logout
    await authService.logout(login.refreshToken);

    // 4. Query audit events for the tenant under RLS
    const auditRes = await db.withTenant(testOrgId, async (tx) => {
      return tx.query(`
        SELECT sequence_number, organization_id, action, actor_id, status,
               prev_event_hash, event_hash, timestamp_utc, context_json, resource_type, resource_id
        FROM audit_events
        WHERE organization_id = $1
        ORDER BY sequence_number ASC;
      `, [testOrgId]);
    });

    const events = auditRes.rows;
    assert.ok(events.length >= 3);

    const actions = events.map(e => e.action);
    assert.ok(actions.includes('USER_LOGIN_SUCCESS'));
    assert.ok(actions.includes('USER_LOGIN_FAILED'));
    assert.ok(actions.includes('USER_LOGOUT'));

    // Verify unbroken cryptographic hash chain
    const chainResult = verifyAuditChain(events);
    assert.equal(chainResult.valid, true);
  });

  test('MFA secret is never logged or exposed in audit events', async () => {
    const { secret } = await authService.setupMfa({
      userId: testUserId,
      organizationId: testOrgId,
    });

    // Query audit events for MFA setup
    const auditRes = await db.withTenant(testOrgId, async (tx) => {
      return tx.query(`
        SELECT context_json
        FROM audit_events
        WHERE action = 'MFA_SETUP_REQUESTED' AND organization_id = $1;
      `, [testOrgId]);
    });

    assert.equal(auditRes.rows.length, 1);
    const rawContext = JSON.stringify(auditRes.rows[0].context_json);
    // Secret must NEVER be present in audit context
    assert.equal(rawContext.includes(secret), false);
  });
});
