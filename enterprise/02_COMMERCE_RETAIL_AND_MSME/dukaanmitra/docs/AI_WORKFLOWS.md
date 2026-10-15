# AI Workflows & State-Transition Diagrams (v1.0)

This document charts the processing lifecycles, state transitions, validation checks, and data-flow pathways of DukaanMitra AI.

---

## 1. Natural Language Munim Parsing Workflow

The `POST /api/munim/parse` endpoint handles the translation of spoken/written Hinglish ledger commands into active database states.

```
       [User Spoken/Typed Command]
                    |
                    v
   [Generate MD5 Hash of Cleaned Query]
                    |
          (Query Cache Look-up)
          /                   \
   (Cache Hit)            (Cache Miss)
       /                         \
[Return JSON State]       [Query Database Context]
- Latency: <5ms           - Fetch tenant's active customers
- Cost: $0.00             - Fetch tenant's active product SKUs
                          - Fetch tenant's custom Munim style
                                  |
                                  v
                       [Compile System Prompt]
                                  |
                                  v
                        [Execute Gemini Call]
                        - Use gemini-2.5-flash
                        - Enforce Response Schema
                                  |
                                  v
                      [Sanitize Response Text]
                        - Strip markdown blocks
                        - Parse JSON schema
                                  |
                                  v
                     [Write Output to `ai_cache`]
                                  |
                                  v
                    [Return Parsed State to Client]
```

---

## 2. Multimodal Invoice & Bill Scanner OCR Workflow

The `POST /api/munim/scan-bill` endpoint processes photographs of supplier bills or handwritten notebook scraps to automate stock additions.

```
         [User Photographic Receipt Capture]
                          |
                          v
         [Extract Raw Base64 Image String]
                          |
                          v
         [Generate SHA-256 Hash of Image]
                          |
              (Query Image Cache Look-up)
              /                        \
       (Cache Hit)                 (Cache Miss)
           /                              \
  [Return JSON State]             [Compile OCR Prompt]
  - Latency: <5ms                 - Forgiving blur constraints
  - Cost: $0.00                   - Extraction rules (qty, price)
                                          |
                                          v
                               [Execute Gemini Call]
                               - Use gemini-2.5-flash
                               - Inline base64 image modality
                                          |
                                          v
                               [Sanitize Response Text]
                               - Regex clean
                               - JSON format parse
                                          |
                                          v
                            [Write Output to `ai_cache`]
                                          |
                                          v
                            [Return Item Grids to UI]
```

---

## 3. Product Catalog Onboarding Recommendation Workflow

The `POST /api/onboarding/analyze` endpoint determines optimal module activation and inventory setup parameters when registering new merchants.

```
          [User Enter Onboarding Shop Profile]
                           |
                           v
              [Compile Strategy Prompt]
                           |
               (Query API Rate Limits)
               /                      \
         (Limit Owed)            (Limit Reached)
             /                           \
  [Execute Gemini Call]           [Load Static Standard Config]
  - Use gemini-2.5-flash           - Default to Kirana setup
  - Custom module recommendations  - Standard default modules
             \                           /
              [Compile Unified Schema Output]
                           |
                           v
              [Activate Selected Modules]
```
