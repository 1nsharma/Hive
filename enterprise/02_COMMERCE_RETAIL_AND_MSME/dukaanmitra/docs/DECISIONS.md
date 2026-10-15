# Architectural Decisions Records (ADR) (v1.0)

This document indexes the critical technical decisions, trade-offs, and architectural guidelines established for the BazaarSync GST Compliance Platform.

---

## 1. ADR-001: Centralized, Pure-Function Tax Engine

### Context
Tax calculations occur across multiple layers of the application: client-side POS cart summary, backend transaction verification, stock adjustment processing, and bulk receipt scanning via Gemini OCR. Scattering tax math creates calculation drift (e.g., slight discrepancies due to floating-point rounding at different positions).

### Decision
- **Unified Calculation Utility**: All tax calculations MUST execute through a single centralized utility library: `src/utils/taxEngine.ts`.
- **Pure Functions Only**: The tax engine must be designed as a stateless, pure function package. It takes raw numbers and configurations (e.g. `calculateTax({ price: 100, quantity: 2, gstRate: 0.18, isInclusive: true, isInterstate: false })`) and outputs deterministic, highly typed structures.
- **No Side Effects**: The calculation functions must never directly read from or write to databases or localStorage.

### Consequences
- **Positive**: Complete reliability and matching calculations between client and server. Zero calculation drift.
- **Negative**: Client components must actively import and pass parameters instead of relying on local shortcut computations.

---

## 2. ADR-002: Dynamic Historical Versioning of HSN/Tax Rates

### Context
If a product's HSN or tax rate changes (e.g., from 18% to 12%), updating the product row in the `products` table directly would immediately corrupt all previously filed sales invoice reports that reference that product, causing mathematical mismatches in audits.

### Decision
- **Immutable Invoice Lines**: All invoice line items stored in transaction databases must persist the `gstRate` and `hsnCode` applied **at the precise moment of sale** directly inside the transaction/invoice table.
- Any subsequent product edits will only affect future transactions, leaving history structurally secure and uncorrupted.

### Consequences
- **Positive**: Guaranteed retroactive financial consistency. Meets CBIC auditing requirements perfectly.
- **Negative**: Increased storage footprint per transaction row. Highly acceptable trade-off for legal auditability.

---

## 3. ADR-003: Graceful Offline Fallbacks for Guest/Demo Mode

### Context
BazaarSync has an interactive "Guest/Demo Mode" that runs entirely client-side using `localStorage` simulation, alongside a secure, PostgreSQL full-stack production server mode.

### Decision
- **Symmetric Offline Calculations**: The tax calculation engine must run entirely in TypeScript and compile to the browser client-side bundle.
- When in Guest Mode, all tax computations, HSN mappings, and mock return filings are simulated inside `src/utils.ts` (guestDB layer) exactly matching backend logic.
- This maintains perfect user experience without requiring an active server connection during standard demos.

### Consequences
- **Positive**: High fidelity sales pitches and frictionless product-onboarding experience.
- **Negative**: Duplicate simulation logic within the client-side guest database managers.

---

## 4. ADR-004: Dual JWT and Firebase Token Fallback Authentication

### Context
Admins log in using a custom Admin SSH token verification mechanism, while regular shopkeepers authenticate using standard Firebase Auth ID tokens.

### Decision
- The authentication middleware (`src/middleware/auth.ts`) handles dual verification modes.
- Any API endpoints that calculate taxes or log compliance events inspect `req.dbUser` and verify tenant permissions.
- In both states, transactions are firmly isolated by `userId` to ensure zero cross-tenant leakages.

---

## 5. ADR-005: AI Munim GST Suggestion with Zero-Automation Guardrails

### Context
Gemini AI can parse receipts and voice logs, and might be used to categorize goods under HSN codes or suggest tax rate mappings. However, AI models are subject to hallucinations, and incorrect filings carry heavy legal penalties for small businesses.

### Decision
- **Verify-First UI Pattern**: AI will suggest HSN classifications, detect potential rate errors, or flag missing invoices, but **must never automatically file returns or change database mappings** without explicit human confirmation.
- The user interface must present all AI outputs as "Suggestions" requiring a click/tap to approve, adjust, or discard.

---

## 6. ADR-006: MD5 Caching of Heavy Upstream AI Payloads

