# Screen Registry (v1.0)

This registry records every user-facing view, dashboard screen, and tab within the DukaanMitra platform, specifying routes, layouts, and system connectivity.

---

## 1. Unified Workspace & Application Screens

### 1.1 Login & Gatekeeping Screen (`src/features/auth/LoginScreen.tsx`)
- **Purpose**: Authenticates owners and administrators. Supports standard Firebase Auth, local high-fidelity Guest Mode bypass, and secure SSH-key login for system founders.
- **Path / Route**: Implicit Core Entry (Condition: `!user` inside `App.tsx`).
- **Dependencies**: Lucide Icons, Fetch API Client, `localStorage`.
- **Connections**:
  - Backend API: `POST /api/auth/mock-login`, `POST /api/auth/send-ssh`, `POST /api/auth/verify-ssh`.
  - Database: `users` table representation.
- **Production Status**: **Production Ready**

### 1.2 Interactive Onboarding Wizard (`src/features/auth/OnboardingWizard.tsx`)
- **Purpose**: Welcomes new tenants, collects business coordinates (Store name, WhatsApp number, category), and initializes configuration payloads.
- **Path / Route**: Implicit Guided Route (Condition: `user && !user.businessConfig` inside `App.tsx`).
- **Dependencies**: Framer Motion transitions, Lucide Icons.
- **Connections**:
  - Backend API: `POST /api/settings` for storing configurations.
  - Database: `user_settings` table.
- **Production Status**: **Production Ready**

### 1.3 MitraOS Dashboard / Workspace (`src/features/dashboard/WorkspaceOS.tsx`)
- **Purpose**: The main central shopkeeper cockpit displaying real-time cash collections, low stock alerts, pending udhaari targets, and custom quick-action triggers.
- **Path / Route**: Tab: `"dashboard"` (Default view).
- **Dependencies**: Framer Motion layout states.
- **Connections**:
  - Backend API: `GET /api/db` (store hydration engine).
  - Database: Unified hydration of `customers`, `products`, `transactions`.
- **Production Status**: **Production Ready**

### 1.4 POS Cash Register (`src/features/pos/POSTab.tsx`)
- **Purpose**: An interactive billing deck for drafting client tickets, checking out products via search queries, and dispatching digital invoices via WhatsApp simulation.
- **Path / Route**: Tab: `"pos"`.
- **Dependencies**: Client-side cart array, local helpers.
- **Connections**:
  - Backend API: `POST /api/transactions` (Sale record write-back).
  - Database: Writes directly to `transactions` table.
- **Production Status**: **Production Ready**

### 1.5 Udhaari Ledger Book (`src/features/ledger/LedgerTab.tsx`)
- **Purpose**: Digital Khata Ledger recording customers, outstanding credit debts, and collection payments. Includes profile filtering.
- **Path / Route**: Tab: `"ledger"`.
- **Dependencies**: Lucide Icons, search parameters.
- **Connections**:
  - Backend API: `POST /api/customers`, `POST /api/transactions`.
  - Database: `customers` and `transactions` tables.
- **Production Status**: **Production Ready**

### 1.6 Inventory & Stock Tracker (`src/features/inventory/InventoryTab.tsx`)
- **Purpose**: Complete item SKU list displaying item unit measures, sale/cost prices, barcode associations, and warning alerts for low stock levels.
- **Path / Route**: Tab: `"inventory"`.
- **Dependencies**: Simple stock level calculators.
- **Connections**:
  - Backend API: `POST /api/products`, `POST /api/stock-adjust`.
  - Database: `products` table.
- **Production Status**: **Production Ready**

### 1.7 Business Analytics & PDF Reports (`src/features/reports/ReportsTab.tsx`)
- **Purpose**: Deep financial diagnostics showing cash collection ratios, net margins, customer risk scores, and GSTR sheets exports.
- **Path / Route**: Tab: `"reports"`.
- **Dependencies**: SVG charts, D3-like bar metrics.
- **Connections**:
  - Backend API: Reads unified hydration metrics.
- **Production Status**: **Production Ready**

### 1.8 Profile & Integrations Tab (`src/features/settings/SettingsTab.tsx`)
- **Purpose**: Store coordinates administration, staff shift control routing, WhatsApp sandbox pairing, and session logouts.
- **Path / Route**: Tab: `"settings"`.
- **Dependencies**: User config states.
- **Connections**:
  - Backend API: `POST /api/settings`.
  - Database: `user_settings` table.
- **Production Status**: **Production Ready**

### 1.9 Admin Console (`src/features/admin/AdminConsole.tsx`)
- **Purpose**: Advanced supervisor portal managing platform users, trace logs, prompt caches, and real-time AI performance monitoring.
- **Path / Route**: Tab: `"admin"` (Restricted to `isAdmin === true`).
- **Dependencies**: Admin token validations.
- **Connections**:
  - Backend API: `/api/admin/*` admin routing endpoints.
- **Production Status**: **Production Ready**
