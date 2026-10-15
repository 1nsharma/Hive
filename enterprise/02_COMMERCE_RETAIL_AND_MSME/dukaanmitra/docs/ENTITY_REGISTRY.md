# Entity Registry (v1.0)

This registry classifies the functional entities of DukaanMitra, detailing keys, module ownership, dependencies, and deployment readiness.

---

## 1. System Entity Index

### 1.1 `User` Entity
- **Purpose**: Authenticated shopkeepers (merchants) operating the system.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Unique Constraints**: `uid` (`text`, unique index matching Firebase Auth identity)
- **Relationships**: One-to-Many with `customers`, `products`, `transactions`, `stockTransactions`, `userLogs`, `marketResearch`, and `potentialCustomers`. One-to-One with `userSettings`.
- **Owner Module**: Authentication (`/src/middleware/auth.ts`)
- **Primary Consumers**: JWT middleware, Admin interfaces, Onboarding state router.
- **Production Status**: **Production Ready**

### 1.2 `Customer` Entity
- **Purpose**: Represents local store consumers, debtor lines, and khata registers.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**: `userId` (`integer` referencing `users.id`)
- **Dependencies**: Depends on a valid `User` parent.
- **Relationships**: One-to-Many with `transactions`.
- **Owner Module**: CRM & Ledger
- **Primary Consumers**: Customer list views, POS Checkout, credit payments.
- **Production Status**: **Production Ready**

### 1.3 `Transaction` Entity
- **Purpose**: Ledgers logs tracking sales and payments.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**: 
  - `userId` (`integer` referencing `users.id`)
  - `customerId` (`integer` referencing `customers.id`)
- **Dependencies**: Depends on both `User` and `Customer` parents.
- **Owner Module**: Accounting & Ledger
- **Primary Consumers**: Sales reports, balance dashboards, udhaari cards, tax calculators.
- **Production Status**: **Production Ready** (Managed via command-bus strangler loops to ensure policy constraints).

### 1.4 `Product` Entity
- **Purpose**: Product inventory SKUs representing pricing, barcode indexing, and available stocks.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**: `userId` (`integer` referencing `users.id`)
- **Dependencies**: Depends on a valid `User` parent.
- **Relationships**: One-to-Many with `stockTransactions`.
- **Owner Module**: Inventory & Warehousing
- **Primary Consumers**: Checkout catalogs, barcode scanner, low-stock warnings, reorder suggestions.
- **Production Status**: **Production Ready**

### 1.5 `StockTransaction` Entity
- **Purpose**: Audit rows capturing manual adjustments or supplier purchase check-ins.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**:
  - `userId` (`integer` referencing `users.id`)
  - `productId` (`integer` referencing `products.id`)
- **Dependencies**: Depends on `User` and `Product`.
- **Owner Module**: Inventory & Stock Tracking
- **Primary Consumers**: Stock adjustment ledgers, replenishment histories.
- **Production Status**: **Production Ready**

### 1.6 `UserSetting` Entity
- **Purpose**: Business metadata configurations (address, maps location, phone, GSTIN).
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**: `userId` (`integer` referencing `users.id`, marked as unique to enforce 1:1)
- **Dependencies**: 1:1 dependency on `User`.
- **Owner Module**: Business Core Configurator
- **Primary Consumers**: Invoice headers, GSTR forms, profile cards, maps integrations.
- **Production Status**: **Production Ready**

### 1.7 `PotentialCustomer` Entity
- **Purpose**: Holds contact leads synced from mobile device address books.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**: `userId` (`integer` referencing `users.id`)
- **Owner Module**: CRM Campaign Sync
- **Primary Consumers**: Broadcast targeters, marketing engines, lead conversion lists.
- **Production Status**: **Production Ready**

### 1.8 `AiCache` Entity
- **Purpose**: Prompts hash and raw vision base64 caching table.
- **Primary Key**: `id` (`serial`, auto-increment)
- **Unique Indexes**: `promptHash` (`text` unique string index)
- **Owner Module**: AI Intelligence Core (Munim)
- **Primary Consumers**: Conversational voice parser, Multimodal scanner, Product lookups.
- **Production Status**: **Production Ready** (Highly valuable for token-cost containment).

### 1.9 `UserLog` Entity
- **Purpose**: Security access footprints (logins, session markers, IP coordinates).
- **Primary Key**: `id` (`serial`, auto-increment)
- **Foreign Keys**: `userId` (`integer` referencing `users.id`)
- **Owner Module**: Security & Auditing
- **Primary Consumers**: Admin dashboard, telemetry checks.
- **Production Status**: **Production Ready** (Write-only, immutable audits).

---

## 2. Multi-Entity Operational Matrix

The following table records the relationships and dependencies:

| Entity Name | Required Parent | Cascade Delete Strategy | Modifying Interface |
| :--- | :--- | :---: | :--- |
| `User` | None | Delete associated tables manually on cascading trigger | Admin Dashboard `/api/admin/users/:id` |
| `Customer` | `User` | Cascade Restrict | UI Customer Details / API PUT |
| `Transaction`| `User` & `Customer` | Cascade Restrict | OS Command Bus Loop |
| `Product` | `User` | Cascade Restrict | UI Stock Catalog / API PUT |
| `StockTransaction` | `User` & `Product` | Cascade Restrict | UI Stock Adjustment Dialog |
| `UserSetting`| `User` | Cascade Delete | Business Profile Panel |
| `PotentialCustomer`| `User` | Cascade Delete | Sync Contacts Button |
