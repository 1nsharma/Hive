# Service Layer Dependencies (v1.0)

This document diagrams the operational hierarchy, module linkages, and software imports running inside the DukaanMitra (BazaarSync) backend.

---

## 1. Topological Dependency Diagram

```
       +--------------------------------------------+
       |                  server.ts                 |
       +---------------------+----------------------+
                             |
         +-------------------+-------------------+
         |                                       |
         v                                       v
+--------+---------+                   +---------+---------+
|  auth.ts Middleware                  |  MitraOS Engine   |
|  - Token check   |                   |  - Event loop     |
|  - Admin checks  |                   |  - Agent registry |
+--------+---------+                   +---------+---------+
         |                                       |
         |                                       v
         |                             +---------+---------+
         |                             |   AI Agents       |
         |                             |   - finance       |
         |                             |   - marketing     |
         +-------------------+---------+   - inventory     |
                             |         +-------------------+
                             v
               +-------------+-------------+
               |        Drizzle ORM        |
               |  - schema.ts              |
               |  - db connection driver   |
               +-------------+-------------+
                             |
                             v
               +-------------+-------------+
               |      PostgreSQL (DB)      |
               +---------------------------+
```

---

## 2. API endpoint Dependency Index

Each endpoint handler imports specific architectural blocks to maintain tenant isolation and data integrity:

1. **`/api/munim/parse` & `/api/munim/scan-bill`**
   - **Direct Imports**: `@google/genai` (Google Gen AI SDK), `crypto` (for hashing prompts), `fs` / `path` (for managing visions).
   - **DB Imports**: `aiCache` (storing prompt completions), `db` (connecting postgres).

2. **`/api/transactions` & `/api/stock-adjust`**
   - **Direct Imports**: `req.dbUser` (attached by auth token verification).
   - **DB Imports**: `transactions`, `customers`, `products`, `stockTransactions` tables.
   - **Side-Effects**: Modifies outstanding customer debt columns, decreases product stock counts, and dispatches events to the local `event-bus.ts`.

3. **`/api/auth/verify-ssh`**
   - **Direct Imports**: `jsonwebtoken` (sign login payloads), `auth.ts` configs.
   - **Side-Effects**: Stores session logging metrics inside the `sessionLogs` table.