### Context
Conversational parsing (via `/api/munim/parse`) and receipt/invoice scanning (via `/api/munim/scan-bill`) are computationally expensive and incur significant Google Gen AI API token costs and latency overhead. Repeated requests with the same input text or identical scanned images can exhaust developer budgets and degrade the user experience.

### Decision
- **MD5 Content Hashing**: Generate a cryptographic hash of the incoming content (raw Hinglish text for `/parse`, clean base64 image strings for `/scan-bill`).
- **AI Cache Table (`ai_cache`)**: Check the local database for existing cache entries matching the computed hash. If found, increment `hitCount` and return the structured JSON payload immediately.
- **Latency Optimization**: Sub-millisecond response times are delivered on cache hits, bypassing remote Vertex/GenAI calls completely.

### Consequences
- **Positive**: Near-zero API cost for repeated operations, instant response times, and resilience against sudden rate limit spikes.
- **Negative**: Dynamic or context-dependent prompts (e.g. including timestamps) cannot be cached easily. The hashing algorithm must normalize inputs (e.g., lowercase, trimmed whitespace).

---

## 7. ADR-007: WhatsApp Session Isolation and Simulation Sandbox Strategy

### Context
DukaanMitra integrates direct customer communications (e.g., sending digital GSTR receipts/invoices) using the WhatsApp protocol. Spawning multiple client connections without clean isolation can corrupt state records and cause port conflicts, while raw API connections can fail for non-paying users.

### Decision
- **Isolated Tenant Credential Stores**: Use multi-file authentication states configured in separate, isolated directories based on the user's tenant ID (`shopId`).
- **Simulated Incoming & Fallback API Channels**: Provide sandboxed simulation endpoints (`/api/whatsapp/simulate-incoming`) so that offline guest flows, marketing research trails, and developer test loops can run flawlessly without registering an active physical WhatsApp node.

### Consequences
- **Positive**: Clean multi-user separation, zero cross-session data leaks, and absolute test coverage without active hardware dependencies.
- **Negative**: Increased complexity of state synchronization inside the backend server container.

---

## 8. ADR-008: Multi-Tier Resilient AI Fallback & Structured Schema Enforcement

### Context
External AI models (like Gemini) can experience transient service outages, token-quota exhaustion, or extreme rate caps (HTTP 429) during peak business hours. Small-business billing terminals and POS lanes cannot tolerate wait times or failure crashes when checking out a customer or checking stock.

### Decision
- **Symmetric Rate-Limit Interceptors**: All routes invoking the `@google/genai` library must wrap execution blocks in structured try-catch clauses that actively monitor for quota/rate limits via `isRateLimit` checks.
- **Cascading Fallbacks**:
  - For barcode pricing queries, if Gemini fails, cascade down to query public databases: `Open Food Facts API` (by barcode code) and `FakeStore API` (by text lookup).
  - For ledger/parsing queries, if Gemini fails, instantly fall back to pre-defined local mock templates to ensure billing terminals keep moving.
- **Strict Response Schema Guards**: Set `responseSchema` parameters inside the SDK configuration to force deterministic formats (e.g., `Type.OBJECT`, `Type.ARRAY`), eliminating malformed JSON returns and parsing crashes.

### Consequences
- **Positive**: High platform availability and complete resistance to third-party API outages or token bottlenecks.
- **Negative**: Fallback data might lack the specialized nuances of real-time AI context, but remains mathematically structured and safe.

---

## 9. ADR-009: CommonJS esbuild Server Bundling for Google Cloud Run

### Context
Running full-stack Node.js / Express / TypeScript applications in containerized environments (such as Google Cloud Run) introduces overhead during container cold-starts. Standard TypeScript-to-JavaScript compilation retains complex directory trees and thousands of small physical files inside the `node_modules` directory, causing slower disk I/O, increased start-up delays, and ES Module import resolution issues.

### Decision
- **Unified esbuild Compile**: Compile and package the entire TypeScript Express backend server into a single, highly optimized, self-contained CommonJS file (`dist/server.cjs`) using `esbuild`.
- **Separate Asset Handling**: Compile frontend React SPA assets separately using Vite, outputting minified static files inside `/dist`, while Express handles static serving in production.
- **External Dependency Isolation**: Mark external libraries that require native platform binary bindings (such as `express`) as external packages via `--packages=external` to prevent bundling errors.

