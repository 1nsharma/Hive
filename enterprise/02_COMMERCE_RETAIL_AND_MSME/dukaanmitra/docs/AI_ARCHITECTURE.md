# AI System Architecture & Lifecycle Blueprint (v1.0)

This blueprint documents the design, operational patterns, data-flow integrations, caching layers, and fallback networks of the DukaanMitra AI Platform.

---

## 1. Context-Based Stateless LLM Design

Rather than establishing expensive, stateful sessions that bloat RAM on serverless Cloud Run containers, the DukaanMitra gateway employs a **Stateless Context-Injected Execution Pattern**.

```
  [Client App State Request]
              |
              v
[Compile Context dynamically in RAM]
  - Collect customer profiles
  - Collect current product SKUs
  - Collect merchant settings (GSTIN, Munim style)
              |
              v
 [Assemble Payload & Request Frame]
              |
              v
  [Stateless Single-Call to Gemini]
```

This ensures that the AI model is always aware of the user's latest inventory names, pricing states, customer identifiers, and custom rules without requiring continuous server-side session databases.

---

## 2. Dynamic Merged AI-Static Data Pattern

To optimize token counts, contain compute latencies, and preserve user experience, the system applies a **Hybrid Merged Data Strategy**:
- **Scenario (Catalog Setup)**: Generating a complete 50-item product catalog via standard LLM inference can take 10+ seconds and exhaust rate quotas.
- **DukaanMitra Solution**:
  1. The API calls Gemini to generate a high-level **Business Management Strategy** and **5 specific high-margin niche items** customized to the store type.
  2. The server loads a massive static seed array containing hundreds of standard Indian grocery goods (`src/db/catalog-seed.ts`) from memory.
  3. The custom AI items are pre-pended to the seed array, and the unified list is returned instantly to the client.

---

## 3. High-Speed Hashed Cache Layer (`ai_cache`)

Generative operations utilize a dedicated PostgreSQL-backed cache table (`ai_cache`) to avoid redundant calls to upstream LLM APIs:

```
[Incoming Payload Query]
           |
   (Generate Hash)
     - MD5 of lowercase text string, OR
     - SHA-256 of cleaned Base64 image
           |
           v
  [Query `ai_cache` Table]
          /        \
   (Hit Found)    (Miss / New Query)
       /              \
[Read response string] [Call Upstream Gemini API]
- Latency: <5ms       - Latency: 3 - 5s
- Cost: $0.00         - Cost: Token Deducted
                       \
                    [Write to `ai_cache` Table]
```

This results in instantaneous load-speeds for repeated receipts, recurring invoices, or frequent chat commands, completely eliminating unnecessary API costs.

---

## 4. Multi-Layer Rate-Limit Fallbacks

Under network degradation or when encountering severe rate constraints (`429`), the gateway activates deep tier fallbacks to protect core shopkeeper transactions:

```
               [Incoming Lookup Scans]
                         |
                (Is Gemini API Available?)
               /                          \
         [Yes / Active]              [No / Rate Limited]
         /                                  \
[Gemini 2.5 Flash Processing]      (Identify Input Type)
                                   /                   \
                            [Barcode Number]      [Product Name Text]
                                  |                        |
                       [Open Food Facts API]       [FakeStore API]
                       - Standard name lookup      - MRP estimation
                                  \                        /
                                 [Compile Mock Fallback Output]
```

- **Open Food Facts Integration**: barcode scans are parsed against international food registries, resolving exact names, weight units, and categories.
- **FakeStore API**: Text lookups parse product arrays, applying Indian rupee exchanges (`price * 80`) to suggest relevant wholesale prices.
- **Zero-Network Safeguard**: If all external connections are blocked, the endpoint synthesizes standard mock items matching the query text, guaranteeing that the billing terminal remains interactive.
