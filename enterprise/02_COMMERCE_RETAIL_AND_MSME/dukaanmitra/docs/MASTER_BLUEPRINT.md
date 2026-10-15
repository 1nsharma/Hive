# Master Blueprint: DukaanMitra / BazaarSync (v1.0)

This document represents the absolute authority and Master Engineering Blueprint for DukaanMitra (evolving into BazaarSync). It details the architectural paradigms, core operating patterns, system-wide integrations, and strict design patterns governing the development of the platform.

---

## 1. System Architecture Map

The system is a hybrid client-server full-stack application leveraging Express (TypeScript) on the backend, React/Vite (TypeScript) on the frontend, Drizzle ORM connected to PostgreSQL (Cloud SQL) for structured state, and Firebase for Authentication. Additionally, the platform possesses an integrated **MitraOS** AI-Agent Engine (`src/os-core/`) that drives autonomous multi-agent reasoning.

```
                  +-------------------------------------------------+
                  |               Vite Client App                   |
                  |  - POS & Billing (POSTab.tsx)                   |
                  |  - Inventory Catalog (InventoryTab.tsx)         |
                  |  - Multi-Agent Workspace (WorkspaceOS.tsx)      |
                  |  - Interactive Onboarding & Analytics           |
                  +-----------------------+-------------------------+
                                          |
                                          | HTTP & WebSocket
                                          v
                  +-------------------------------------------------+
                  |               Express Server.ts                 |
                  |  - Authentication Middleware (req.dbUser)       |
                  |  - Standard REST APIs (/api/customers, etc.)     |
                  |  - WhatsApp Integration Sandbox                 |
                  +---------+-----------------------------+---------+
                            |                             |
                            | Drizzle ORM                 | OS Engine Bus
                            v                             v
                  +------------------+          +-------------------+
                  | PostgreSQL (SQL) |          |  MitraOS Engine   |
                  |  - Users         |          |  (src/os-core/)   |
                  |  - Customers     |          |  - Agent Sandbox  |
                  |  - Transactions  |          |  - Event Bus      |
                  |  - Products      |          |  - Reasoning Store|
                  |  - Settings      |          |  - Policy Engine  |
                  +------------------+          +-------------------+
```

---

## 2. Core Operational Pillars

### 2.1 Hybrid Guest & Server State
To ensure instant interactivity and frictionless on-boarding, DukaanMitra operates on a dual-database pattern:
- **Server-Mode**: Full persistent sync with PostgreSQL via Drizzle. Authentic user settings, real transactions, and compliant GST books.
- **Guest/Demo Mode**: High-fidelity simulation using local storage states. Users can experience the workspace, POS, AI-Munim scans, and WhatsApp integrations with zero registration. Perfect functional symmetry is maintained between the simulated guest engine in `src/utils.ts` and the persistent tables in `src/db/schema.ts`.

### 2.2 Event-Driven MitraOS Core
The `src/os-core/` houses a specialized event loop and message bus (`event-bus.ts`, `command-bus.ts`) that publishes platform events like `InvoiceCreated`, `StockUpdated`, and `UserSessionLog`.
- Autonomous domains run as "Agents" (`src/agents/`) that subscribe to these events and run domain policies (e.g., the `finance-agent` tracks overdue balances, and the `marketing-agent` logs customer interactions).
- **Idempotency Guard (`idempotency.ts`)**: Ensures no duplicate API submissions trigger multiple agent runs or ledger updates.

---

## 3. GST Compliance Alignment Matrix
All core features of DukaanMitra must respect the statutory tax parameters outlined in `/docs/GST.md`, `/docs/HSN.md`, and `/docs/TAX_ENGINE.md`:
1. **Invoice Calculations**: Standard rounding must adhere to CGST Section 170 (nearest rupee). Output taxes are strictly categorized by Place of Supply (POS) state codes mapping.
2. **Catalog Structuring**: Products must link to HSN or SAC codes with corresponding combined tax rates.
3. **Purchases and Procurement**: Track Input Tax Credit (ITC) as eligible or blocked (Section 17(5)) inside vendor ledgers.

---

## 4. Engineering Quality Gates

### 4.1 Strict Modularity
- Large files are strictly forbidden. Single React component files must not exceed 600 lines. Heavy blocks must be extracted into helper utilities or custom hooks.
- Keep `App.tsx` clean of complex custom calculators. State changes, auth loaders, and routing are placed in dedicated controllers or features.

### 4.2 Type Safety
- Every API response must possess a strongly typed schema. No `any` type casting is allowed inside accounting mathematical formulations.
- All database relationships must be explicitly declared inside `src/db/schema.ts` using the Drizzle `relations` API.

---

## 5. System Evolutionary Roadmap

- **Milestone 1**: Expand database schemas to support formal GSTIN validations, standard state code assignments, and separate vendor/supplier registers.
- **Milestone 2**: Deploy the pure-function `taxEngine.ts` to coordinate POS checkout totals and print compliant PDF/WhatsApp invoices.
- **Milestone 3**: Implement GSTR-2B automatic reconciliation with incoming purchase bills and prompt suppliers with missing invoice details via simulated WhatsApp nudges.
- **Milestone 4**: Finalize return states machine logic and generate the standard GSTR offline utility JSON file.