### Consequences
- **Positive**: Ultra-fast container startup and cold-start latencies. Simplified deployment with a single output binary execution path. Avoids runtime module path resolution conflicts.
- **Negative**: Requires a custom packaging and build script pipeline, which is fully automated inside `package.json`.

---

## 10. ADR-010: Multi-Tiered Testing Strategy & SRE Observability

### Context
DukaanMitra is an offline-first and AI-assisted Business Operating System. Testing AI-generated workflows, multi-tenant databases, offline local sandboxes, and low-latency API proxy routes requires clear boundaries, structured logging, and robust failure containment models rather than relying purely on manual tests.

### Decision
- **Standardized Multi-Tier Testing**: Adopt a clean separation of unit tests (via Vitest for mathematical engines), integration tests (via Supertest and mock DB schemas), and E2E browser tests (via Playwright to verify offline Guest mode transitions).
- **Core Telemetry Tracking**: Implement structured JSON logs across backend routes featuring unique transaction `correlationId` tracking.
- **Active Readiness Pings**: Add database pool checking to health monitoring flows, returning dynamic 503 errors if connection counts are saturated instead of allowing system-wide deadlocks.

### Consequences
- **Positive**: Total clarity over system failures, rapid debugging tracing from UI through API to DB, and structured coverage metrics.
- **Negative**: Incremental development overhead to write and maintain automated test scripts.

---

## 11. ADR-011: Database Extensions for Statutory GST Compliance

### Context
DukaanMitra requires a robust data model capable of tracking statutory Indian GST features, such as distinguishing B2B supplies, capturing HSN/SAC codes, breaking down CGST/SGST/IGST tax liabilities, maintaining vendor procurement records, and identifying Input Tax Credit (ITC) eligibility. The original database structure lacked columns or tables for these domains.

### Decision
- **Drizzle Table Extensions**: Add columns to existing `user_settings`, `products`, and `transactions` tables inside `src/db/schema.ts` to represent business type classifications, HSN numbers, and tax splits.
- **Dedicated Procurement Tables**: Create the separate relational tables `suppliers`, `purchases`, and `gst_returns` to track procurement ledger details, Input Tax Credit statuses (under Section 17(5)), and return filing histories.
- **Live Migration Execution**: Programmatically push schema changes onto the Google Cloud SQL PostgreSQL instance using Drizzle-Kit and verify column creation via automated system catalog queries.

### Consequences
- **Positive**: Complete alignment with CBIC regulatory guidelines, enabling B2B tax invoice generation, Input Tax Credit savings, and GSTR-1 preparation. Zero regression in existing database code.
- **Negative**: Slight increase in database schema complexity and schema synchronization checks across development pipelines.

---

## 12. ADR-012: Multi-Tenant Session Management and Enterprise RBAC Foundation

### Context
DukaanMitra is transitioning from a localized, client-only single-merchant prototype into an enterprise-scale multi-tenant Business Operating System. To securely host diverse operational profiles (such as cashier lanes, store managers, tax auditors, and delivery networks) while ensuring absolute multi-tenant row-level data isolation, we need a formalized role-based access control (RBAC) schema and robust session state synchronization.

### Decision
- **Unified Auth Middleware Guard**: Retain and refine the backend `requireAuth` framework as the single entry gate for API authentication. It validates Firebase tokens, custom JWTs, or local sandbox fallbacks, resolving user context safely.
- **Granular Enterprise RBAC**: Establish a clear permission matrix for 13 distinct corporate and shop-floor roles (Super Admin, Company Admin, Business Owner, Manager, Cashier, Staff, Accountant, Auditor, Customer, Supplier, Partner, Franchise, and Delivery). Each role maps to strict permission scopes (`read:sales`, `write:inventory`, `manage:staff`, etc.).
- **Silent Multi-Device Session Sync**: Maintain active session tracking via `/api/auth/session-log` logging events. Enable a friction-free guest data sync flow inside the preview iframe, letting users merge local sandbox items seamlessly into cloud databases upon registration.

### Consequences
- **Positive**: Complete security isolation. Eliminates data visibility leakage across tenants. Fully supports enterprise business hierarchies and store-floor operations.
- **Negative**: Front-end components must dynamically toggle UI controls based on the active role context, which slightly increases client-side view rendering complexity.
