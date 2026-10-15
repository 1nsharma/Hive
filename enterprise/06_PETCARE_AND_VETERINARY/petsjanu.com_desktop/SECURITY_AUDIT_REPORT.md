# Security Audit Report - PetJanu Application

## Executive Summary

A comprehensive security audit was conducted on the PetJanu application codebase. Several vulnerabilities and security concerns were identified and prioritized based on severity.

---

## Vulnerabilities Identified

### 1. **CRITICAL: Hardcoded Credentials in Source Code**

**Location:** `/workspace/src/lib/supabase.ts` (lines 19-20)
**Severity:** CRITICAL
**Issue:** Default/fallback Supabase credentials are hardcoded in the source code
```typescript
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://xyzcompany.supabase.co'));
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY3MjI0OTYwMCwiZXhwIjoyMDAzODI1NjAwfQ.demoKey'));
```

**Risk:** If environment variables are not set, the application uses demo credentials that could expose data or allow unauthorized access.

**Location:** `/workspace/src/lib/firebase.ts` (lines 8-13)
**Severity:** CRITICAL
**Issue:** Firebase configuration contains hardcoded demo credentials
```typescript
apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyPetJanuDemoKey2026",
authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "petjanu-app.firebaseapp.com",
projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "petjanu-app",
```

**Risk:** Demo credentials in production could lead to unauthorized access to Firebase services.

---

### 2. **HIGH: Node.js Crypto Module Used in Browser Code**

**Location:** `/workspace/src/lib/pets/privacy-guardrails.ts` (line 1)
**Severity:** HIGH
**Issue:** The `crypto` Node.js module is imported in client-side code
```typescript
import crypto from "crypto";
```

**Risk:** The `crypto` module is a Node.js-only module and will not work in browser environments. This will cause runtime errors in the browser. Should use Web Crypto API instead.

---

### 3. **MEDIUM: In-Memory Rate Limiter Not Production-Ready**

**Location:** `/workspace/src/lib/pets/privacy-guardrails.ts` (lines 117-156)
**Severity:** MEDIUM
**Issue:** In-memory rate limiter won't work in distributed/serverless environments
```typescript
const rateLimitBuckets = new Map<string, RateLimitBucket>();
```

**Risk:** In production with multiple instances, rate limiting will be ineffective as each instance has its own memory. Comment acknowledges this but implementation remains.

---

### 4. **MEDIUM: OTP Verification Uses Weak Validation**

**Location:** `/workspace/api/auth/otp.ts` (lines 23-34)
**Severity:** MEDIUM
**Issue:** OTP verification accepts any 4-digit code or hardcoded '1234'
```typescript
if (otp === '1234' || otp?.length === 4) {
  return res.status(200).json({
    // ...
    token: 'mock-jwt-token-' + Date.now()
  });
}
```

**Risk:** While marked as demo, if this code reaches production, any 4-digit OTP would be accepted, completely bypassing authentication.

---

### 5. **LOW: Predictable JWT Token Generation**

**Location:** `/workspace/api/auth/otp.ts` (line 31)
**Severity:** LOW
**Issue:** Mock JWT tokens are predictable
```typescript
token: 'mock-jwt-token-' + Date.now()
```

**Risk:** Tokens can be easily guessed or brute-forced in demo mode.

---

### 6. **LOW: Missing Input Sanitization on Some User Inputs**

**Location:** `/workspace/api/chat/index.ts` (lines 58-60)
**Severity:** LOW
**Issue:** While basic trimming and length limits are applied, user input is directly interpolated into prompts
```typescript
const message = typeof body.message === 'string' ? body.message.trim() : '';
const petName = typeof body.petName === 'string' ? body.petName.trim().slice(0, 100) : '';\nconst petSpecies = typeof body.petSpecies === 'string' ? body.petSpecies.trim().slice(0, 50) : '';
```

**Risk:** Potential prompt injection attacks. Though the prompt includes protection text, additional sanitization would be safer.

---

### 7. **INFO: Test Data Contains Real Phone Numbers**

**Location:** `/workspace/src/lib/pets/privacy-guardrails.ts` (lines 216, 239, 262)
**Severity:** INFO
**Issue:** Sample data contains what appear to be real phone number formats
```typescript
ownerPhone: "+91 63937 41171",
ownerPhone: "+91 98111 22233",
ownerPhone: "+91 98765 43210"
```

**Risk:** If these are real numbers, it's a privacy violation. Should use clearly fake test numbers.

---

## Recommendations

### Immediate Actions Required:

1. **Remove all hardcoded credentials** from source code
   - Replace with proper environment variable validation
   - Fail securely if required credentials are missing
   - Never commit actual credentials to version control

2. **Replace Node.js crypto with Web Crypto API**
   - Use `window.crypto.subtle` for browser environments
   - Keep Node.js crypto only in server-side code

3. **Implement proper OTP validation**
   - Even in demo mode, use a more secure approach
   - Add clear warnings that demo auth should never be used in production

4. **Use Redis or similar for rate limiting in production**
   - Implement proper distributed rate limiting
   - Don't rely on in-memory storage for security controls

### Best Practices to Implement:

5. **Add Content Security Policy (CSP) headers**
6. **Implement proper CSRF protection for state-changing operations**
7. **Add input validation libraries (e.g., zod, joi) for all user inputs**
8. **Use parameterized queries (already using Supabase client - good)**
9. **Implement proper session management with secure cookies**
10. **Add security headers (HSTS, X-Frame-Options, X-Content-Type-Options, etc.)**

---

## Positive Security Findings

✅ **Good Practices Observed:**

1. **PII Redaction**: Proper masking of emails and phone numbers in privacy guardrails
2. **Prompt Injection Protection**: AI chat endpoint includes protection against prompt injection
3. **Environment Variable Separation**: Server-side APIs properly use `process.env` (not VITE_ prefix)
4. **Webhook Signature Verification**: Razorpay webhook implements HMAC signature verification
5. **Input Length Limits**: User inputs are properly bounded (e.g., message.slice(0, 4000))
6. **Type Validation**: Proper type checking on request bodies
7. **CORS Configuration**: Proper origin validation implemented
8. **Error Monitoring PII Scrubbing**: Error monitoring service scrubs PII from error reports

---

## Files Requiring Immediate Attention

1. `/workspace/src/lib/supabase.ts` - Remove hardcoded credentials
2. `/workspace/src/lib/firebase.ts` - Remove hardcoded credentials  
3. `/workspace/src/lib/pets/privacy-guardrails.ts` - Replace Node.js crypto with Web Crypto API
4. `/workspace/api/auth/otp.ts` - Strengthen OTP validation, even for demo
5. `.env.example` - Ensure all required variables are documented

---

## Conclusion

The codebase demonstrates good security awareness with PII protection, proper CORS handling, and webhook signature verification. However, the presence of hardcoded credentials and Node.js-specific modules in browser code must be addressed immediately before production deployment.

**Priority:** Fix CRITICAL and HIGH severity issues before any production release.
