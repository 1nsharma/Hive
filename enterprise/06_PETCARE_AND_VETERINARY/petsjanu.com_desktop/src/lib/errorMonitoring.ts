/**
 * PetJanu Client Error Monitoring & Telemetry Engine
 * Standardized reporting pipeline with automatic PII sanitization.
 */

export interface ErrorEventPayload {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  timestamp: string;
  userAgent: string;
  environment: string;
  metadata?: Record<string, any>;
}

// Sensitive PII regex patterns to scrub before sending errors
const PII_PATTERNS = [
  /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g, // Phone numbers
  /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, // Email addresses
  /(rzp_(live|test)_[a-zA-Z0-9]+)/g, // Razorpay Keys
  /(AIzaSy[a-zA-Z0-9_-]{35})/g, // Google API Keys
  /(sbp_[a-zA-Z0-9]+)/g, // Supabase Tokens
];

/**
 * Scrubs any sensitive PII (emails, phone numbers, secret tokens) from error strings.
 */
export function sanitizePii(input: string): string {
  if (!input) return '';
  let sanitized = input;
  for (const pattern of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED_PII]');
  }
  return sanitized;
}

/**
 * Main error capture handler for frontend React components & global window listeners.
 */
export function captureException(error: Error | string, errorInfo?: { componentStack?: string }, metadata?: Record<string, any>) {
  const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown Error';
  const stack = typeof error === 'object' && error.stack ? error.stack : '';

  const payload: ErrorEventPayload = {
    message: sanitizePii(errorMessage),
    stack: sanitizePii(stack),
    componentStack: errorInfo?.componentStack ? sanitizePii(errorInfo.componentStack) : undefined,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    environment: (import.meta as unknown as { env?: { MODE?: string } }).env?.MODE || 'production',
    metadata: metadata ? JSON.parse(sanitizePii(JSON.stringify(metadata))) : undefined,
  };

  // Log telemetry info message
  console.info('[PetJanu Telemetry]', payload.message);

  // Forward to /api/telemetry/errors endpoint if online
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    fetch('/api/telemetry/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Fail silently to avoid infinite error loops
    });
  }
}

/**
 * Initializes global uncaught error and unhandled rejection listeners.
 */
export function initErrorMonitoring() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    // Ignore element resource loading errors (e.g., img or script tags failing to load)
    if (event.target && event.target !== window) return;
    if (!event.error && !event.message) return;

    captureException(event.error || event.message, undefined, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (!event.reason) return;
    captureException(event.reason || 'Unhandled Promise Rejection', undefined, {
      type: 'unhandledrejection',
    });
  });
}
