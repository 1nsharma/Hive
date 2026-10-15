# Changelog

All notable changes to the DukaanMitra (BazaarSync) platform will be documented in this file. This project adheres to Semantic Versioning (`vMAJOR.MINOR.PATCH`).

---

## [6.3.0] - 2026-07-25

### Added
- **Authentication Architecture Documentation**: Created `/docs/AUTHENTICATION.md` detailing the secure session lifecycle, dual JWT/Firebase token parsing, offline fallback decoders, and transaction synchronization protocols.
- **Multi-Tenant Isolation Documentation**: Created `/docs/TENANT_ARCHITECTURE.md` specifying logical schema boundaries, query level validation constraints (`eq(table.userId, req.dbUser.id)`), and virtual `TenantContainer`/`TenantRuntime` microservice environments.
- **Workspace & Onboarding Initialization Documentation**: Created `/docs/WORKSPACE.md` describing first-time login onboarding wizard steps, automatic metadata/settings mapping (GSTIN-based state prefixes, INR currency rules, bilingual settings), and seed product catalog generation.
- **Enterprise RBAC Expansion**: Updated `/docs/RBAC.md` with granular permission maps (`read:sales`, `write:inventory`, `manage:staff`, etc.) and mapped roles for Super Admin, Company Admin, Business Owner, Manager, Cashier, Staff, Accountant, Auditor, Customer, Supplier, Partner, Franchise, and Delivery.

### Changed
- **Staff Roster Role Selection**: Updated `/src/features/staff/StaffTab.tsx` role definitions to support all official enterprise corporate and shop-floor profiles.
- **Project Progress Registry**: Updated `/docs/PROJECT_STATE.md` to flag Sprint 1 milestones as successfully delivered and fully integrated.

---

## [6.1.1] - 2026-07-25

### Added
- **Database Schema Extensions**: Implemented GST and procurement tracking tables and columns inside `src/db/schema.ts` to close P0/P1 regulatory and data mapping gaps:
  - Added table `suppliers` for formal vendor/supplier bookkeeping, capturing names, GSTIN, phone, state codes, and balances.
  - Added table `purchases` to track vendor procurement invoices, taxable values, and Input Tax Credit (ITC) eligibility or blocking under CGST Section 17(5).
  - Added table `gst_returns` to track financial periods, GSTR form types, and filing statuses (pending, prepared, reconciled, ready, filed) with ARN numbers.
  - Extended table `user_settings` with business types (Regular vs Composition), state codes, and PAN.
  - Extended table `products` with HSN/SAC codes, GST rate slabs, descriptions, and service classifications.
  - Extended table `transactions` with invoice numbers, CGST/SGST/IGST breakdowns, HSN codes, B2B flags, and buyer GSTINs.
- **Database Schema Migration**: Executed and verified the schema changes on the live Google Cloud SQL PostgreSQL instance using Drizzle ORM and migration tools.

### Changed
- **Linter & Compilation Checks**: Re-validated the entire codebase to ensure zero syntax or type-safety regression following schema extensions.

---

## [6.1.0] - 2026-07-25

### Added
- **Enterprise Quality Registry**: Documented in `/docs/TEST_REGISTRY.md` mapping evaluated modules, estimated coverage percentages, gaps, and high-priority regression test suites.
- **Test Automation Strategy**: Outlined in `/docs/TEST_STRATEGY.md` showcasing the 3-tiered testing architecture (Vitest unit testing, Supertest integrations, and Playwright E2E browser tests) and GitHub Actions pipeline.
- **Observability Blueprint**: Cataloged in `/docs/OBSERVABILITY.md` detailing standardized JSON logging, correlation ID tracking, health checks, and performance/AI KPIs.
- **Production Checklist**: Formulated in `/docs/PRODUCTION_CHECKLIST.md` mapping out final quality gates, pre-flight checks, and post-deployment live smoke verification loops.
- **Quality Matrix**: Charted in `/docs/QUALITY_MATRIX.md` classifying modules by production readiness and specifying concrete remediation actions for any gaps.
