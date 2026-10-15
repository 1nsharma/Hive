# Production Hardening Policies & Security Headers (v1.0)

This blueprint outlines the system-level hardening rules, security configurations, input sanitization routines, and defense-in-depth measures configured across DukaanMitra (BazaarSync).

---

## 1. HTTP Security Headers Hardening

The production Nginx ingress and Express middleware configurations are hardened to block standard web vulnerability vectors:

- **Strict-Transport-Security (HSTS)**: Forces web browsers to interact with the platform exclusively using HTTPS.
  ```http
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```
- **X-Frame-Options**: Prevents clickjacking attacks by blocking the application from being loaded inside iframes on untrusted third-party domains.
  ```http
  X-Frame-Options: SAMEORIGIN
  ```
- **X-Content-Type-Options**: Blocks browsers from sniffing response mime-types away from declared types.
  ```http
  X-Content-Type-Options: nosniff
  ```
- **Content-Security-Policy (CSP)**: Locks script execution sources to verified CDNs and domain boundaries, protecting users from Cross-Site Scripting (XSS) vectors.

---

## 2. API Input Sanitization & Payload Controls

To defend against SQL Injection, Cross-Site Scripting, and buffer overflow vectors:

- **Drizzle ORM Sanitization**: All database queries are executed using **Drizzle ORM** parameterization. Raw string concatenations in database queries are strictly prohibited, neutralizing SQL injection vectors entirely.
- **XSS Prevention on Input**: All incoming natural language inputs, customer names, and product tags are trimmed and sanitized to strip dangerous script tags prior to database insertion.
- **Body-Size Restricting Middleware**:
  ```ts
  // Restrict body size limits to prevent Denial of Service (DoS) attempts
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  ```
  While the OCR bill scanner permits up to 50MB to support high-resolution phone camera uploads, conversational text routes are monitored at the application gateway to reject abnormally long string payloads (>10KB).

---

## 3. Database & Connection Hardening

- **SSL Connection Requirement**: Connections between Cloud Run containers and the Cloud SQL PostgreSQL instance enforce SSL encryption to secure transit data.
- **Connection Leak Prevention**: Database sessions are pooled dynamically using maximum connection caps to prevent connection exhaustion.
- **Zero Default Password Rules**: All developer environments and sandbox databases require strong, randomly generated passwords. Database passwords are never checked into git.

---

## Related Documents

- [Security Control Registry](./SECURITY_REGISTRY.md)
- [Identity & Access Management (IAM)](./IAM.md)
- [Incident Response Manual](./INCIDENT_RESPONSE.md)
