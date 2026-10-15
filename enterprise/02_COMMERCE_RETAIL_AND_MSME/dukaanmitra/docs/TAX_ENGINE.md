# Tax Calculation Engine (v1.0)

This document specifies the mathematical formulations, rounding algorithms, and database-level execution guidelines for the BazaarSync Tax Engine.

---

## 1. Core Mathematical Formulations

To ensure flawless auditability, the tax engine processes values using double-precision float calculations and applies truncation/rounding strictly at the final ledger-posting level.

### 1.1 Tax-Exclusive Pricing (Forward Calculation)
When a product price is listed excluding tax, the engine calculates taxes and total invoice amount as:

$$\text{Taxable Value} = \text{Unit Price} \times \text{Quantity} - \text{Line Discount}$$

$$\text{Tax Amount} = \text{Taxable Value} \times \text{GST Rate}$$

$$\text{Total Invoice Line Amount} = \text{Taxable Value} + \text{Tax Amount}$$

Depending on the supply location, the `Tax Amount` is divided:
- **Intrastate Supply**:
  $$\text{CGST Amount} = \text{Taxable Value} \times \frac{\text{GST Rate}}{2}$$
  $$\text{SGST Amount} = \text{Taxable Value} \times \frac{\text{GST Rate}}{2}$$
- **Interstate Supply**:
  $$\text{IGST Amount} = \text{Taxable Value} \times \text{GST Rate}$$

---

### 1.2 Tax-Inclusive Pricing (Reverse Calculation)
Many retail stores (Kirana/POS) sell products at tax-inclusive prices (Maximum Retail Price - MRP). The engine must backwards-calculate the taxable base value to avoid double taxation:

$$\text{Taxable Value} = \frac{\text{MRP} \times \text{Quantity}}{1 + \text{GST Rate}}$$

$$\text{Total Tax Amount} = (\text{MRP} \times \text{Quantity}) - \text{Taxable Value}$$

#### Example:
A customer buys tea packets under MRP of ₹100, where GST rate is 5%.
- $\text{Total Amount} = ₹100.00$
- $\text{Taxable Value} = \frac{100}{1 + 0.05} = \frac{100}{1.05} = ₹95.238$
- $\text{Total Tax Amount} = 100 - 95.238 = ₹4.762$
- Since it is an Intrastate sale:
  - $\text{CGST} = \frac{₹4.762}{2} = ₹2.381$
  - $\text{SGST} = \frac{₹4.762}{2} = ₹2.381$

---

## 2. Statutory Rounding Rules (Section 170 of CGST Act)
Under **Section 170 of the CGST Act**, the amount of tax, interest, penalty, fine, or any other sum payable, and the amount of refund or any other sum due, under the provisions of this Act must be rounded off to the **nearest rupee**:
- If the fraction is **50 paise or more**, it is rounded up to the next rupee.
- If the fraction is **less than 50 paise**, it is rounded down.

### JavaScript/TypeScript Implementation:
```typescript
export function roundToNearestRupee(amount: number): number {
  return Math.round(amount);
}

// For tax calculations on invoice lines, we retain precision but round totals:
export function formatTaxValue(val: number): number {
  return parseFloat(val.toFixed(2));
}
```

---

## 3. Reverse Charge (RCM) Calculations
For purchase transactions subject to RCM (e.g., procurement from unregistered transporters or specific services under Sec 9(3)):
- Output Tax is calculated as usual based on the recipient's state code.
- A liability entry is posted in the Output Tax Ledger, marked as `is_rcm_liability = true`.
- An matching provisional entry is posted in the Input Tax Credit (ITC) Ledger as `provisional_rcm_itc`. Once tax is paid to the government, the provisional ITC is finalized as eligible ITC.

---

## 4. Input Tax Credit (ITC) Blocked Credit Engine (Section 17(5))
When a purchase is recorded, the engine must evaluate whether the tax paid can be claimed as an Input Tax Credit (ITC) or if it constitutes **Blocked Credit** under **Section 17(5)**.

### Blocked categories include:
1. **Motor Vehicles** (except when used for further supply or transportation of goods).
2. **Food and Beverages, Outdoor Catering, Beauty Treatment, Health Services** (unless used to make an outward taxable supply of the same category).
3. **Membership of clubs, health and fitness centers**.
4. **Travel benefits** extended to employees on vacation.
5. **Works contract services** for construction of an immovable property (except plant and machinery).
6. **Goods lost, stolen, destroyed, written off** or disposed of by way of gift or free samples.

The tax engine marks purchase line items with `itc_status`:
- `'eligible'` : Placed directly in the claimable electronic credit ledger.
- `'blocked'` : Added to the tax paid total but omitted from ITC ledger.
- `'provisional'` : Needs matching GSTR-2B validation.
