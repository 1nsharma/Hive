# HSN & SAC Classification System (v1.0)

This document establishes the official specifications for managing Harmonized System of Nomenclature (HSN) codes for goods and Services Accounting Codes (SAC) for services within BazaarSync.

---

## 1. Regulatory Requirements
The Goods and Services Tax (GST) council of India mandates the reporting of HSN/SAC codes on all outbound tax invoices. The length of the code depends strictly on the aggregate annual turnover (AATO) of the business in the preceding financial year:

| Preceding FY Turnover (AATO) | Mandatory Digits Required on Tax Invoice |
| :--- | :--- |
| **Up to ₹5 Crores** | Minimum **4 Digits** for B2B transactions. (B2C is optional but recommended). |
| **Above ₹5 Crores** | Minimum **6 Digits** for all transactions (B2B and B2C). |
| **Import / Export** | **8 Digits** mandatory (international standard). |

---

## 2. HSN Schema Specifications

To manage classifications, revisions, and product mapping without losing historic compliance data, BazaarSync models HSN/SAC entries as follows:

### 2.1 Schema Definition
- **id**: Unique system identifier (Integer, primary key).
- **code**: The string code itself (exactly 4, 6, or 8 digits for HSN; 6 digits for SAC starting with '99').
- **type**: Enumeration: `'hsn'` (Goods) or `'sac'` (Services).
- **gstRate**: Decimal percentage representing the total combined tax rate (e.g., `0.18` for 18%).
- **cgstRate**: Decimal percentage representing the CGST component (half of total rate, e.g., `0.09`).
- **sgstRate**: Decimal percentage representing the SGST component (half of total rate, e.g., `0.09`).
- **igstRate**: Decimal percentage representing the IGST component (equal to total rate, e.g., `0.18`).
- **cessRate**: Optional additional compensatory cess percentage (e.g., `0.12` for 12%).
- **description**: Precise textual description matching the official CBIC tariff list.
- **effectiveFrom**: Timestamp indicating when this tax rate came into effect.
- **effectiveTo**: Nullable timestamp. If set, indicates when this rate was superseded by a notification.
- **status**: Enumeration: `'active' | 'inactive' | 'deprecated'`.

---

## 3. Product-HSN Mapping & Inheritance
- Each product inside the `products` catalog must map to exactly one HSN or SAC record.
- Invoices must inherit the active `gstRate`, `hsnCode`, and tax classification from the product mapping **at the exact moment of sale**.
- If a product's price or tax rate is modified post-sale, historic invoices **must not change**. They must reference the archived transaction state.

---

## 4. Revision History & Auditability
When the GST Council changes a tax rate for an HSN code (e.g., reducing medical devices from 18% to 12%):
1. The existing HSN record is **not** overwritten.
2. A new version of the HSN code is inserted with a new `effectiveFrom` date.
3. The previous HSN record's `effectiveTo` field is set to the microsecond before the new rate is active.
4. Any sales made on or after the revision date automatically pull the new rate, while previous records remain auditable under the old rate.
5. This is handled by a temporal data-access pattern in the calculation engine.

---

## 5. Sample Core HSN/SAC Database Seed Reference
The system pre-seeds common HSN and SAC codes for retail, wholesale, and services:

| HSN/SAC Code | Type | GST % | Category | Description |
| :--- | :--- | :--- | :--- | :--- |
| **1006** | HSN | **0%** | Foodgrains | Rice (unbranded/regular retail) |
| **1701** | HSN | **5%** | Sugar | Cane or beet sugar and chemically pure sucrose |
| **0902** | HSN | **5%** | Tea/Coffee | Tea, whether or not flavored |
| **1512** | HSN | **5%** | Edible Oil | Sunflower, safflower, or cottonseed oil |
| **1901** | HSN | **18%**| Packaged Foods | Food preparations of flour, meal, starch or malt extract |
| **2106** | HSN | **18%**| Food Preparations | Food preparations not elsewhere specified or included |
| **3401** | HSN | **18%**| Hygiene/Soaps | Soap; organic surface-active products and preparations |
| **9963** | SAC | **5%** | Restaurants | Food serving services by restaurants, cafes, etc. |
| **9983** | SAC | **18%**| IT Services | Other professional, technical, and business services |
