# Master B2B Client Research & Authority Verification Database
_Managed by Phyllis Vance (`client-research`) — Division of Enterprise Client Intelligence_

---

## 🏛️ Corporate Authority & Legal Registration Knowledge Stack

Har ek prospective enterprise client ko outreach pipeline me bhejne se pehle, uski legal authenticity verify ki jaati hai:

| Registry / Authority | Data Point Verified | Source / Database | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **MCA (Ministry of Corporate Affairs)** | CIN (Corporate Identity No.), Paid-up Capital, Directors (DIN) | [mca.gov.in](https://www.mca.gov.in) | Status: `ACTIVE`, RoC compliance filed |
| **GSTIN Portal** | 15-Digit GST Number, State Jurisdiction, Filing Status | [services.gst.gov.in](https://services.gst.gov.in) | Active GST status, GSTR-1 & 3B regularity |
| **MSME Udyam Portal** | Udyam Registration No., Micro/Small/Medium classification | [udyamregistration.gov.in](https://udyamregistration.gov.in) | Eligible for Govt MSME tender preferences |
| **DGFT (Directorate General of Foreign Trade)**| IEC (Import Export Code) | [dgft.gov.in](https://dgft.gov.in) | Required for cross-border export logistics |
| **DISCOM / CERC** | Power Sanction Load & Net Metering approval | State DISCOM Portals | Verified solar rooftop sanction feasibility |

---

## 🎯 Target Industry Sectors & High-Value Client Personas

### 1. Vertical: Logistics & Supply Chain (`TruckWala 24x7`)
- **Target Segment:** Fleet Owners (10–200 trucks), 3PL Freight Forwarders, Interstate Transport Operators.
- **Decision Makers:** Head of Fleet Operations, VP Logistics, Transport Contractors.
- **Client Pain Point:** Unplanned breakdown on NH-48 / NH-44, 18-hour mechanic delays, fuel theft, lack of live SOS telematics.
- **Our Value Pitch:** 30-Minute roadside SOS dispatch network across golden quadrilateral + telematics OBD tracker integration.

### 2. Vertical: Commerce & Retail MSMEs (`DukaanMitra-OS`)
- **Target Segment:** Supermarkets, Wholesalers, Kirana Chains, Multi-store Garment/Pharma Retailers.
- **Decision Makers:** Proprietor, MD, Operations Manager.
- **Client Pain Point:** High SaaS POS fees, slow barcode billing, manual GST tallying, zero ONDC presence.
- **Our Value Pitch:** Voice AI Munim, WhatsApp automated receipts & billing, zero-commission ONDC catalog sync.

### 3. Vertical: CleanTech & Energy (`SolarHub` / `SolarSync`)
- **Target Segment:** Commercial Warehouses, Cold Storages, Manufacturing Plants with >50 kW rooftop space.
- **Decision Makers:** Facility Director, Plant Manager, CFO.
- **Client Pain Point:** High DISCOM commercial tariff (₹9–₹12/unit), slow subsidy paperwork for PM Surya Ghar.
- **Our Value Pitch:** 40% immediate electricity cost reduction + peer-to-peer solar energy credit wallet.

### 4. Vertical: GovTech & Security (`ProofLedger` / `DIP Vision`)
- **Target Segment:** NBFCs, Micro-lenders, Educational Institutions, Private Security Agencies.
- **Decision Makers:** Chief Risk Officer, Compliance Head, Security Director.
- **Client Pain Point:** Document forgery, fake Aadhaar/PAN cards, manual KYC friction.
- **Our Value Pitch:** Cryptographic SHA-256 tamper-proof credential ledger + on-device biometric face match.

---

## 📋 Verified Prospective Client Pilot Pipeline (Sample Batch 01)

| Client Company Name | Target Sector | Est. Fleet / Outlets | Decision Maker Role | Target Solution | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **National Express Freight Lines** | Transport / Fleet | 85 Heavy Trucks | Chief of Fleet | TruckWala 24x7 SOS | MCA / GSTIN Verified (`ACTIVE`) |
| **Bhavani Supermarkets Group** | Retail Grocery Chain | 14 Outlets | Managing Partner | DukaanMitra-OS | GSTIN / Trade License Verified |
| **Apex Cold Storage Ltd** | Agro Logistics | 120,000 sq ft Cold Storage | General Manager (Plant) | SolarHub 150kW Microgrid | DISCOM HT Connection Verified |
| **SecurePay Micro-Finance NBFC**| FinTech / Lending | 45 Regional Branches | Head of Compliance | ProofLedger KYC Engine | RBI NBFC Registered / MCA Verified |
| **Kalyan Interstate Movers** | Heavy Haulage | 42 Multi-Axle Trailers | Operations Director | TruckWala Telematics | VAHAN / GSTIN Verified |

---

## 🔄 Lead Handoff Protocol
1. Phyllis verifies company registration numbers (CIN / GSTIN).
2. Contact details (Official corporate domain email, phone, LinkedIn executive profile) are appended.
3. Qualified lead file is dropped into `hive/agents/client-closer/inbox/` for Andy's calling and Gmail outreach engine.
