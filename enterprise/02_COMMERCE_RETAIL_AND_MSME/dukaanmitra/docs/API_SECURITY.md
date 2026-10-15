# API Security & Authorization Blueprint (v1.0)

This blueprint documents the access control levels, cryptographic verification paths, tenant data isolation systems, and security audit loops active across DukaanMitra (BazaarSync).

---

## 1. Dual-Source Authentication Pathway

To support multiple operational profiles (standard registered shopkeepers, local guest sandboxes, and platform founders/admins), the gateway implements a dual-source token verification middleware (`src/middleware/auth.ts`):

```
       [Incoming HTTP Bearer Token]
                    |
          +---------+---------+
          |                   |
          v                   v
[Local Custom JWT Decode]   [Firebase IdToken Verify]
(Checks `admin_ssh` /       (Checks standard Firebase
 `mock_user` signatures)     authorization accounts)
          |                   |
          +---------+---------+
                    |
                    v
          [User Profile Verified]
                    |
                    v
        [Inject `dbUser` to Req]
```

1. **Custom JWT Decoder**: Decodes tokens signed with the server's local `JWT_SECRET`.
   - If payload type is `admin_ssh`, it grants administrative privileges (`req.isAdmin = true`) and retrieves the administrator's account record.
   - If payload type is `mock_user`, it bypasses external Firebase API lookups, letting guest sandboxes authenticate securely.
2. **Firebase Auth Verify**: If custom decoding is not applicable, the Bearer payload is passed to the Firebase Admin SDK (`adminAuth.verifyIdToken()`) to verify the token signature and bind the session to an authentic cloud identity.
3. **Failsafe Parsing**: If network drops disrupt standard verification services, the token is decoded unsafely (`jwt.decode`) to extract existing coordinates (`user_id`, `email`), preventing service blockage for offline users.

---

## 2. Multi-Tenant Database Isolation

We apply strict multi-tenant database isolation at the SQL query level:
- **Tenant Identifier Binding**: Every standard query on transactions, products, stock modifications, and settings is permanently filtered by the authenticated user's unique ID (`req.dbUser.id`).
- **No Global Operations**: The application is strictly forbidden from executing un-indexed queries on ledger tables without matching the `userId` column, preventing cross-tenant data leakages.

---

## 3. Route Guard Access Matrix

Each route handler is wrapped with specific middleware to enforce appropriate roles:

| Access Guard | Policy | Intended Endpoints |
| :--- | :--- | :--- |
| **`requireAuth`** | Validates JWT signatures and blocks anonymous requests with `401`. | `/api/db`, `/api/settings`, `/api/transactions`, `/api/products` |
| **`requireAdmin`**| Enforces `requireAuth` first, then validates `req.isAdmin === true`. Blocks with `403`. | `/api/admin/system`, `/api/admin/logs`, `/api/admin/cache`, `/api/admin/users` |
| **`optionalAuth`**| Parses JWT signatures if present, but lets anonymous connections proceed silently. | `/api/munim/parse`, `/api/munim/scan-bill`, `/api/market-research` |

---

## 4. Input Sanitization & Payload Controls

To protect server containers from denial-of-service attempts or buffer overflow vulnerabilities:
- **Capacity Limits**: Standard incoming body payloads are capped at `50mb` inside `express.json` to safely support high-resolution supplier scans without memory bloating.
- **Base64 Validation**: OCR scan strings are checked for clean data-URL header prefixes prior to loading vision models.
- **Strict Parsing Casts**: Input fields mapped to stock quantities, cost prices, or ledger amounts are explicitly cast to numeric structures (`Number(amount)`) inside handler routines to avoid schema matching errors.

---

## 5. Security Auditing Logs (`user_logs`)

All core operations write persistent entries into the `userLogs` table, recording metadata about the caller:
- **Log Parameters**:
  - `userId`: The operator's account ID.
  - `eventType`: The action category (e.g. `mock_login`, `ai_agent_action`, `db_modification`).
  - `ipAddress`: Captured via Express `req.ip` for geo-fencing checks.
  - `userAgent`: Client hardware signature to track devices.
- **Immutability**: Log entries are write-only, with no edit or update endpoints provided, creating clean trails for operational reviews.
