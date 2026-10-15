# Database Security & Access Control Blueprint (v1.0)

This blueprint records the security standards, row-level multi-tenant isolation architectures, cryptographic credentials storage, and compliance controls active in the DukaanMitra database layer.

---

## 1. Relational Row-Level Isolation Architecture

DukaanMitra ensures logical tenant separation in a shared-database environment through **Implicit Parameterized Query Filtering**. This rule prevents cross-tenant data leaks or unauthorized data modification.

```
                  [Client DB Mutation Request]
                               |
                 [Verify Authentication Token]
                               |
                    (Extract `dbUser.id` = 42)
                               |
                               v
            [Drizzle Query Compiler Injection]
  - Adds constraint: `where(eq(table.userId, 42))`
                               |
                               v
               [Safe PostgreSQL Execution]
```

### 1.1 Strict Isolation Policies
1. **Explicit Identity Binding**: Every SQL statement querying transactions, products, stock adjustments, customer profiles, or store settings must be explicitly bound with the current user's ID:
   ```ts
   // Query pattern enforced across all operational controllers
   const customerRecords = await db.select()
     .from(customers)
     .where(eq(customers.userId, req.dbUser.id));
   ```
2. **Pre-mutation Checks**: Put/Delete routes verify ownership prior to executing modifications. If an entity is requested that does not exist under the active tenant's `userId`, the server returns `404 Not Found` or `403 Forbidden` instantly.
3. **No Cross-User Joins**: Joins are restricted to tables owning matching `userId` references, preventing cross-tenant leakage.

---

## 2. Cryptographic Storage & Anonymization

To protect sensitive merchant and customer databases under standard compliance mandates:
- **Hashing Core Demographics**: For guest/demo operations, conversational records and customer phone directories are encoded into SHA-256 hashes inside `market_research` columns (`userHash`, `customerHash`), protecting identities.
- **Upstream AI Cache Isolation**: Prompt caches (`ai_cache`) are stored using highly secure MD5 hashes of prompt text or image base64 arrays as unique identifiers. Raw user secrets or plain-text credentials are stripped before cache checks.

---

## 3. Administrative Safety Guards

Administration endpoints (`/api/admin/*`) are protected using the `requireAdmin` security wrapper:
- **JWT Verification**: Validates that the JWT contains administrative claims signed with the server's private `JWT_SECRET`.
- **Whitelisting**: Authenticating admins must match emails registered under the server's `ADMIN_EMAILS` environment variable arrays.
- **Immutable Log Auditing**: Security events (login attempts, whitelisting validation, database clear-caches) write entries into the `user_logs` database table. These records are write-only with no modification or deletion endpoints provided.

---

## 4. Retentions & Backups Policy

- **Disaster Recovery**: Periodic database backups are managed directly via Google Cloud SQL automated backup pipelines, supporting Point-in-Time recovery (PITR).
- **Secrets Encryption**: Secrets (such as `DATABASE_URL` and `GEMINI_API_KEY`) are managed as secret values inside Google Secret Manager rather than being committed to repository files.
