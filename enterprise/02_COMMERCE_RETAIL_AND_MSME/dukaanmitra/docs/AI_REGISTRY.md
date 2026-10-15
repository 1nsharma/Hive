# AI Capability & Services Registry (v1.0)

This registry catalogs the artificial intelligence capabilities, models, and background services active across the DukaanMitra platform.

---

## 1. AI Infrastructure Configuration

The DukaanMitra backend acts as a secure proxy gateway for all machine learning and generative workflows, using the modern `@google/genai` TypeScript SDK. 

- **Global Client Initialization**: Implemented at module-load in `/server.ts` with telemetry markers:
  ```ts
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  ```
- **Deployment Platform**: Executed in serverless containers on Google Cloud Run.
- **Key Safety Guard**: All API keys are completely isolated on the server-side, preventing credential leaks to client browsers.

---

## 2. Active AI Module Registry

The platform features 5 core production-ready AI services integrated into everyday merchant operations:

| Endpoint Path | Service ID | Target Model | Payload Limits | Primary Purpose |
| :--- | :--- | :---: | :---: | :--- |
| `/api/munim/parse` | `munim-parser` | `gemini-2.5-flash` | 10 KB | Conversational parsing of Hindi/English ledger intents. |
| `/api/munim/scan-bill` | `ocr-vision` | `gemini-2.5-flash` | 50 MB | Multimodal scanning of physical invoices and paper notes. |
| `/api/ai/suggest-catalog` | `catalog-creator` | `gemini-2.5-flash` | 5 KB | Automated stock recommendation lists based on business type. |
| `/api/ai/product-lookup` | `pricing-guru` | `gemini-2.5-flash` | 5 KB | Kirana MRP estimator and standard product pack sizing. |
| `/api/onboarding/analyze` | `onboard-profiler` | `gemini-2.5-flash` | 5 KB | Automated business module activation recommendation. |

---

## 3. Specifications of Active Modules

### 3.1 Digital Munim Speech & Text Parser (`munim-parser`)
- **Business Role**: Serves as the natural language core of MitraOS, translating spoken or typed text (Hindi, English, Hinglish) into structured database actions.
- **Inputs**: Natural language text query, lists of active customer profiles, lists of product SKUs.
- **Outputs**: Parsed transaction object containing customer name, product SKU, quantities, pricing, adjustment types, and highly polite Hindi summaries.
- **Rate Limit Fallback**: Bypasses network blocks under high loads to serve static offline mock models instantly, preserving core interface availability.
- **Production Status**: **Production Ready**

### 3.2 Multimodal Bill & Receipt OCR (`ocr-vision`)
- **Business Role**: Processes photographs of wholesaler bills, packaging slips, or handwritten scraps, extracting line items instantly.
- **Inputs**: Base64 encoded JPEG/PNG image data.
- **Outputs**: JSON list of items, calculated MRP prices, purchase quantities, calculated totals, and a summary of scanned lines.
- **Rate Limit Fallback**: Yields pre-compiled structured mock invoices if the system encounters rate caps (`429`), keeping client interfaces interactive.
- **Production Status**: **Production Ready**

### 3.3 Product catalog Generator (`catalog-creator`)
- **Business Role**: Minimizes manual entry by auto-generating a catalog list suited to the store's exact category (e.g. Pharmacy, Kirana, Electronics).
- **Inputs**: Active shop category name or onboarding profile settings.
- **Outputs**: India-context wholesale items merged with a large catalog seed list.
- **Production Status**: **Production Ready** (Highly optimized to load from memory cache on secondary requests).

### 3.4 Product MRP Estimator (`pricing-guru`)
- **Business Role**: Auto-fills pricing and stock packaging units when adding new stock items.
- **Inputs**: Plain text product description or barcode string.
- **Outputs**: Structured estimated cost price, selling price, packaging unit, and standard name.
- **External API Fallbacks**: Uses Open Food Facts API (by barcode) and FakeStore API (by text) to resolve products if upstream model connections fail.
- **Production Status**: **Production Ready**

### 3.5 Onboarding Profiler (`onboard-profiler`)
- **Business Role**: Performs rapid business profiling during new merchant onboarding.
- **Inputs**: Shop name and business description.
- **Outputs**: Recommended modules to activate (e.g. Credit/Udhaar tracking, Inventory grids).
- **Production Status**: **Production Ready**
