# 📋 Statement of Work (SOW) Schedules & Product SLA Frameworks
> **Governed by:** Master Services Agreement (`MDAI-MSA-2026-MASTER`)  
> **Reviewed by:** Toby Flenderson (`toby-compliance`) & Kevin (`kevin-analytics`)

---

## 🏬 Schedule A: Statement of Work — DukaanMitra-OS Retail Automation
**SOW Identifier:** `SOW-DM-{{clientCode}}-01`  
**Client:** {{clientCompanyName}}  
**Effective Date:** {{sowEffectiveDate}}  

### 1. Scope of Deployment
1. Deployment of DukaanMitra-OS across {{storeCount}} retail locations and {{counterCount}} billing terminals.
2. WhatsApp Cloud API Webhook configuration with custom business number provisioning.
3. Voice-to-Bill and text NLP Munim agent activation supporting Hinglish credit and cash entries.
4. Product inventory catalog ingestion (up to 5,000 SKUs).
5. Open Network for Digital Commerce (ONDC) Beckn protocol v1.2 merchant onboarding and catalog synchronization.

### 2. Service Level Agreement (SLA) & Performance Standards
- **System Availability:** 99.9% uptime for core WhatsApp Munim processing service.
- **Voice-to-Bill Parsing Latency:** Mean audio transcription and bill compilation under 3.5 seconds.
- **Incident Escalation:** Level 1 (Counter billing blocked) — response within 15 minutes, resolution within 1 hour.
- **Backup & Resilience:** Local SQLite cache stores transactions offline during store internet outages with automatic background cloud synchronization upon reconnection.

### 3. Commercial Schedule
- **Monthly Subscription Fee:** ₹{{monthlyRetailFee}} + 18% GST (SAC: 998313).
- **Billing Frequency:** Monthly in advance; 15-day payment terms.

---

## 🚛 Schedule B: Statement of Work — TruckWala 24x7 Highway Fleet Emergency Response
**SOW Identifier:** `SOW-TW-{{clientCode}}-01`  
**Client:** {{clientCompanyName}}  
**Effective Date:** {{sowEffectiveDate}}  

### 1. Scope of Coverage
1. 24x7 Emergency Highway Breakdown & SOS coverage for {{fleetSize}} registered commercial vehicles.
2. Route Coverage: National Expressways (NE-4), Golden Quadrilateral corridors (NH-48, NH-44, NH-19, NH-16) and major interstate arterial links.
3. Centralized multilingual emergency driver helpline access (Hindi, Punjabi, Marathi, Gujarati, Telugu, Tamil).
4. Direct dispatcher dashboard with live GPS tracking, live video damage inspection, and centralized digital GST billing.
5. OBD-II telematics data integration for vehicle health telemetry.

### 2. Service Level Agreement (SLA) & Penalty Framework
- **Triage & Dispatch SLA:** Central dispatch assigns nearest verified mechanic van within **10 minutes** of SOS receipt.
- **On-Scene Arrival Guarantee:**
  - National Expressways & Major Corridors: **30 to 45 minutes**.
  - State Highways & Remote Arterials: **Under 60 minutes**.
- **SLA Penalty Clause:** If mechanic arrival exceeds 60 minutes on an authorized National Highway without verifiable Force Majeure road blockage, Service Provider credits 100% of the incident dispatch fee back to Client.
- **Quality Warranty:** 30-day warranty on all major mechanical repairs; 6-month manufacturer warranty on OEM replacement parts.

### 3. Commercial Retainer & Corporate Rate Card
- **Monthly Fleet Retainer:** ₹{{perTruckRetainer}} / truck / month for {{fleetSize}} trucks = **₹{{totalMonthlyRetainer}} / month** + GST.
- **Corporate Standard Rates:** Fixed tariff card for labor, towing, and genuine replacement components with centralized 30-day corporate billing credit.

---

## ☀️ Schedule C: Statement of Work — SolarHub CleanTech Microgrid & PPA
**SOW Identifier:** `SOW-SH-{{clientCode}}-01`  
**Client:** {{clientCompanyName}}  
**Effective Date:** {{sowEffectiveDate}}  

### 1. Technical Scope & Sizing
1. Turnkey installation of a {{solarCapacityKw}} kWp grid-connected industrial rooftop solar photovoltaic microgrid.
2. Sourcing and installation of Tier-1 Bifacial Mono PERC PV modules (550Wp+) and European high-efficiency grid-tie string inverters.
3. Non-penetrative aluminum mounting structures engineered for 150 km/h wind resilience with 10-year roof weatherproofing warranty.
4. Complete regulatory handling: State DISCOM net-metering liaison, CEIG statutory electrical safety approvals, and bi-directional meter synchronization.
5. SolarSync IoT telemetry unit installation and peer-to-peer (P2P) energy credit wallet integration.

### 2. Commercial Power Purchase Agreement (PPA) Model
- **Capital Expenditure (Capex):** **₹0 (Zero Upfront Investment by Client)**.
- **PPA Tariff:** Flat **₹4.50 / kWh** generated and delivered at the plant busbar (fixed annual escalation capped at 1.5%).
- **Guaranteed Minimum Generation:** 1,450 kWh per kWp installed annually. If actual annual generation falls below 90% of guaranteed yield (barring grid outages), Service Provider compensates Client for the tariff differential.
- **Operations, Maintenance & Insurance:** 100% borne by Service Provider for the entire 20-year term.

---

## 🔐 Schedule D: Statement of Work — ProofLedger AI Cryptographic Audit & Anti-Forgery
**SOW Identifier:** `SOW-PL-{{clientCode}}-01`  
**Client:** {{clientCompanyName}}  
**Effective Date:** {{sowEffectiveDate}}  

### 1. Technical Scope of Integration
1. Deployment of ProofLedger AI local-first cryptographic ledger container on Client's private sovereign VPC or on-premise infrastructure.
2. Webhook integration between Client's Loan Origination System (LOS) / Underwriting Engine and ProofLedger event daemon.
3. Canonicalization and SHA-256 hash chaining of all automated credit scoring triggers, KYC approvals, and loan disbursement authorizations.
4. DIP Vision on-device biometric document liveness and forensic PDF anti-forgery detection integration.
5. Provisioning of standalone Verifier CLI executable for statutory RBI/SEBI regulatory audits.

### 2. Performance SLA & Defensibility Warranties
- **Microservice Verification Latency:** Mean verification throughput under **50 milliseconds** per event transaction.
- **Tamper-Evident Immutability Guarantee:** Mathematical cryptographic certainty; any unauthorized payload alteration or sequence modification triggers immediate signature failure alerts.
- **Regulatory Compliance Warranty:** 100% compliance with RBI Digital Lending Master Directions and DPDP Act 2023 Section 8 data fiduciary standards.
- **Support Availability:** 99.99% container uptime; 24x7 priority incident response for automated underwriting blockers.

### 3. Commercial Licensing
- **Annual Enterprise Software License:** ₹{{annualLicenseFee}} / year (billed annually in advance) + 18% GST (SAC: 998314).
