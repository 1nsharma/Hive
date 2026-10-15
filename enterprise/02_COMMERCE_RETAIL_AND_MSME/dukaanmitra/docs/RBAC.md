# Role-Based Access Control (RBAC) Architecture (v1.1)

This architecture details the access permissions, route restrictions, system roles, and multi-tenant isolation boundaries implemented across DukaanMitra (BazaarSync).

---

## 1. Enterprise System Role Matrix

DukaanMitra categorizes users into specific security profiles to prevent privilege escalation. Every user role maps to a designated operational scope and set of permissions:

| Enterprise Role | Code Key Identifier | Operational Scope | Granular Permissions |
| :--- | :--- | :--- | :--- |
| **`Super Admin`** | `super_admin` | Platform-wide operations, telemetry logs, configuration of system-wide API keys. | All permissions (Read/Write/Delete) across all tenants. |
| **`Company Admin`** | `company_admin` | Configures organizational properties, multi-branch linkages, and global parameters. | Management of organization settings, billing, high-level reporting. |
| **`Business Owner`** | `owner` | Complete administrative authority over a single independent tenant store. | Full control over the store, inventory, transactions, and staff. |
| **`Manager`** | `manager` | Day-to-day operations lead, overrides checkout parameters, handles stock corrections. | Read/Write on catalog, sales records, staff roster; no ledger deletion. |
| **`Cashier`** | `cashier` | Operates the Point-of-Sale checkout terminal, processes instant cash sales. | `read:sales`, `write:sales`, `read:products`. Blocked from modifying ledgers. |
| **`Staff`** | `staff` | Floor workers, inventory counters, updates product shelf locations. | `read:inventory`, `write:inventory` (limited shelf updates). |
| **`Accountant`** | `accountant` | Reconciles ledgers, prepares GST GSTR-1 filings, tracks Input Tax Credits. | `read:finance`, `write:finance`, `read:sales`. Blocked from POS changes. |
| **`Auditor`** | `auditor` | Evaluates audit trails and ensures regulatory tax reporting compliance. | Read-only access (`read:sales`, `read:finance`, `read:inventory`). No mutations. |
| **`Customer`** | `customer` | Accesses the merchant's digital storefront, reviews outstanding udhaar balances. | Read-only access to self-associated transactions and catalogs. |
| **`Supplier`** | `supplier` | Reviews vendor supply invoices, tracks payment receipts. | Read-only access to self-associated procurements. |
| **`Partner`** | `partner` | Franchise partners or business co-owners reviewing aggregate performance graphs. | Read-only reporting and performance diagnostics. |
| **`Franchise`** | `franchise` | Renders analytics and performance trends for franchise branches. | Read-write within the sub-tenant franchise location scope. |
| **`Delivery`** | `delivery` | Renders order drop-offs, handles delivery routing, marks cash collection. | View shipping addresses, update delivery status, register cash-received. |

---

## 2. Permission Resolution & Mapping

The Express backend and React front-end enforce security controls using the following permission tokens:

- **`read:sales` / `write:sales` / `delete:sales`**: Controls Point of Sale checkout and transaction logs.
- **`read:inventory` / `write:inventory` / `delete:inventory`**: Governs inventory catalogs and stock transactions.
- **`read:customers` / `write:customers`**: Regulates customer account files and udhaar logs.
- **`read:finance` / `write:finance`**: Governs purchase bookkeeping, GST tax returns, and supplier ledgers.
- **`manage:staff`**: Permits adding, terminating, or modifying staff credentials.
- **`manage:settings`**: Controls business profile details, GSTIN, state codes, and maps links.
- **`export:data`**: Restricts CSV/PDF reports downloading.

---

## 3. Route Access Authorization Mapping

The Express backend strictly maps endpoints to specific authentication requirements:

### 3.1 Public & Guest Endpoints
These endpoints are open or utilize `optionalAuth` to track market metrics anonymously without forcing registration:
- `POST /api/market-research` (Logs usage trends with hashed identifiers).
- `POST /api/ai/suggest-catalog` (Generates default catalogs).

### 3.2 Merchant Protected Endpoints
These endpoints require valid active merchant sessions and enforce strict multi-tenant database lookups:
- `GET /api/settings` & `POST /api/settings` (Tenant settings updates).
- `GET /api/db` (Hydrates tenant-specific data frames).
- `POST /api/munim/parse` (Digital Munim accounting).
- `POST /api/munim/scan-bill` (Invoice OCR scanner).
- `POST /api/contacts/import` (Contacts importing).

### 3.3 Administrative Endpoints
These endpoints can only be accessed by authenticated users whose emails match the `ADMIN_EMAILS` array:
- `GET /api/admin/logs` (Global SRE telemetry traces).
- `POST /api/admin/cache/clear` (System-wide cache flushing).

---

## 3. Strict Database Multi-Tenant Isolation

To prevent "Cross-Tenant Information Disclosure" (where Merchant A retrieves records belonging to Merchant B):
- **User Validation**: Every database operation queries the active connection pool using a strict `eq(table.userId, req.dbUser.id)` Drizzle constraint.
- **SQL Join Restrictions**: Operations linking tables (such as joining `transactions` and `customers`) apply explicit `and` parameters to verify that both objects belong to the authenticated session ID:
  ```ts
  const result = await db.select()
    .from(transactions)
    .innerJoin(customers, eq(transactions.customerId, customers.id))
    .where(and(
      eq(transactions.userId, req.dbUser.id),
      eq(customers.userId, req.dbUser.id)
    ));
  ```
- **Sequential IDs Separation**: Because sequential table IDs are predictable, the system rejects any mutation request matching a target ID unless the corresponding `userId` column matches the active session.
