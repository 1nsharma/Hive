# Feature Registry (v1.0)

This registry catalogs the current feature set of DukaanMitra, outlining implementation percentages across technical layers, strategic priority level, and current completion scores.

---

## 1. Feature Map & Readiness Scores

| Feature Category | Feature Name | Total Completion % | Backend % | Frontend % | DB % | Doc % | Test % | Priority |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Authentication** | Multi-Mode Auth (Firebase / Guest Mode / Admin SSH) | **95%** | 95% | 95% | 95% | 95% | 80% | **Critical** |
| **POS Billing** | Checkout Desk, Cart Management, Cash Sales | **90%** | 85% | 95% | 85% | 90% | 80% | **High** |
| **Inventory** | SKU Catalog, Stock Updates, Low Stock Thresholds | **95%** | 95% | 95% | 95% | 90% | 85% | **High** |
| **Udhaari Ledger** | Customer Debt Logs, Payment Receipts, Account Cards | **95%** | 95% | 95% | 95% | 90% | 85% | **High** |
| **Workspace OS** | Omnibar, Dynamic Widgets, MitraOS Panels | **98%** | 95% | 100%| 95% | 95% | 90% | **Medium** |
| **WhatsApp Core** | Connection Handshakes, Order Simulator, Invoice Sharing | **90%** | 90% | 90% | 100%| 90% | 80% | **Medium** |
| **AI Modules** | AI-Munim Parser (voice/receipt scans), Prompt Cache | **85%** | 85% | 85% | 90% | 80% | 75% | **High** |
| **Admin Console** | System Logs, User Bans, Token Cache Flush | **95%** | 95% | 95% | 95% | 90% | 85% | **Low** |
| **Reports** | Cash Book, Profit & Loss, GST Tentative Registers | **80%** | 75% | 85% | 75% | 80% | 70% | **Medium** |
| **Settings** | Business Metadata, Address, Category Selection | **95%** | 95% | 95% | 95% | 90% | 85% | **High** |

---

## 2. Feature Definitions & Deep-Dive

### 2.1 Multi-Mode Auth
- **Details**: Shopkeepers authenticate via Firebase Auth. Guest mode acts as an instant local bypass storing structured elements in client localStorage. Admins authenticate via unique SSH token pairings.
- **Priority**: **Critical**
- **Refinement**: Handle expired tokens gracefully (completed in middleware fallbacks).

### 2.2 POS Billing & Cart
- **Details**: Single-screen cart with search filter, price/margin indicators, quantity increments, and simulated printer pop-up triggers.
- **Priority**: **High**
- **Refinement**: Build compliance calculations to parse MRP items cleanly into Taxable value and Tax components (CGST/SGST/IGST).

### 2.3 Udhaari Ledger
- **Details**: Debt reconciliation for local communities. Features digital receipt logs and quick filters.
- **Priority**: **High**
- **Refinement**: Maintain historical consistency of transactions.

### 2.4 WhatsApp Sandbox
- **Details**: Allows simulating customer messages sending orders like "send 2 packets of sugar and 1kg rice" or "what is my balance?". The AI engine parses these and suggests POS entries.
- **Priority**: **Medium**

### 2.5 AI-Munim Parser
- **Details**: Converts unstructured language text or scanned invoices (via Gemini Vision) into high-fidelity transaction schemas with confidence metrics and Hindi explanations.
- **Priority**: **High**
- **Refinement**: Uses a smart server-side Cache (`aiCache` table) with MD5 query hashes to save external model costs and maximize response times (hits).
