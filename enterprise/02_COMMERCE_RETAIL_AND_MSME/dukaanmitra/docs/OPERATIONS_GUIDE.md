# Operations & Administration Guide (v1.0)

This guide documents the day-to-day operations, administrative routines, data backups, system checks, and cache maintenance procedures of DukaanMitra (BazaarSync).

---

## 1. System Health Checks

To monitor the operational status of the live platform, administrators and automated uptime monitors use the following public endpoints:

- **System Health Checks**: `GET /api/health`
  - Purpose: Validates that the Express host is running and responding.
  - Return Payload: `{ "status": "ok", "timestamp": "2026-07-25T..." }`
- **Database Connectivity Checks**: `GET /api/db/health`
  - Purpose: Performs a lightweight select query on PostgreSQL to confirm active connection pool health.
  - Return Payload: `{ "database": "connected" }`

---

## 2. In-Memory Cache Management

To maintain system speed, DukaanMitra maintains a global in-memory state cache for database queries.

### 2.1 Understanding the Cache Lifetime
- **Read Operations**: Queries to `GET /api/db` are cached in memory for up to 60 seconds, preventing read-spikes during manual dashboard updates.
- **Write Operations**: The cache is automatically cleared whenever a merchant executes a mutating write operation (e.g. creating a customer, completing a transaction, updating inventory). This ensures the dashboard stays accurate without manual refresh delays.

### 2.2 Purging AI Prompts Cache (`ai_cache`)
The `ai_cache` table stores MD5 prompt hashes to save on upstream token budgets. To force the system to clear all stored AI prompts and re-query Gemini:
```bash
# Execute administrative cURL payload
curl -X POST https://[YOUR_APP_URL]/api/admin/cache/clear \
  -H "Authorization: Bearer [ADMIN_JWT]"
```

---

## 3. Auditing Operational Trails

All database modifications, user logins, and critical admin actions write immutable entries into the `user_logs` table.

### 3.1 Fetching Access Audit Trails
To review trace logs for compliance or security reviews:
```bash
# Fetch recent logs from the admin endpoint
curl -X GET https://[YOUR_APP_URL]/api/admin/logs?limit=100 \
  -H "Authorization: Bearer [ADMIN_JWT]"
```
Each log entry captures:
- `userId`: The ID of the authenticated actor.
- `eventType`: The action category (e.g., `mock_login`, `db_modification`, `api_call`).
- `ipAddress` & `userAgent`: The client device metadata.

---

## 4. Recovering Data & Manual Seeding

If an active merchant requires a database roll-back or a sandbox reset, the database can be re-seeded safely:

### 4.1 Restoring Standard Product Catalogs
To seed a brand-new shop with standard Indian Fast-Moving Consumer Goods (FMCG) catalog templates:
```bash
# Execute catalog seed script
npm run db:seed-catalog
```
This inserts hundreds of optimized seed products (such as Milk, Sugar, Tea, Wheat Flour) from the standard catalog configuration file (`src/db/catalog-seed.ts`).

---

## 5. Offline Sandbox State Inspections

For local guest shopkeepers operating outside of persistent database accounts:
- **State Storage**: State is saved in the browser's `localStorage` under keys `dukaan_customers`, `dukaan_products`, and `dukaan_transactions`.
- **Administrative Backups**: Guests can back up their database by clicking **"Export Local State"** inside the dashboard. This downloads a structured JSON dump.
- **State Import**: In the event of cache clearing, the downloaded JSON file can be reloaded via the dashboard interface to restore all customer and balance data instantly.
