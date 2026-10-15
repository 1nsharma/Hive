/**
 * Aura v1: Zero-Credentials Structured JSON Logger
 * Automatically redacts secrets, tokens, passwords, and sensitive credentials recursively.
 */

const SECRET_KEY_PATTERN = /(password|secret|token|authorization|cookie|jwt|cred|api_key|secret_key|private_key|signing_key|refresh_token|access_token|^key$)/i;

/**
 * Recursively redacts sensitive keys from objects and arrays.
 * @param {any} value
 * @returns {any} Sanitized clone of value
 */
export function sanitize(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Redact Bearer tokens in raw strings
    if (/bearer\s+[a-zA-Z0-9._-]+/i.test(value)) {
      return value.replace(/bearer\s+[a-zA-Z0-9._-]+/gi, 'Bearer [REDACTED]');
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === 'object') {
    const sanitizedObj = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'object' && v !== null) {
        sanitizedObj[k] = sanitize(v);
      } else if (SECRET_KEY_PATTERN.test(k)) {
        sanitizedObj[k] = '[REDACTED]';
      } else {
        sanitizedObj[k] = sanitize(v);
      }
    }
    return sanitizedObj;
  }

  return value;
}

export class Logger {
  /**
   * @param {Object} options
   * @param {string} [options.service='aura']
   * @param {string} [options.level='info']
   * @param {Function} [options.outputStream=console.log]
   */
  constructor(options = {}) {
    this.service = options.service || 'aura';
    this.level = options.level || (process.env.LOG_LEVEL || 'info');
    this.outputStream = options.outputStream || console.log;
    this.levels = { debug: 10, info: 20, warn: 30, error: 40 };
  }

  _shouldLog(lvl) {
    return (this.levels[lvl] || 20) >= (this.levels[this.level] || 20);
  }

  _write(lvl, message, context = {}) {
    if (!this._shouldLog(lvl)) return null;

    const payload = {
      timestamp: new Date().toISOString(),
      level: lvl.toUpperCase(),
      service: this.service,
      message,
      correlation_id: context.correlation_id || null,
      organization_id: context.organization_id || null,
      user_id: context.user_id || null,
      context: sanitize(context.extra || context),
    };

    // Remove top-level redundant context fields from context.context
    if (typeof payload.context === 'object' && payload.context !== null) {
      delete payload.context.correlation_id;
      delete payload.context.organization_id;
      delete payload.context.user_id;
      delete payload.context.extra;
    }

    const jsonStr = JSON.stringify(payload);
    this.outputStream(jsonStr);
    return payload;
  }

  debug(msg, ctx = {}) { return this._write('debug', msg, ctx); }
  info(msg, ctx = {}) { return this._write('info', msg, ctx); }
  warn(msg, ctx = {}) { return this._write('warn', msg, ctx); }
  error(msg, ctx = {}) { return this._write('error', msg, ctx); }
}

export const logger = new Logger({ service: process.env.SERVICE_NAME || 'aura-api' });
