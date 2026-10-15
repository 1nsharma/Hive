# Component Registry (v1.0)

This registry records every modular UI component in DukaanMitra, detailing props, styles, and reuse strategies.

---

## 1. Shared Layout Shells

### 1.1 ShopHeader (`src/features/dashboard/ShopHeader.tsx`)
- **Purpose**: Global app bar managing branding, network connectivity alerts, and access shortcuts.
- **Props**:
  - `isGuest?: boolean` (Triggers visual local-storage alert banner).
  - `onNotificationClick?: () => void` (Toggles notification drawer).
  - `showBack?: boolean` (Displays native back caret).
  - `onBack?: () => void` (Back click execution).
  - `onSettingsClick?: () => void` (Navigates to settings).
- **Styling**: Fixed container with glassmorphic `backdrop-blur` and thin border separators.

### 1.2 Omnibar (`src/features/dashboard/Omnibar.tsx`)
- **Purpose**: Global quick-search and voice entry field allowing immediate transactions recording or catalog indexing.
- **Props**:
  - `customers: Customer[]`
  - `products: Product[]`
  - `transactions: Transaction[]`
  - `onNavigate: (tab: string) => void`
- **Styling**: Floating pill bar positioned directly beneath the shop header.

---

## 2. Page Components & Screen Layouts

### 2.1 WorkspaceOS (`src/features/dashboard/WorkspaceOS.tsx`)
- **Purpose**: Principal widget hub.
- **Props**: `{ user, customers, products, transactions, setActiveTab, onRefreshDB }`.
- **Reusable Subsections**:
  - Stat Hero Card (Collection totals)
  - Quick Action Icons Grid (POS, Khata, Stock, Reports)
  - Needs Attention List (Urgent stock shortage warnings, collection targets)
  - Recent Bills ledger lines

### 2.2 POSTab (`src/features/pos/POSTab.tsx`)
- **Purpose**: Interactive cash checkout.
- **Props**: `{ customers, products, onRefreshDB, user }`.
- **Key Modules**:
  - Customer selection drawer with instant query matching.
  - Cart line items summary card.
  - Product barcode/search query selector.
  - Payment method chips selectors (Cash, Khata, UPI).

### 2.3 LedgerTab (`src/features/ledger/LedgerTab.tsx`)
- **Purpose**: Digital debtor ledger sheet.
- **Props**: `{ customers, transactions, onRefreshDB }`.
- **Modules**:
  - Master search input bar.
  - Customer contact records card displaying active outstanding balances.
  - Individual ledger card showing historically itemized statements.

### 2.4 InventoryTab (`src/features/inventory/InventoryTab.tsx`)
- **Purpose**: Stock control panel.
- **Props**: `{ products, onRefreshDB }`.
- **Modules**:
  - Active search bar.
  - SKU catalog list displaying unit configurations, low-stock threshold triggers, and stock adjustments.

---

## 3. Global CSS Utility Classes (`src/index.css`)
To keep bundle sizes small and visual layout completely aligned, the system uses custom Tailwind theme parameters paired with lightweight utility variables:
- **`.card`**: Uniform surface containers featuring `var(--card)` background colors, 16px border-radius, and thin borders.
- **`.btn`**: standard button base with dedicated variants for `.btn.primary`, `.btn.dark`, and `.btn.wa` (WhatsApp Green).
- **`.field`**: Unified input forms wrapping labels, standard border inputs, and monospace fonts for numeric values.
- **`.ledger-line`**: Clean horizontal list dividers with dashed border separators for tabular data representation.
