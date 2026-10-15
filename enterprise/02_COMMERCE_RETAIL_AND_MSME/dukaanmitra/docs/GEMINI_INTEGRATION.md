# Gemini SDK Integration & Engineering Blueprint (v1.0)

This blueprint documents the integration specifications of the modern `@google/genai` SDK inside the DukaanMitra platform, detailing model configurations, type mappings, and telemetry standards.

---

## 1. SDK Core Configuration & Telemetry

DukaanMitra uses the standard `@google/genai` TypeScript library, avoiding all deprecated legacy Google Generative AI interfaces (such as `GoogleGenerativeAI` or `getGenerativeModel`).

### 1.1 Initialization
The client is instantiated globally inside `/server.ts` as follows:
```ts
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build", // Injected for telemetry tracking
    },
  },
});
```

---

## 2. Model Selection Guidance

While the core production system utilizes the stable `'gemini-2.5-flash'` model for conversational and multimodal parsing due to its high speed and balanced intelligence, our architecture is designed for seamless upgrades to next-generation Gemini models:

- **Basic Text Tasks (Syllables, Summaries, Chat)**: Recommended upgrade is `'gemini-3.6-flash'` for increased reasoning density and lower latencies.
- **Complex Logic & Calculations (Tax, Financial reconciliation)**: Recommended model is `'gemini-3.1-pro-preview'` for expert-level arithmetic accuracy and high-depth logic.
- **Real-Time Voice Interactivity (Mitra Voice Assistant)**: Built to support `'gemini-3.1-flash-live-preview'` utilizing raw 16-bit PCM little-endian audio blocks.

---

## 3. Strict Schema Mapping & Parameterization

To prevent JSON formatting failures, all conversational requests employ the SDK's schema parameters using standard type enums:

```ts
import { Type } from "@google/genai";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    customer: { type: Type.STRING },
    amount: { type: Type.NUMBER },
    type: { type: Type.STRING, enum: ["credit", "payment", "stock_add", "sale", "unknown"] },
    hindiExplanation: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
  },
  required: ["type", "hindiExplanation", "confidence"],
};
```

---

## 4. Rate-Limit Resilience & Token Optimizations

To handle the standard API quota restrictions of local Kirana stores, the server integrates a custom rate-limit checker middleware:

```ts
const isRateLimit = (err: any) => {
  const errStr = String(err).toLowerCase();
  const errMsg = String(err?.message || "").toLowerCase();
  return errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted') || 
         errMsg.includes('429') || errMsg.includes('quota') || err?.status === 429;
};
```

### 4.1 Token Minimization Guidelines
- **Response Size Control**: Instruct the model inside system prompts regarding specific output lengths, instead of hard-capping `maxOutputTokens` (which risks generating broken, cut-off JSON structures).
- **Temperature Tuning**: Keeps temperature parameters set to `0.1` for parsing and OCR tasks to maximize output determinism, reducing retry/re-query overhead.
