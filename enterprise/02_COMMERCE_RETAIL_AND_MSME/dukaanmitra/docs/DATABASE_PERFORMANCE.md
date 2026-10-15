# Database Performance & Cache Optimization Blueprint (v1.0)

This blueprint details the query optimization strategies, index structures, caching matrices, and table scaling parameters of the DukaanMitra database.

---

## 1. Indexing & Query Acceleration

To support sub-millisecond lookups on our Cloud Run container instance, indexes are strategically placed on frequently queried columns inside `/src/db/schema.ts`:

### 1.1 Column Indexing Matrix

| Table Name | Indexed Columns | Index Type | Primary Functional Benefit |
| :--- | :--- | :---: | :--- |
| **`users`** | `uid` | Unique Index | Near-instant lookup of user profile upon session verification. |
| **`customers`** | `(userId, phone)` | Composite Index | Accelerates client lookup inside POS view, preventing cross-user scans. |
| **`products`** | `(userId, barcode)` | Composite Index | Instantaneous catalog matching on barcode scans. |
| **`transactions`** | `userId`, `customerId` | Single Column Indexes | Avoids full table scans during ledger reconciliation and history queries. |
| **`ai_cache`** | `promptHash` | Unique Index | Instant lookup of previously parsed AI scripts or multimodal OCR receipts. |
| **`user_settings`** | `userId` | Unique Index | Implements strict 1:1 business profile mapping. |

---

## 2. In-Memory Cache Matrix

To protect our transactional Cloud SQL instance from high-frequency read spikes, two layers of caching are active:

### 2.1 State Hydration Server Cache (`/api/db`)
- **Type**: Server memory cache.
- **TTL**: 60 seconds.
- **Eviction Strategy**: Purges automatically when a write operation occurs on customers, products, or transactions, ensuring clients see fresh data after actions.
- **Latency Impact**: Reduces standard loading latency from ~45ms down to <3ms for repeat dashboard requests.

### 2.2 Token-Saving AI Prompt Cache (`ai_cache`)
- **Type**: Database-backed content cache.
- **TTL**: Permanent (Evicted only via administrative `/api/admin/cache` purges).
- **Mechanism**: Computes MD5 hash on incoming input prompts. Matches against `promptHash` in `aiCache`. If hit, increments `hitCount` and returns the pre-saved JSON response directly.
- **Latency Impact**: Converts slow upstream AI round-trips (~3-5 seconds) into instant local reads (<5ms), preserving developer token quotas.

---

## 3. Query Scaling & Growth Projections

As our active user volume scales, we anticipate table growth to rise exponentially on transaction logs. We protect against degradation using these rules:
- **Avoiding Nested Sub-selects**: Joins are flattened into single-level associations.
- **Bulk Inserting**: Imports of contact lists or bulk product seedings are batched using PostgreSQL single-statement bulk insert syntax:
  ```ts
  await db.insert(table).values(arrayObjects);
  ```
- **Streamlined Datetime Columns**: Datetime columns utilize standardized ISO strings or UNIX offsets at database boundaries to bypass slow locale translation routines.
- **Connection Pooling**: Express server.ts connects via PostgreSQL Pool with custom idle timeouts, maximizing thread reuse inside Cloud Run.
