# Database Intelligence Map (v1.0)

This document maps out the relational database schemas of DukaanMitra, detail-indexing keys, constraints, triggers, and tenant isolation rules.

---

## 1. Entity-Relationship Diagram (ERD)

```
       +------------------+
       |      users       |
       +------------------+
       | PK: id (serial)  | <---------+
       | uid (unique text)|           |
       | email (text)     |           |
       +--------+---------+           |
                |                     |
      +---------+---------+           |
      |                   |           |
      v                   v           |
+-------------+     +-------------+   | (one-to-one)
|  customers  |     |  products   |   |
+-------------+     +-------------+   |
| PK: id      |     | PK: id      |   |
| FK: user_id |     | FK: user_id |   |
| name        |     | name        |   |
| phone       |     | price       |   |
| balance     |     | stock       |   |
+------+------+     +------+------+   |
       |                   |          |
       v (one-to-many)     v          |
+--------------+    +--------------+  |
| transactions |    |  stock_trans |  |
+--------------+    +--------------+  |
| PK: id       |    | PK: id       |  |
| FK: cust_id  |    | FK: prod_id  |  |
| amount       |    | quantity     |  |
| type         |    | type         |  |
+--------------+    +--------------+  |
                                      |
                            +---------+--------+
                            |  user_settings   |
                            +------------------+
                            | PK: id           |
                            | FK: user_id (UQ) |
                            | business_name    |
                            | gst_number       |
                            +------------------+
```

---

## 2. Table Specifications & Indexes

### 2.1 Table: `users`
- **Purpose**: Authenticated tenants.
- **Fields**:
  - `id`: `serial` | Primary Key
  - `uid`: `text` | Unique index (Firebase Auth UID)
  - `email`: `text`
  - `created_at`: `timestamp` | Default `now()`

### 2.2 Table: `customers`
- **Purpose**: Store contacts and ongoing debtor balances.
- **Fields**:
  - `id`: `serial` | Primary Key
  - `user_id`: `integer` | Foreign Key -> `users.id`
  - `name`: `text`
  - `phone`: `text`
  - `balance`: `doublePrecision` | Default `0`
- **Indexes**: Composite index on `(user_id, phone)` to ensure fast searches and prevent cross-tenant search leaks.

### 2.3 Table: `transactions` (Ledger Entries)
- **Purpose**: Ledger entries logging credit given or cash paid back.
- **Fields**:
  - `id`: `serial` | Primary Key
  - `user_id`: `integer` | Foreign Key -> `users.id`
  - `customer_id`: `integer` | Foreign Key -> `customers.id`
  - `customer_name`: `text`
  - `amount`: `doublePrecision`
  - `type`: `varchar(20)` | `'credit' | 'payment' | 'cash_sale' | 'sale'`
  - `product`: `text` | Optional
  - `quantity`: `text` | Optional
  - `date`: `text` (ISO string format)
- **Indexes**: Foreign Key indexes on `user_id` and `customer_id`.

### 2.4 Table: `products` (Inventory items)
- **Purpose**: Itemized stock metrics.
- **Fields**:
  - `id`: `serial` | Primary Key
  - `user_id`: `integer` | Foreign key -> `users.id`
  - `name`: `text`
  - `stock`: `doublePrecision` | Default `0`
  - `unit`: `text`
  - `price`: `doublePrecision`
  - `cost_price`: `doublePrecision`
  - `low_stock_threshold`: `doublePrecision`
  - `barcode`: `text` | Optional
- **Indexes**: Composite index on `(user_id, barcode)` for quick scanner lookups.

### 2.5 Table: `user_settings`
- **Purpose**: Stores business-specific metadata (Address, Phone, GSTIN, Category).
- **Fields**:
  - `id`: `serial` | Primary Key
  - `user_id`: `integer` | Foreign key -> `users.id` (Unique, ensuring 1:1)
  - `business_name`: `text`
  - `phone`: `text`
  - `address`: `text` | Nullable
  - `gst_number`: `text` | Nullable

---

## 3. Strict Tenant Isolation Policy
DukaanMitra ensures that **no shopkeeper can view another shopkeeper's financial journals**:
- **Implicit Row-Level Filtering**: Every single database fetch statement contains a mandatory `.where(eq(table.userId, req.dbUser.id))` clause.
- **Constraint Checks**: Backend routes verifying customer/product modifications cross-reference `req.dbUser.id` with the targeted entity's `user_id` property. If mismatched, the server rejects the query instantly with a `403 Forbidden` response.
- **Zero Raw Joins**: All relations are explicitly fetched using modular Drizzle abstractions, avoiding any potential SQL injection vectors.
