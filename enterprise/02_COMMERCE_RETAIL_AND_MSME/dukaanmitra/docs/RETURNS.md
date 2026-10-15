# GST Returns Management Specification (v1.0)

This document outlines the standard reporting requirements, schedules, return filing states, and preparation protocols for Indian GST Returns within BazaarSync.

---

## 1. Supported GST Return Forms & Schedules

The system supports automated preparation and reconciliation schedules for the following GST return forms:

| Form Name | Filing Periodicity | Due Date Pattern | Target Segment | Reporting Scope |
| :--- | :--- | :--- | :--- | :--- |
| **GSTR-1** | Monthly or Quarterly (QRMP) | **11th** of subsequent month (Monthly) or **13th** of subsequent month (Quarterly) | Regular Taxpayers | Details of outward supplies (Sales) of goods and services. |
| **GSTR-3B** | Monthly | **20th** (for turnover > 5Cr) or **22nd / 24th** (state-wise under 5Cr) of subsequent month | Regular Taxpayers | Self-declared summary of outward supplies, input tax credit claimed, tax paid, and liability. |
| **CMP-08** | Quarterly Statement | **18th** of the month succeeding the quarter | Composition Taxpayers | Statement for payment of self-assessed tax by composition dealers. |
| **GSTR-4** | Annual Return | **30th April** of the subsequent Financial Year | Composition Taxpayers | Summary of sales, purchases, and tax paid for the entire year. |
| **GSTR-9** | Annual Return | **31st December** of the subsequent Financial Year | Regular Taxpayers (turnover > 2Cr mandatory) | Consolidation of all monthly/quarterly returns filed during the fiscal year. |

---

## 2. Return State Machine Flow

Returns are prepared through a sequential, state-controlled compliance workflow to ensure accuracy prior to submission:

```
 [Draft/Pending] ──> [Prepared] ──> [Reconciled with GSTR-2B] ──> [Ready to File] ──> [Filed]
```

### 2.1 State Definitions
1. **Pending (`'pending'`)**: The financial period has closed, but return compilation has not started.
2. **Prepared (`'prepared'`)**: The system has aggregated all sales and purchase records, mapped HSN codes, and computed tentative liabilities.
3. **Reconciled (`'reconciled'`)**: The system has matched purchase ITC records against GSTR-2B data. Discrepancies are highlighted, and late fees/interest are calculated.
4. **Ready to File (`'ready_to_file'`)**: The user has reviewed the summary, approved the calculation, and downloaded the GSTR JSON utility schema.
5. **Filed (`'filed'`)**: The user has provided the ARN (Application Reference Number) and the return filing date. Once in this state, the return is **locked** and immutable.

---

## 3. JSON Utility Preparation (Government Schema)
BazaarSync compiles transactional records directly into the offline utility JSON formats required for upload to the **GST Common Portal (gst.gov.in)**.

### 3.1 GSTR-1 JSON Sections Supported:
- **b2b**: Taxable outward supplies to registered persons (B2B invoices).
- **b2cl**: Taxable outward supplies to unregistered persons where the invoice value exceeds ₹2.5 Lakhs and is interstate.
- **b2cs**: Taxable outward supplies to unregistered persons (B2C small invoices, interstate or intrastate).
- **hsn**: HSN-wise summary of outward supplies, specifying HSN code, description, unit quantity, total quantity, taxable value, and tax components.
- **doc_issue**: Summary of documents issued during the tax period, specifying starting serial number, ending serial number, total issued, and cancelled invoices.

---

## 4. Revision & Amendment Protocols
Once a return is in `'filed'` state:
- **No direct deletions or updates**: The transactions in that period are frozen to preserve reporting alignment.
- **Amendments**: Corrective adjustments must be reported in the current open tax period as **Amendments** (e.g., Table 9A of GSTR-1 for amending previous B2B invoices).
- The system maintains a table of `gst_return_amendments` referencing the original invoice ID, amendment date, and the amended tax amount.
- **Audit Logging**: All amendments must be logged with the user's justification and timestamp.
