# API Registry (v1.1)

This registry catalogs every API route exposed by the DukaanMitra backend server (`server.ts`). It documents HTTP methods, authentication requirements, and core business functions with high accuracy.

---

## 1. Authentication & Session Services

### 1.1 Check Current Session
- **Endpoint**: `GET /api/auth/me`
- **Authentication**: **Required** (`requireAuth`)
- **Purpose**: Retrieves details of the logged-in user, session scopes, and admin rights.

### 1.2 Firebase Mock Login (Sandbox Bypass)
- **Endpoint**: `POST /api/auth/mock-login`
- **Authentication**: Public
- **Request Body**: `{ phone?: string, email?: string, name?: string }`
- **Purpose**: Issues a signed JWT to support guest and sandbox flows.

### 1.3 SSH Send Token (Admin Authentication)
- **Endpoint**: `POST /api/auth/send-ssh`
- **Authentication**: Public
- **Request Body**: `{ email: string }`
- **Purpose**: Validates email against `ADMIN_EMAILS` whitelist and outputs a 6-digit verification code to the console logs.

### 1.4 SSH Verify Token
- **Endpoint**: `POST /api/auth/verify-ssh`
- **Authentication**: Public
- **Request Body**: `{ email: string, code: string }`
- **Purpose**: Matches verification codes and returns an Admin JWT.

### 1.5 Client Session Logging
- **Endpoint**: `POST /api/auth/session-log`
- **Authentication**: **Required** (`requireAuth`)
- **Request Body**: `{ eventType: string, metadata?: string | object }`
- **Purpose**: Logs user sessions, system interactions, and operational footprints.

---

## 2. Business Settings & State Hydration

### 2.1 Fetch Store Configurations
- **Endpoint**: `GET /api/settings`
- **Authentication**: **Required** (`requireAuth`)
- **Purpose**: Fetches metadata (GSTIN, store name, description, address, custom accounting styles).

### 2.2 Update Store Configurations
- **Endpoint**: `POST /api/settings`
- **Authentication**: **Required** (`requireAuth`)
- **Request Body**: `{ settings: object }` or direct properties (`{ businessName, phone, address, description, gstNumber, mapsLink, munimStyle }`)
- **Purpose**: Creates or modifies user-specific store setups.

### 2.3 Fetch Full Store State (Hydration API)
- **Endpoint**: `GET /api/db`
- **Authentication**: **Required** (`requireAuth`)
- **Returns**: Unified JSON package `{ customers, products, transactions }` to support zero-latency offline performance on client-side views. Includes a 60-second server memory cache.

### 2.4 Import Contacts List
- **Endpoint**: `POST /api/contacts/import`
- **Authentication**: **Required** (`requireAuth`)
- **Request Body**: `{ contacts: Array<{ name: string, phone?: string, email?: string }> }`
- **Purpose**: Populates the potential customer list with local device contacts.

---

## 3. Core Registers & Accounting Operations

### 3.1 Customer Operations
- **POST /api/customers**: Registers a client. Request: `{ name: string, phone: string, balance?: number }`. Handled via the Strangler Event Loop.
- **PUT /api/customers/:id**: Modifies contact information or balance. Request: `{ name, phone, balance }`.
- **DELETE /api/customers/:id**: Removes customer.

### 3.2 Product Catalog Operations
- **POST /api/products**: Standardizes stock item. Request: `{ name, stock, unit, price, costPrice, lowStockThreshold, barcode }`. Handled via the Strangler Event Loop.
- **PUT /api/products/:id**: Edits SKU attributes or stock quantity.
- **DELETE /api/products/:id**: Removes product from catalog.

### 3.3 Transaction Operations
- **POST /api/transactions**: Dispatches a checkout bill or credit balance payment. Request: `{ customerId, amount, type: 'sale' | 'credit' | 'payment', product?, quantity?, notes?, date? }`. Handled via the Strangler Event Loop.
- **POST /api/stock-adjust**: Adjusts stock levels directly. Request: `{ productId, quantity, type: 'in' | 'out', notes? }`. Handled via the Strangler Event Loop.

### 3.4 Telemetry Tracking (Market Research)
- **POST /api/market-research**: Log guest/demo telemetry or user metrics.
- **Authentication**: Optional (`optionalAuth` logs guest/demo metadata securely using SHA-256 hashes).

---

## 4. AI Intelligence & Processing Services

