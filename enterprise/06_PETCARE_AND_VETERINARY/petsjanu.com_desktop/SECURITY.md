# 🛡️ Security Policy & Data Protection Practice

At **PetJanu** (`petsjanu.com`), safeguarding pet parents' personal data, contact details, and pet medical records is our top priority. This document outlines our security architecture and vulnerability reporting process.

---

## 🔒 Security Practices & Architecture

### 1. Privacy-Preserving Contact Relays
- When a lost pet's QR or NFC tag is scanned by a finder, owner phone numbers are **never displayed in clear text**.
- Finders connect with owners via masked relay phone calls or encrypted WhatsApp notifications.

### 2. API Key & Secret Management
- All sensitive keys (Gemini AI API keys, Razorpay secrets, Supabase service role keys) are strictly stored in server-side environment variables (`.env.local` / Cloud Run secrets).
- Secrets are **never bundled into client-side JavaScript binaries**.

### 3. Data Encryption
- **In Transit:** All HTTP traffic is enforced over TLS 1.3/HTTPS.
- **At Rest:** Database instances (Firestore / Supabase PostgreSQL) use AES-256 encryption at rest.

### 4. Input Sanitization & XSS Defense
- All user-submitted content (sighting reports, pet names, notes) is sanitized and rendered securely through React's auto-escaping mechanism.
- Webhook endpoints (e.g. Razorpay payment webhooks) enforce cryptographic HMAC SHA-256 signature validation before processing events.

---

## 🐛 Reporting a Vulnerability

If you discover a security vulnerability or security bug in PetJanu, please disclose it responsibly:

1. **Email:** Send details to `security@petsjanu.com`
2. **Details to Include:**
   - Description of the vulnerability and affected endpoint/page.
   - Step-by-step proof-of-concept (PoC) or reproduction steps.
   - Any potential impact on user privacy or system integrity.

### Our Commitment
- We acknowledge receiving report submissions within **24 hours**.
- We do not take legal action against security researchers who conduct ethical vulnerability research and disclose issues responsibly without compromising user data.
