# Technical Debt Register (v1.0)

This registry highlights outstanding technical debt, identifies its impact on compliance, and outlines concrete remediation paths.

---

## 1. High-Impact Technical Debt Catalog

### 1.1 Lack of Centralized Tax Split Calculations (POS Tab)
- **Symptoms**: The point-of-sale screen (`POSTab.tsx`) processes prices as flat numbers, without decomposing them into standard CGST, SGST, or IGST tax splits.
- **Compliance Impact**: Prevents the generation of compliant Tax Invoices for registered B2B buyers (required under CGST Act Section 31).
- **Remediation Plan**: Refactor POS checkout flow to call the pure-function `taxEngine.ts` utility. Display exact tax breakdowns in the checkout card and save these splits in the database.

### 1.2 Missing HSN/SAC Mapping Columns (Products Catalog)
- **Symptoms**: The `products` database table contains pricing and threshold details, but lacks fields for mandatory HSN/SAC tax codes or tax slab percentages.
- **Compliance Impact**: GSTR-1 reports cannot include the mandatory HSN-wise outward supply summary (Table 12 of GSTR-1).
- **Remediation Plan**: Run a schema extension migration adding `hsn_code` and `gst_rate` columns. Seed standard items with official CBIC classifications (e.g., 1006 for Rice, 1701 for Sugar).

### 1.3 Absence of Procurement Records & Input Tax Credit (ITC) tracking
- **Symptoms**: The inventory stock log (`stock_transactions`) records raw item additions, but lacks fields for purchase bills, vendor IDs, supplier details, or taxes paid on inputs.
- **Compliance Impact**: High risk of Input Tax Credit (ITC) leakage. Business owners end up double-paying tax because they cannot offset their output tax liabilities against input tax paid.
- **Remediation Plan**: Introduce new database entities: `suppliers` and `purchases` logs. Provide a secure interface for recording purchase tax and tagging line items with Section 17(5) blocked credit classifications.

---

## 2. Low-Impact & Code Hygiene Debt

### 2.1 Monolithic Components
- **Symptoms**: Component files like `POSTab.tsx` and `ReportsTab.tsx` grow beyond 300 lines because list items, filters, and modal dialogues are bundled together.
- **Code Impact**: Harder to write robust unit test cases and slower HMR rebuilds.
- **Remediation Plan**: Extract auxiliary modals (e.g., invoice preview, product lookup modals) into individual files inside `src/features/pos/components/`.

### 2.2 Inline Helper Methods inside App.tsx
- **Symptoms**: Shared helpers are defined directly inside components instead of utilizing the centralized `src/utils.ts` module.
- **Code Impact**: Redundant logic and potential calculation drift.
- **Remediation Plan**: Move mathematical computations and date-format formatters into `src/utils.ts`.