### 4.1 Parse Conversational Query (AI-Munim)
- **Endpoint**: `POST /api/munim/parse`
- **Authentication**: Optional
- **Request Body**: `{ query: string, customersList?: array, productsList?: array, businessConfig?: object }`
- **Purpose**: Translates conversational language into precise transactional schemas using Gemini. Matches prompt hashes in `ai_cache` for instant lookup.

### 4.2 Scan Invoice / Bill (Multimodal OCR Vision)
- **Endpoint**: `POST /api/munim/scan-bill`
- **Authentication**: Optional
- **Request Body**: `{ image: string }` (Base64 JPEG representation)
- **Purpose**: Performs optical character recognition on scanned supplier receipts and outputs structured line items. Matches image base64 hashes in `ai_cache` for high-speed retrieval.

### 4.3 Product Lookup & Auto-Pricing
- **Endpoint**: `POST /api/ai/product-lookup`
- **Authentication**: Optional
- **Request Body**: `{ productName: string }`
- **Purpose**: Looks up Indian wholesale MRP ranges and standard package sizes. Falls back to Open Food Facts API and FakeStore API if Gemini is rate-limited.

### 4.4 Suggest Vertical Catalog
- **Endpoint**: `POST /api/ai/suggest-catalog`
- **Authentication**: Optional
- **Request Body**: `{ businessCategory: string }`
- **Purpose**: Recommends high-margin, vertical-specific items to seed new catalogs.

### 4.5 Analyze Onboarding Profile
- **Endpoint**: `POST /api/onboarding/analyze`
- **Authentication**: Public
- **Request Body**: `{ businessName: string, description?: string }`
- **Purpose**: Analyzes the business category and determines recommended UI modules (e.g. enabling inventory or credit ledger).

---

## 5. WhatsApp Sandbox Services

### 5.1 Simulate Incoming WhatsApp Message
- **Endpoint**: `POST /api/whatsapp/simulate-incoming`
- **Authentication**: Optional
- **Request Body**: `{ fromPhone: string, text: string }`
- **Purpose**: Simulates automated incoming commands (such as customer creation or low stock adjustments) inside the Event and Command loop.

### 5.2 Fetch Connection Status
- **Endpoint**: `GET /api/whatsapp/status`
- **Authentication**: **Required** (`requireAuth`)
- **Returns**: Connection states, session info, and live QR code sequences.

### 5.3 Connect / Initialize WhatsApp Node
- **Endpoint**: `POST /api/whatsapp/connect`
- **Authentication**: **Required** (`requireAuth`)
- **Purpose**: Launches a fresh session event loop under Baileys, caching local files isolated by tenant.

### 5.4 Disconnect WhatsApp Node
- **Endpoint**: `POST /api/whatsapp/disconnect`
- **Authentication**: **Required** (`requireAuth`)
- **Purpose**: Destroys active sockets and clears credentials cache.

### 5.5 Send Custom WhatsApp Invoice
- **Endpoint**: `POST /api/whatsapp/send-bill`
- **Authentication**: **Required** (`requireAuth`)
- **Request Body**: `{ customerName, phone, amount, billNo?, items?: Array }`
- **Purpose**: Simulates or dispatches formatted customer invoice alerts.

---

## 6. System Administration Services (Restricted to `requireAdmin`)

### 6.1 Clear AI Query Cache
- **Endpoint**: `DELETE /api/admin/cache`
- **Purpose**: Destroys cached AI query hashes.

### 6.2 Fetch System Telemetry & Environment Stats
- **Endpoint**: `GET /api/admin/system`
- **Purpose**: Returns active environment configurations, whitelists, database rows totals, and model state checkers.

### 6.3 Get System Audit Logs
- **Endpoint**: `GET /api/admin/logs`
- **Purpose**: Retrieves structural log lists showing IP, agent footprint, and operator associations.

### 6.4 Get AI Action Logs
- **Endpoint**: `GET /api/admin/ai-logs`
- **Purpose**: Filters the audit log showing AI-specific transactions.

### 6.5 View & Manage Telemetry Tracking Records
- **GET /api/admin/tracking**: Fetch trace records (limited to last 100).
- **POST /api/admin/tracking**: Record manual telemetry footprints.
- **PUT /api/admin/tracking/:id**: Modify a trace.
- **DELETE /api/admin/tracking/:id**: Erase a trace.

### 6.6 View & Manage User Records
- **GET /api/admin/users**: Fetch users.
- **DELETE /api/admin/users/:id**: Cascading removal of user account and associated sub-tables (transactions, products, customers).
