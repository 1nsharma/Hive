# Privacy-by-Design & PII Protection Blueprint (v1.0)

This blueprint documents the data privacy, demographic protection, PII masking, data retention, and user consent policies governing DukaanMitra (BazaarSync).

---

## 1. Demographic Hashing & PII Masking

To ensure compliance with data protection standards (such as GDPR and local business regulations), DukaanMitra strictly avoids logging plain-text Personally Identifiable Information (PII) during research logging or telemetry tracking.

### 1.1 Cryptographic Hash Masking
When tracking application usage metrics or logging search queries inside the `market_research` database table, plain-text IDs are immediately mapped to irreversible SHA-256 hashes:
```ts
const userHash = crypto.createHash('sha256').update(userId ? `user_${userId}` : `demo_${demoId}`).digest('hex');
const customerHash = customerId ? crypto.createHash('sha256').update(`customer_${customerId}`).digest('hex') : null;
```
- **Effect**: This isolates transaction logging patterns from direct identity linking, preventing automated scrapers from mapping sales statistics to specific, real-world customer names or phone numbers.

---

## 2. Sensitive Fields Inventory

DukaanMitra identifies specific database columns containing sensitive merchant or customer information and enforces strict encryption/access controls:

| Database Table | Targeted Column | Data Category | Protection Constraint |
| :--- | :--- | :--- | :--- |
| **`users`** | `email` | Customer PII | Isolated via token validation; never written to public logs. |
| **`customers`** | `phone` | Customer PII | Enforced multi-tenant isolation; only visible to owner. |
| **`user_settings`**| `gstNumber` | Business Metadata | Validated format; only loaded inside private merchant dashboards. |
| **`user_logs`** | `ipAddress` | Metadata PII | Masked or truncated in telemetry outputs. |

---

## 3. Data Retention & Erasure Policy

- **The Right to be Forgotten**: Merchants can permanently delete their shop account. This triggers a cascading delete across the database:
  ```sql
  ALTER TABLE customers ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  ```
- **Log Retention Policy**: System audit logs (`user_logs` table) are kept for **30 days** to support incident trace debugging, after which they are automatically pruned.
- **AI Cache Expiration**: The local `ai_cache` prompt mapping table is maintained to prevent redundant API queries. Entries have no direct link to customer records, but administrators can purge the entire cache on-demand using the administrative endpoint `POST /api/admin/cache/clear`.

---

## 4. Consent & Guest Sandbox Isolation

DukaanMitra features a non-registration "Guest Sandbox" mode letting users test billing features without creating a Firebase account:
- **Zero Cloud Footprint**: In guest mode, all balance and customer records are saved directly in the merchant's browser using standard `localStorage`.
- **Consent Rule**: Guest data is never uploaded to PostgreSQL or shared with third-party networks, ensuring 100% merchant data sovereignty until they actively choose to register an account.
