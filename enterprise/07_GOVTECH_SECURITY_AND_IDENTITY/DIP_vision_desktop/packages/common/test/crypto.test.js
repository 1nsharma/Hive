import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  sha256, 
  hashPassword, 
  verifyPassword, 
  computeAuditEventHash, 
  verifyAuditChain 
} from '../src/crypto/index.js';

describe('Cryptographic Primitives & Audit Hash Chain', () => {
  test('sha256() computes 64-character hex digest', () => {
    const hash = sha256('aura-vision');
    assert.equal(hash.length, 64);
    assert.equal(typeof hash, 'string');
  });

  test('hashPassword() and verifyPassword() verify correct password and reject wrong password', async () => {
    const password = 'SuperSecretPassword123!';
    const hashed = await hashPassword(password);

    assert.ok(hashed.startsWith('scrypt$'));
    assert.ok(!hashed.includes(password)); // No plaintext leakage

    const valid = await verifyPassword(password, hashed);
    assert.equal(valid, true);

    const wrong = await verifyPassword('WrongPassword!', hashed);
    assert.equal(wrong, false);
  });

  test('computeAuditEventHash() and verifyAuditChain() validate unbroken chain', () => {
    const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const orgId = '018f2d50-7a31-7e89-a567-890123456789';

    // Event 1
    const event1 = {
      prev_event_hash: genesisHash,
      sequence_number: 1,
      organization_id: orgId,
      timestamp_utc: '2026-09-20T23:00:00Z',
      actor_id: 'user-1',
      action: 'USER_CREATED',
      resource_type: 'USER',
      resource_id: 'user-2',
      status: 'SUCCESS',
      context_json: { email: 'user2@example.com' }
    };
    event1.event_hash = computeAuditEventHash(event1);

    // Event 2 (links to event 1)
    const event2 = {
      prev_event_hash: event1.event_hash,
      sequence_number: 2,
      organization_id: orgId,
      timestamp_utc: '2026-09-20T23:01:00Z',
      actor_id: 'user-1',
      action: 'ROLE_ASSIGNED',
      resource_type: 'USER',
      resource_id: 'user-2',
      status: 'SUCCESS',
      context_json: { role: 'LOCATION_ADMIN' }
    };
    event2.event_hash = computeAuditEventHash(event2);

    // Event 3 (links to event 2)
    const event3 = {
      prev_event_hash: event2.event_hash,
      sequence_number: 3,
      organization_id: orgId,
      timestamp_utc: '2026-09-20T23:02:00Z',
      actor_id: 'user-2',
      action: 'LOCATION_CREATED',
      resource_type: 'LOCATION',
      resource_id: 'loc-1',
      status: 'SUCCESS',
      context_json: { name: 'Main Gate' }
    };
    event3.event_hash = computeAuditEventHash(event3);

    const chain = [event1, event2, event3];
    const result = verifyAuditChain(chain);
    assert.equal(result.valid, true);
  });

  test('verifyAuditChain() detects tampering in past events', () => {
    const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const orgId = '018f2d50-7a31-7e89-a567-890123456789';

    const event1 = {
      prev_event_hash: genesisHash,
      sequence_number: 1,
      organization_id: orgId,
      timestamp_utc: '2026-09-20T23:00:00Z',
      actor_id: 'user-1',
      action: 'USER_CREATED',
      resource_type: 'USER',
      resource_id: 'user-2',
      status: 'SUCCESS',
      context_json: { email: 'user2@example.com' }
    };
    event1.event_hash = computeAuditEventHash(event1);

    const event2 = {
      prev_event_hash: event1.event_hash,
      sequence_number: 2,
      organization_id: orgId,
      timestamp_utc: '2026-09-20T23:01:00Z',
      actor_id: 'user-1',
      action: 'ROLE_ASSIGNED',
      resource_type: 'USER',
      resource_id: 'user-2',
      status: 'SUCCESS',
      context_json: { role: 'ORG_ADMIN' }
    };
    event2.event_hash = computeAuditEventHash(event2);

    // Tamper with event 1 context after creation
    event1.context_json = { email: 'hacked@malicious.com' };

    const corruptedResult = verifyAuditChain([event1, event2]);
    assert.equal(corruptedResult.valid, false);
    assert.equal(corruptedResult.brokenSequence, 1);
    assert.ok(corruptedResult.reason.includes('Hash mismatch'));
  });
});
