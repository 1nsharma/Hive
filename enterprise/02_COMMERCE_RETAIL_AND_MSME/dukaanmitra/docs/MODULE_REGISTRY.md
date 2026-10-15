# Module Registry (v1.0)

This document catalogs every significant software module in DukaanMitra, defining its technical purpose, dependencies, current state, and operational status.

---

## 1. Feature Modules (`src/features/`)

### 1.1 POS & Billing Billing Module (`src/features/pos/`)
- **Purpose**: Interactive point-of-sale register. Handles product catalog lookups, barcode reading simulations, cart modifications, and prints/generates transaction invoices.
- **Key Files**: `POSTab.tsx`
- **Dependencies**: Lucide Icons, Framer Motion, local client states.
- **Status**: **Production Ready**
- **Technical Debt**: Needs integration with the central tax calculation engine (`taxEngine.ts`) to calculate SGST/CGST/IGST dynamically during checkout.

### 1.2 Inventory & Stock Management Module (`src/features/inventory/`)
- **Purpose**: Full-featured SKU catalog tracker. Manages available stock metrics, units, pricing models, low-stock notifications, and logs stock adjustments.
- **Key Files**: `InventoryTab.tsx`
- **Dependencies**: Standard Table components, Drizzle (products, stockTransactions).
- **Status**: **Production Ready**
- **Technical Debt**: Requires adding fields for `hsnCode` and `gstRate` to achieve full tax audit compliance.

### 1.3 Ledger & Debt/Udhaar Module (`src/features/ledger/`)
- **Purpose**: Debt and ledger records for credit customers (Udhaar tracker). Logs loans (credit transactions) and debt repayment receipts.
- **Key Files**: `LedgerTab.tsx`
- **Dependencies**: Drizzle (transactions, customers).
- **Status**: **Production Ready**
- **Technical Debt**: Separate accounts for B2B transactions need explicit buyer GSTIN mappings.

### 1.4 Workspace OS Dashboard Module (`src/features/dashboard/`)
- **Purpose**: The core user workspace for shopkeepers. Houses dynamic widget lists, the universal quick-action Omnibar, and instant search bars.
- **Key Files**: `WorkspaceOS.tsx`, `Omnibar.tsx`, `ShopHeader.tsx`, `UniversalDataEntry.tsx`
- **Dependencies**: MitraOS layers (`os-core/`), Framer Motion animations.
- **Status**: **Production Ready**
- **Technical Debt**: None. This is highly optimized and integrates beautifully with guest mode fallbacks.

### 1.5 WhatsApp Connection & Order System (`src/features/whatsapp/`)
- **Purpose**: Simulates incoming customer inquiries, active WhatsApp connection handshakes, and allows shopkeepers to send PDF/text invoices directly to customers.
- **Key Files**: `WhatsAppConnection.tsx`, `WhatsAppOrders.tsx`
- **Dependencies**: Server-side mock WhatsApp router, client-side WebSocket/poll.
- **Status**: **Production Ready** (Fully Simulated sandbox)
- **Technical Debt**: Needs direct links to the GSTR GSTR-2B nudge protocols.

---

## 2. Artificial Intelligence Core Engine (`src/os-core/`)

- **Purpose**: A self-contained agentic middleware layer coordinating asynchronous business analysis. Implements an Event Bus, Reasoning Stores, Policy Checks, and Tenant Security Sandboxes.
- **Key Files**: `os-engine.ts`, `event-bus.ts`, `command-bus.ts`, `policy-engine.ts`, `agent-sandbox.ts`, `reasoning-store.ts`, `state-machines.ts`
- **Dependencies**: Google Gen AI SDK (`@google/genai`), server-side express routing.
- **Status**: **Highly Advanced Prototype / Core OS Engine**
- **Technical Debt**: Extremely rich code surface. Needs rigorous unit test coverages for state transactions.

---

## 3. Domain Agents (`src/agents/`)

- **Purpose**: Subscribed micro-brains representing each distinct business lane. Respond to database mutations and execute logic pipelines.
- **Key Files**: `inventory-agent.ts`, `finance-agent.ts`, `data-agent.ts`, `security-agent.ts`, `integrations-agent.ts`
- **Dependencies**: `os-core/` interfaces.
- **Status**: **Functional Prototypes / AI Integrations**
- **Technical Debt**: Refine prompt tokens use to optimize hit rates inside the server's `aiCache`.

---

## 4. DB Layer & Seeders (`src/db/`)

- **Purpose**: SQL table abstractions and seed loaders.
- **Key Files**: `schema.ts`, `catalog-seed.ts`, `index.ts`, `users.ts`
- **Dependencies**: Drizzle ORM, Postgres Core Drivers.
- **Status**: **Production Ready**
- **Technical Debt**: Schema updates pending to reflect detailed tax and supplier entities (see `/docs/PROJECT_STATE.md`).
