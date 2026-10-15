import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { Logger, sanitize } from '../src/logger/index.js';

describe('Logger & Secret Sanitizer', () => {
  test('sanitize() redacts sensitive keys recursively', () => {
    const sensitiveObj = {
      user: 'admin',
      password: 'plain_password_123',
      nested: {
        token: 'jwt.token.here',
        api_key: 'sk_live_12345',
        safe_field: 'safe_value',
        credentials: {
          secret: 'shh_secret',
          private_key: '---BEGIN RSA---'
        }
      },
      list: [
        { authorization: 'Bearer secret_bearer_token' },
        { cookie: 'session=123' },
        { normal: 'ok' }
      ]
    };

    const cleaned = sanitize(sensitiveObj);

    assert.equal(cleaned.user, 'admin');
    assert.equal(cleaned.password, '[REDACTED]');
    assert.equal(cleaned.nested.token, '[REDACTED]');
    assert.equal(cleaned.nested.api_key, '[REDACTED]');
    assert.equal(cleaned.nested.safe_field, 'safe_value');
    assert.equal(cleaned.nested.credentials.secret, '[REDACTED]');
    assert.equal(cleaned.nested.credentials.private_key, '[REDACTED]');
    assert.equal(cleaned.list[0].authorization, '[REDACTED]');
    assert.equal(cleaned.list[1].cookie, '[REDACTED]');
    assert.equal(cleaned.list[2].normal, 'ok');
  });

  test('sanitize() redacts Bearer tokens embedded in strings', () => {
    const headerStr = 'Client sent Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature';
    const cleaned = sanitize(headerStr);
    assert.equal(cleaned, 'Client sent Bearer [REDACTED]');
  });

  test('Logger outputs structured JSON with redacted context', () => {
    const logs = [];
    const captureStream = (line) => logs.push(JSON.parse(line));
    const testLogger = new Logger({ service: 'test-service', level: 'info', outputStream: captureStream });

    testLogger.info('User login attempt', {
      correlation_id: 'corr-123',
      organization_id: 'org-456',
      user_id: 'usr-789',
      extra: {
        email: 'user@example.com',
        password: 'mySecretPassword'
      }
    });

    assert.equal(logs.length, 1);
    const log = logs[0];
    assert.equal(log.level, 'INFO');
    assert.equal(log.service, 'test-service');
    assert.equal(log.message, 'User login attempt');
    assert.equal(log.correlation_id, 'corr-123');
    assert.equal(log.organization_id, 'org-456');
    assert.equal(log.user_id, 'usr-789');
    assert.equal(log.context.email, 'user@example.com');
    assert.equal(log.context.password, '[REDACTED]');
  });
});
