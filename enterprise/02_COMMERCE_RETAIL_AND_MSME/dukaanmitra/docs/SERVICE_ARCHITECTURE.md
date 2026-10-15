# Service Layer Architecture (v1.0)

This document details the responsibilities, dependencies, and integration interfaces for each business and computational service in the DukaanMitra (BazaarSync) backend.

---

## 1. Modular Business Services

### 1.1 POS Billing Service
- **Primary Responsibilities**: Processes shop checkout carts, logs ledger entries, and handles multiple payment models (Cash, UPI, Khata Credit).
- **Core Dependencies**: `transactions` database table, `globalCommandBus` (for transaction routing), `policy-engine.ts` (for debtor balance validation).
- **Architecture Pattern**: Integrates the Strangler Pattern. Instead of performing direct SQL statements, API routers hand off cart data to the command bus, maintaining strict audit logs.

### 1.2 Inventory & Stock Tracker
- **Primary Responsibilities**: Manages SKU records, tracks physical stock level increments, handles stock write-offs (spoilage/damage), and computes low stock alerts.
- **Core Dependencies**: `products` database table, `stockTransactions` schema, `event-bus.ts` (dispatches inventory alerts).

### 1.3 CRM & Debtor Ledger
- **Primary Responsibilities**: Manages debtor accounts, outstanding balance states, contact details, and logs credit payments.
- **Core Dependencies**: `customers` database table, `userSettings` (to format local SMS alerts).

### 1.4 AI-Munim Parsing Engine
- **Primary Responsibilities**: Translates spoken Hindi/English phrases into structured POS transaction objects using conversational analysis.
- **Core Dependencies**: Google Gen AI SDK (`gemini-2.5-flash`), `aiCache` (eliminates prompt round-trips).

### 1.5 WhatsApp Socket Engine
- **Primary Responsibilities**: Maintains real-time web socket linkages to Meta WhatsApp servers to support instant message dispatching.
- **Core Dependencies**: `@whiskeysockets/baileys`, Node file system storage.

---

## 2. Shared Code & Deduplication Audit

To maintain maximum runtime performance and keep execution bundles lightweight, common utility logic is shared across services:

1. **Date & Timestamp Standardization**:
   - **Duplication Risk**: Individual billing, ledger, and stock-adjustment APIs formerly formatted date boundaries independently.
   - **Unified Strategy**: Date attributes default to standardized UTC iso-strings at the DB schema boundary level (`schema.ts` defaults to `sql` generators).
   
2. **Numeric Calculations Precision**:
   - **Duplication Risk**: Financial computations (such as GST tax splits and debtor balance summing) could experience float drift.
   - **Unified Strategy**: Currencies and stock values are standardized as numeric models inside schema properties and validated in centralized transaction calculators.

---

## 3. High-Impact Refactoring Opportunities

1. **Structured Request Validation**:
   - **Issue**: API routes individually verify parameter presence (e.g., `if (!name) return res.status(400)`).
   - **Opportunity**: Introduce a standardized schema validator middleware (like Zod) to reject malformed payloads prior to hitting route handler logic.

2. **Decoupled AI Prompt Storage**:
   - **Issue**: Multimodal OCR and conversational voice-parsing system prompts are hardcoded as multi-line templates inside `server.ts`.
   - **Opportunity**: Externalize all AI prompt templates into dedicated JSON configurations under `/src/agents/prompts/` to simplify system updates.
