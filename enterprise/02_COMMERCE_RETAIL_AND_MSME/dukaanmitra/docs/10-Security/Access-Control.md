# Access Control & Multi-Tenancy Mapping

**Section:** 10. Security  
**Status:** ✅ Completed  
**Owner:** Permanent Chief Information Security Officer (CISO)  
**Last updated:** 2026-07-25  

---

## Purpose

This document outlines the user authentication flows, Role-Based Access Control (RBAC) levels, and SQL-level tenant isolation boundaries configured across DukaanMitra (BazaarSync).

---

## Content

DukaanMitra restricts platform access to authorized merchant owners and platform administrators using rigorous checking systems:

1. **Integrated Auth Verification**: The middleware parses Firebase ID Tokens or local JWTs to dynamically inject authenticated merchant identities (`req.dbUser`).
2. **Access Security Mapping**: Standard user routes enforce authenticated sessions. SRE/Admin routes check incoming user emails against process environment listings (`ADMIN_EMAILS`) to restrict administration features.
3. **Strict Row-Level SQL Isolation**: All Drizzle ORM transactions join and query the database using the session's verified `userId` key, preventing cross-tenant information leaks.

For complete, detailed endpoint mapping sheets and SQL queries examples, reference the master files:
- [Role-Based Access Control (RBAC) Architecture](../RBAC.md)
- [Privacy-by-Design & PII Protection Blueprint](../PRIVACY.md)

---

## Related Documents

- [Role-Based Access Control (RBAC) Architecture](../RBAC.md)
- [Privacy-by-Design & PII Protection Blueprint](../PRIVACY.md)
