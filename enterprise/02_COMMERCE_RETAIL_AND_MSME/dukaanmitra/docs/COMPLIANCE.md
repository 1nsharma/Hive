# Compliance & Audit System Specification (v1.0)

This document details the compliance monitoring, tracking of late fees, interest, Input Tax Credit (ITC) reconciliation, and audit log infrastructure within BazaarSync.

---

## 1. Statutory Fees & Penalties

To protect small and medium businesses from compliance failures, BazaarSync automatically tracks and notifies users of liabilities stemming from delayed filings:

### 1.1 Late Fees (Section 47 of CGST Act)
If a taxpayer fails to file GSTR-1, GSTR-3B, or GSTR-4 by the due date, late fees are automatically accrued per day of delay:
- **Regular/Nil Filing**: ₹20 per day (₹10 CGST + ₹10 SGST) of delay, capped at a statutory maximum (e.g., ₹500 for Nil GSTR-1).
- **Other Filings**: ₹50 per day (₹25 CGST + ₹25 SGST) of delay, capped at statutory maximums based on aggregate turnover (e.g., ₹2,000, ₹5,000, or ₹10,000).

### 1.2 Interest on Delayed Payments (Section 50)
Any delayed payment of net tax liability attracts interest under Section 50 of the CGST Act:
- **Rate of Interest**: **18% per annum** calculated on the net tax liability paid through the electronic cash ledger (i.e., after deducting eligible ITC) for the period of delay.
- **Wrongfully Availed & Utilized ITC**: Attracts interest at **24% per annum** from the date of wrongful utilization to the date of reversal.

---

## 2. Input Tax Credit (ITC) Reconciliation (GSTR-2B)

A critical compliance function is ensuring that the Input Tax Credit (ITC) claimed by the business in GSTR-3B matches the sales reported by their suppliers in GSTR-1, which auto-populates the recipient's **GSTR-2B**:

### 2.1 Matching States
- **Matched**: Supplier uploaded invoice, GSTIN matches, tax amounts match. ITC state = `'eligible'`.
- **Mismatched (Discrepancy)**: Supplier uploaded invoice but the tax amount or invoice number has a discrepancy. ITC state = `'discrepancy'`.
- **Missing**: Supplier did not upload the invoice. ITC state = `'missing'`.
- **Action Suggested**: AI-triggered WhatsApp nudge to the supplier requesting them to upload the invoice or correct their GSTR-1 filing to release the buyer's locked ITC.

---

## 3. Compliance Health Score Calculation
To give business owners peace of mind, the system computes an ongoing **Compliance Health Score** (from 0 to 100) based on:
- **Filing Punctuality (40%)**: On-time filing of monthly GSTR-1 and GSTR-3B statements over the last 12 months.
- **ITC Leakage (30%)**: Percentage of purchase tax successfully matched and reconciled with GSTR-2B vs. missing or blocked credit.
- **Liability Accuracy (20%)**: Discrepancies between outward supplies recorded in sales registers and taxes reported in filed returns.
- **Late Fees & Active Interest (10%)**: Absence of unpaid late fees, penalties, or statutory interest.

---

## 4. Immutable Audit Log (Compliance Ledger)
Every tax calculation, update, or filing adjustment must leave an indelible, legally auditable trail in the system database.

### 4.1 Log Schema
```typescript
interface GSTAuditEntry {
  id: string;                    // UUID
  businessId: number;            // Reference to userSettings / tenant
  userId: number;                // User who executed the action
  eventType: 'TaxCalculation' | 'ReturnFiling' | 'ManualAdjustment' | 'RuleUpdate';
  sourceDocumentType: 'sales_invoice' | 'purchase_bill' | 'credit_note' | 'debit_note' | 'gstr_3b';
  sourceDocumentId: string;
  beforeState: string;           // JSON representation of tax values before
  afterState: string;            // JSON representation of tax values after
  calculationDetails: {
    taxableAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    cess: number;
  };
  clientIp: string;
  userAgent: string;
  timestamp: string;             // ISO-8601 UTC
  checksum: string;              // SHA-256 HMAC of log entry to ensure anti-tampering
}
```
- **Constraint**: Once written, audit entries are strictly **read-only**. Any subsequent corrections must be entered as separate adjusting journal entries with a link to the original audit log.
- **Audit Reports**: Standard-compliant audit logs can be exported directly for tax officer inspection or statutory financial audits.
