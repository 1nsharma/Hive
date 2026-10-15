# Security Control & Vulnerability Registry (v1.0)

This registry catalogs the security control vectors, cryptographic algorithms, network policies, and vulnerability prevention parameters active across the DukaanMitra (BazaarSync) platform.

---

## 1. Authentication Control Infrastructure

The platform implements a multi-tier authentication model to secure merchant resources:

- **Primary Identity Provider**: Firebase Authentication (ID Token verification) handles SMS One-Time Passwords (OTP) and Google Sign-On.
- **Verification Middleware**: The `requireAuth` middleware verifies incoming Authorization bearer tokens server-side using the `firebase-admin` SDK.
- **Local / Admin JWTs**: A secondary validation flow checks for custom, secure JSON Web Tokens (signed with a private `JWT_SECRET`) to authenticate admin CLI scripts and mock testing sessions.
- **Identity Sync**: Successfully verified identities are automatically synchronized with PostgreSQL using the `getOrCreateUser` routine, binding a local sequential `id` to the foreign Firebase `uid`.

---

## 2. Active Cryptographic Standard Registry

DukaanMitra ensures data integrity and privacy using standardized cryptographic primitives:

| Use Case | Target Field / Key | Algorithm | Implementation Library |
| :--- | :--- | :---: | :--- |
| **Token Signing** | JWT Authentication tokens | HMAC-SHA256 | `jsonwebtoken` (server-side) |
| **Demographic Masking**| Log hashes, user coordinates | SHA-256 | `crypto` standard node library |
| **AI Cache Lookup** | Prompt caching indexes | MD5 / SHA-256 | `crypto` standard node library |
| **Transit Security** | API connections, UI iframe | TLS 1.3 / 1.2 | HTTPS via Google Cloud Run |

---

## 3. Network & API Ingress Security Policies

To secure system endpoints from unauthorized automated probes:

- **HTTPS Ingress**: Enforced strictly at the Nginx reverse-proxy layer. All unencrypted HTTP traffic is permanently redirected using `301 Moved Permanently`.
- **CORS Constraints**: Restricts incoming requests to whitelisted subdomains, rejecting unauthenticated cross-origin resources.
- **IFrame Restricting Headers**: Set `X-Frame-Options: SAMEORIGIN` and standard `Content-Security-Policy` limits to block clickjacking attempts inside external browser windows.
- **Payload Limits**: Strict HTTP body constraints block overflow attempts:
  - Multimodal OCR scanner: Max `50 MB` limit.
  - Conversational parsing: Max `10 KB` limit.

---

## Related Documents

- [Role-Based Access Control (RBAC)](./RBAC.md)
- [Identity & Access Management (IAM)](./IAM.md)
- [Privacy & Consent Blueprint](./PRIVACY.md)
- [Production Hardening Policies](./PRODUCTION_HARDENING.md)
- [Incident Response Manual](./INCIDENT_RESPONSE.md)
