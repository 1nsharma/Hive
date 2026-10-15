# AI Agents & Assistants (MitraOS)

**Section:** 05. AI  
**Status:** ✅ Completed  
**Owner:** Chief AI Architect  
**Last updated:** 2026-07-25  

---

## Purpose

This document catalogs the autonomous and semi-autonomous AI agents active within the DukaanMitra platform (MitraOS), detailing their roles, task-loops, and integration mechanisms.

---

## 1. The Digital Munim Agent (`munim-parser`)

The Digital Munim acts as a conversational business accountant, designed to translate natural language ledger intents directly into transaction events.

### 1.1 Core Agent Role
- **Agent Persona**: A seasoned, highly polite Indian small-shop accountant ("Munimji").
- **Core Loop**:
  1. **Listen / Parse**: Receives merchant commands in English, Hindi, or Hinglish (transcribed speech or direct keyboard input).
  2. **Context Resolution (Fuzzy Matching)**: Scans active customer name mappings and inventory SKUs to resolve partial or phonetic descriptions (e.g. "Rahul" -> "Rahul (राहुल)").
  3. **Event Extraction**: Compiles intent into structured operations:
     - `credit`: Customer purchase log (उधारी)
     - `payment`: Received customer payment (भुगतान)
     - `stock_add`: Merchant adding inventory (स्टॉक जोड़ो)
     - `sale`: Direct customer checkout (बिक्री)
  4. **Formulate Explanations**: Generates highly polite, localized summaries in Hindi/Hinglish describing exactly what was processed.
- **Verification Rule (ADR-005)**: The Digital Munim suggests the transaction but never submits mutations directly to DB ledger tables without explicit merchant approval via a "Verify-First" UI layout.

---

## 2. The Multimodal Invoice Agent (`ocr-vision`)

The Multimodal Invoice Agent processes photographs of paper ledgers, wholesaler bills, and packing notes to automate store ledger additions.

### 2.1 Core Agent Role
- **Agent Persona**: Detail-oriented, highly forgiving data entry clerk.
- **Core Loop**:
  1. **Receive Image**: Captures physical ledger scraps or printed receipts as base64 images.
  2. **Extract & Correlate**: Digitizes handwriting, matches items to standard GST rates and packaging sizes.
  3. **Verify Totals**: Performs downstream mathematical audits comparing line item sums to invoice totals.
  4. **Present Reconciliation Grids**: Yields complete catalog proposal cards for instant single-click product updates.

---

## 3. The Onboarding Business Architect (`onboard-profiler`)

The Onboarding Profiler guides new shopkeepers during registration, auto-configuring system settings to match the business domain.

### 3.1 Core Agent Role
- **Agent Persona**: Experienced business consultant and system setup architect.
- **Core Loop**:
  1. **Analyze Profile**: Processes the merchant's business name and domain description.
  2. **Determine Industry**: Classifies business into structural verticals (e.g., Pharmacy, Kirana, Restaurant, Hardware Store).
  3. **Auto-Configure Settings**: Outputs modular recommendations, flagging whether inventory tracking or Udhaar (credit) modules are required.
- **Outcome**: Minimizes customer setup friction from minutes to seconds, launching the shopkeeper into an optimized experience immediately.

---

## Related Documents

- [AI Architecture](./AI-Architecture.md)
- [Model Registry](./Model-Registry.md)
- [Prompt Library](./Prompt-Library.md)
