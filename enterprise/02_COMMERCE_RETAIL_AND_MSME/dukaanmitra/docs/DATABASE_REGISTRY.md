# Database Registry & Table Specs (v1.0)

This registry records all active relational database tables and specs managed by the Drizzle ORM and PostgreSQL runtime in DukaanMitra.

---

## 1. Relational Database Overview

The DukaanMitra database architecture is built on **PostgreSQL (Google Cloud SQL)**, queried type-safely via **Drizzle ORM** (`src/db/index.ts`). It employs a single-database, multi-tenant architectural design pattern where all transaction-oriented records are isolated logically using indexed tenant keys (`userId`).

---

## 2. Table Specifications Catalog

The database schema defines 10 core tables designed to track tenants, accounts, credit ledgers, inventory transactions, telemetry actions, caches, and session security:

| Table Name | Drizzle Export Name | Row Count Class | Primary Role / Purpose |
| :--- | :--- | :---: | :--- |
| **`users`** | `users` | Small | Authenticated shopkeeper/merchant accounts. |
| **`customers`** | `customers` | Medium | Store client profiles, phone numbers, and outstanding debts. |
| **`transactions`** | `transactions` | Large | Credit ledger (`credit`, `payment`, `sale`) balance sheets. |
| **`products`** | `products` | Medium | Inventory SKU catalog tracking prices, stock, and barcodes. |
| **`stock_transactions`** | `stockTransactions` | Large | Inward and Outward inventory adjustment history tracker. |
| **`market_research`** | `marketResearch` | Large | Demographics telemetry and conversational audit logs. |
| **`user_logs`** | `userLogs` | Large | Access logs, tracking logins, IP addresses, and user-agents. |
| **`ai_cache`** | `aiCache` | Medium | MD5 hashing cache for Gemini AI prompts and base64 images. |
| **`user_settings`** | `userSettings` | Small | 1:1 business meta configuration, GSTIN, and custom styles. |
| **`potential_customers`**| `potentialCustomers` | Medium | Leads list imported from local device mobile contacts. |

---

## 3. Schema Schema Index

### 3.1 `users`
- **Purpose**: Authenticated merchants registered in the system.
- **Drizzle definition**:
  ```ts
  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    uid: text('uid').notNull().unique(), // Firebase Auth UID
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.2 `customers`
- **Purpose**: Stores active buyers and credit trackers.
- **Drizzle definition**:
  ```ts
  export const customers = pgTable('customers', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    balance: doublePrecision('balance').default(0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.3 `transactions`
- **Purpose**: Financial journals recording shop credit actions.
- **Drizzle definition**:
  ```ts
  export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    customerId: integer('customer_id').references(() => customers.id).notNull(),
    customerName: text('customer_name').notNull(),
    amount: doublePrecision('amount').notNull(),
    type: varchar('type', { length: 20 }).notNull(), // 'credit' | 'payment'
    product: text('product'),
    quantity: text('quantity'),
    date: text('date').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.4 `products`
- **Purpose**: Stock tracking catalog and price structures.
- **Drizzle definition**:
  ```ts
  export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    stock: doublePrecision('stock').default(0).notNull(),
    unit: text('unit').notNull(),
    price: doublePrecision('price').default(0).notNull(),
    costPrice: doublePrecision('cost_price').default(0).notNull(),
    lowStockThreshold: doublePrecision('low_stock_threshold').default(10).notNull(),
    barcode: text('barcode'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.5 `stock_transactions`
- **Purpose**: History lines recording stock replenishment or damage adjustments.
- **Drizzle definition**:
  ```ts
  export const stockTransactions = pgTable('stock_transactions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    productId: integer('product_id').references(() => products.id).notNull(),
    productName: text('product_name').notNull(),
    quantity: doublePrecision('quantity').notNull(),
    type: varchar('type', { length: 20 }).notNull(), // 'in' | 'out'
    date: text('date').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.6 `market_research`
- **Purpose**: Public conversational trace log tracking, including search strings and demo states.
- **Drizzle definition**:
  ```ts
  export const marketResearch = pgTable('market_research', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id), // Nullable for anonymous demo tracking
    userHash: text('user_hash'),
    customerHash: text('customer_hash'),
    demoId: text('demo_id'),
    actionType: text('action_type').notNull(),
    inputData: text('input_data'),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.7 `user_logs`
- **Purpose**: Immutable operations footprints capturing IP and caller agents.
- **Drizzle definition**:
  ```ts
  export const userLogs = pgTable('user_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.8 `ai_cache`
- **Purpose**: Prompt-hash caching eliminating redundant upstream AI cost.
- **Drizzle definition**:
  ```ts
  export const aiCache = pgTable('ai_cache', {
    id: serial('id').primaryKey(),
    promptHash: text('prompt_hash').notNull().unique(),
    response: text('response').notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    hitCount: integer('hit_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```

### 3.9 `user_settings`
- **Purpose**: Shopkeepers' brand setup and GST details.
- **Drizzle definition**:
  ```ts
  export const userSettings = pgTable('user_settings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull().unique(),
    businessName: text('business_name').notNull(),
    phone: text('phone').notNull(),
    address: text('address'),
    category: text('category'),
    description: text('description'),
    gstNumber: text('gst_number'),
    mapsLink: text('maps_link'),
    munimStyle: text('munim_style'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });
  ```

### 3.10 `potential_customers`
- **Purpose**: Local contact sync storage for campaign targeting.
- **Drizzle definition**:
  ```ts
  export const potentialCustomers = pgTable('potential_customers', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    source: text('source').default('contacts'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  ```
