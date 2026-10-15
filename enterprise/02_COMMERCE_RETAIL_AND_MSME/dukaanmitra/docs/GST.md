# GST Compliance Domain & Master Rules (v1.0)

This document establishes the official enterprise-grade compliance policies, legal requirements, and master rules for GST compliance within BazaarSync (formerly DukaanMitra).

---

## 1. Statutory Context & Legal Mandate
In accordance with the **Central Goods and Services Tax Act, 2017 (CGST Act)**, the **State Goods and Services Tax Acts (SGST Acts)**, and the **Integrated Goods and Services Tax Act, 2017 (IGST Act)** of India, every tax transaction, invoice, and reporting mechanism within BazaarSync must remain strictly compliant with statutory provisions.

### 1.1 Key Compliance Rules
1. **Intrastate vs. Interstate Supply**:
   - **Intrastate Supply (Section 7, CGST Act)**: Where the location of the supplier and the place of supply are in the same State/Union Territory. Attracts equal components of **CGST** (Central GST) and **SGST/UTGST** (State/Union Territory GST).
   - **Interstate Supply (Section 8, IGST Act)**: Where the location of the supplier and the place of supply are in different States/Union Territories. Attracts **IGST** (Integrated GST).

2. **Place of Supply (POS)**:
   - For Goods (Section 10 of IGST Act): Generally, the place where the movement of goods terminates for delivery to the recipient.
   - For Services (Section 12 of IGST Act): Default is the location of the registered recipient.

3. **Tax Rates (Slabs)**:
   - Standard GST rates: **0% (Nil Rated / Exempt)**, **5%**, **12%**, **18%**, **28%**.
   - **CESS**: Additional compensatory cess applicable to luxury and demerit goods (e.g., carbonated beverages, motor vehicles).
   - **TCS / TDS**: Tax Collected at Source (Sec 52) and Tax Deducted at Source (Sec 51) applicable to specified transactions.

---

## 2. Business Tax Registration & Scheme Types

The BazaarSync system must model and support two primary GST registration regimes:

### 2.1 Regular Scheme
- **Eligibility**: Businesses with aggregate turnover exceeding ₹40 Lakhs (Goods) / ₹20 Lakhs (Services). Voluntary registration is supported.
- **Tax Payment**: Calculate exact output tax liability, deduct eligible Input Tax Credit (ITC), and pay the net liability monthly.
- **Invoicing**: Must issue a **Tax Invoice** (Sec 31 of CGST Act) detailing CGST, SGST, IGST, HSN codes, and registered buyer GSTIN.
- **Returns**: GSTR-1 (Sales), GSTR-2B (Auto-populated ITC), GSTR-3B (Monthly Summary & Payment), GSTR-9 (Annual).

### 2.2 Composition Scheme (Section 10, CGST Act)
- **Eligibility**: Small taxpayers with turnover up to ₹1.5 Crore (₹75 Lakhs for Special Category States).
- **Tax Payment**: Pay tax as a flat percentage of turnover (typically 1% for manufacturers/traders, 5% for restaurants, 6% for service providers) directly from pocket.
- **Input Tax Credit**: **STRICTLY PROHIBITED** from claiming Input Tax Credit (ITC) or collecting GST from customers.
- **Invoicing**: Must issue a **Bill of Supply** instead of a Tax Invoice with mandatory declaration: *"Composition taxable person, not eligible to collect tax on supplies"*.
- **Returns**: CMP-08 (Quarterly Statement), GSTR-4 (Annual Return).

---

## 3. GST State Codes Mapping
Under Indian GST, the first two digits of a **GSTIN** (GST Identification Number) represent the state code of registration. 

| State Code | State / UT Name | State Code | State / UT Name |
| :--- | :--- | :--- | :--- |
| **01** | Jammu & Kashmir | **19** | West Bengal |
| **02** | Himachal Pradesh | **20** | Jharkhand |
| **03** | Punjab | **21** | Odisha |
| **04** | Chandigarh (UT) | **22** | Chhattisgarh |
| **05** | Uttarakhand | **23** | Madhya Pradesh |
| **06** | Haryana | **24** | Gujarat |
| **07** | Delhi | **25** | Daman & Diu |
| **08** | Rajasthan | **26** | Dadra & Nagar Haveli |
| **09** | Uttar Pradesh | **27** | Maharashtra |
| **10** | Bihar | **28** | Andhra Pradesh (Old) |
| **11** | Sikkim | **29** | Karnataka |
| **12** | Arunachal Pradesh | **30** | Goa |
| **13** | Nagaland | **31** | Lakshadweep (UT) |
| **14** | Manipur | **32** | Kerala |
| **15** | Mizoram | **33** | Tamil Nadu |
| **16** | Tripura | **34** | Puducherry (UT) |
| **17** | Meghalaya | **35** | Andaman & Nicobar (UT)|
| **18** | Assam | **36** | Telangana |
| **37** | Andhra Pradesh (New)| **38** | Ladakh (UT) |

---

## 4. GST Validation Rules

To prevent filing rejections and transactional compliance failures, the system implements rigorous structural and checksum validations.

### 4.1 GSTIN Format Validation
A valid GSTIN is a 15-character alphanumeric identifier matching the following structure:
- **Digits 1-2**: Valid State Code (01 to 38, excluding 16-17 etc. as per actual codes list).
- **Digits 3-12**: Valid 10-digit Permanent Account Number (PAN) of the business entity.
- **Digit 13**: Entity code/Entity number of registration for the same PAN (usually 1-9 or A-Z).
- **Digit 14**: Default alphabet `Z` (for future expansion).
- **Digit 15**: Checksum digit (alphanumeric, calculated using Mod-36 Lahn Checksum Algorithm).

#### Regular Expression Match:
```regex
^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$
```

---

## 5. Reverse Charge Mechanism (RCM - Section 9(3) / 9(4))
- Under RCM, the liability to pay tax is shifted to the **recipient** of the goods or services instead of the supplier.
- The recipient must self-invoice and pay CGST/SGST/IGST to the government.
- The recipient can claim Input Tax Credit on this paid RCM tax in the same/subsequent month, subject to standard ITC eligibility.
