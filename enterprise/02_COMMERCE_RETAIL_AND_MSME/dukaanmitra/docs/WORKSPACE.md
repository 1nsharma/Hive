# Workspace & Onboarding Initialization Architecture (v1.0)

This document specifies the workspace lifecycle, step-by-step onboarding wizard, default configurations, and layout widget engines within DukaanMitra.

---

## 1. Onboarding & First-Time Login Flow

When a user logs in for the first time, the platform prevents raw/empty workspaces by steering them through a guided 4-step AI-powered **Onboarding Wizard**:

```
 ┌──────────────────────┐
 │    Step 1: Identity  │  --> Enter Business Name, Phone, and Address.
 └──────────┬───────────┘
            ▼
 ┌──────────────────────┐
 │    Step 2: Profile   │  --> Capture optional GSTIN, maps link, and Munim Style.
 └──────────┬───────────┘
            ▼
 ┌──────────────────────┐
 │    Step 3: AI Audit  │  --> AI analyzes the description to suggest custom modules.
 └──────────┬───────────┘
            ▼
 ┌──────────────────────┐
 │    Step 4: Finish    │  --> Bootstraps database default settings & goes live!
 └──────────────────────┘
```

---

## 2. Default Workspace Initializations

To facilitate instant operations right after wizard completion, DukaanMitra executes an automated, self-contained **Bootstrap Sequence** that establishes critical business foundation configurations:

### 2.1 Default Store Configuration (Settings)
- **State Code**: Suggested based on the optional GSTIN state prefix (e.g., "27" for Maharashtra, "07" for Delhi) or defaults to the shopkeeper's active operational state.
- **Currency**: Indian Rupee (`INR` / `₹`).
- **Language**: Bilingual support (Hinglish/English toggle).
- **Timezone**: Indian Standard Time (`IST`, `UTC+5:30`).
- **Business Type**: Automatically detected by the AI model (e.g. "Pharmacy", "Restaurant", "Kirana") or falls back to "Retail".

### 2.2 Default Categories & Products (Seed Catalogs)
The database registers a solid set of default categories and fast-moving items matching the store's profile:
- **Grocery / Kirana**: Attaches staples like Atta, Sugar, Tea, Dal, and Milk Packet.
- **Pharmacy**: Attaches common OTC medicine categories, Bandages, and antiseptic items.
- **Default Units of Measure**: `kg`, `packet`, `litre`, `piece`, `box`, `g`, `ml`.

### 2.3 Default Tax Configurations
Pre-configures statutory tax categories under the Indian GST system:
- **Slab Rates**: 0% (Exempt), 5% (Essential items), 12% (Standard), 18% (FMCG/Electronics), 28% (Luxury).
- **Default Slabs**: Assumed as 18% for general goods unless specified by the HSN code.

### 2.4 Default User Roles & Permissions
Automatically creates the owner profile, and spawns standard active placeholder staff configurations:
- **Default Cashier**: Raju Bhai (Cashier, pre-enabled POS checkout rights, blocked from deletion).

---

## 3. Workspace Layout & Widgets Engine

The workspace home is governed by a modular **Widgets Engine** which reads the business profile and dynamically adjusts the layouts:

### 3.1 Adaptive UI Sections
- **Frictionless Omnibar**: Centered search bar mapping natural queries to structural commands immediately.
- **Summary Cards**: Displays active sales volume, outstanding cash-in-hand (ledger credits), and inventory alert banners.
- **Quick Action Triggers**: Instant buttons for POS Checkout, Add Customer, and Open Digital Munim.

### 3.2 Dynamic Widget Catalog
Based on the onboarding AI module mapping, widgets of sizes (`XS`, `S`, `M`, `L`, `XL`) are loaded into the user state:
- **Finance Widget**: Graphing cash credit/debit balances.
- **Inventory Alert Widget**: Flashing items running below threshold levels.
- **WhatsApp Status Widget**: Indicating automated notifications connectivity status.
- **Staff Activity Widget**: Direct link to employee check-ins and sales counts.
