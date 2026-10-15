# Security Architecture Mapping

**Section:** 10. Security  
**Status:** ✅ Completed  
**Owner:** Permanent Chief Information Security Officer (CISO)  
**Last updated:** 2026-07-25  

---

## Purpose

This document outlines the high-level security architecture, threat defenses, cryptographic standards, and runtime validations implemented to protect DukaanMitra (BazaarSync).

---

## Content

DukaanMitra integrates complete, defense-in-depth security policies across its front-end client, backend proxy, and Cloud database layers:

1. **Secure Session Proxying**: Clients interact with remote AI APIs (Gemini) and database resources exclusively via rate-limited, validated Express routes. Secrets like `GEMINI_API_KEY` are kept on the server-side, preventing credential leaks.
2. **Cryptographic Foundations**: The server uses standard HMAC-SHA256 for local session JWTs and cryptographically irreversible SHA-256 hashes to mask Personally Identifiable Information (PII) before logs are generated.
3. **Database Guardrails**: Multi-tenant database operations are parameterized using Drizzle ORM, neutralizing SQL injection vectors.

For complete, detailed security specs, encryption protocols, and auditing trails, reference the master blueprints:
- [Security Control & Vulnerability Registry](../SECURITY_REGISTRY.md)
- [Identity & Access Management (IAM) Blueprint](../IAM.md)
- [Production Hardening Policies & Security Headers](../PRODUCTION_HARDENING.md)

---

## Related Documents

- [Security Control Registry](../SECURITY_REGISTRY.md)
- [Identity & Access Management (IAM) Blueprint](../IAM.md)
- [Production Hardening Policies](../PRODUCTION_HARDENING.md)
