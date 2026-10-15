# System Map (v1.0)

This system map describes the transactional workflow, data loops, and execution lifecycles within DukaanMitra.

---

## 1. Transaction Life-Cycle (Sales/Udhaar)

When a shopkeeper enters a credit transaction (Udhaari) or complete a cash sale:

```
[Shopkeeper Actions]
        |
        v
[POS Cart / Omni Entry] ---> [Offline Simulation (LocalStorage)]  -- (If Guest Mode)
        |
        v (If Authenticated Server Mode)
[POST /api/transactions]
        |
        +---> [Auth Middleware] -> Verify JWT/Firebase Token -> Attach `req.dbUser`
        |
        +---> [Database Insertion] -> Write row in `transactions` Table
        |
        +---> [Balance Reconciliation] -> Atomically update target customer's balance column in SQL
        |
        +---> [MitraOS Dispatch] -> Broadcast `InvoiceCreated` Event to local Event Bus
                    |
                    +---> [Finance Agent] -> Checks credit ceiling constraints
                    +---> [Marketing Agent] -> Schedules monthly billing nudge via WhatsApp
```

---

## 2. Artificial Intelligence Pipeline (AI-Munim Parsing)

When a voice note transcript or receipt photo is captured:

```
[Voice Text/Receipt Base64]
        |
        v
[POST /api/munim/parse]
        |
        v
[Calculate Prompt MD5 Hash]
        |
        v
[Query Table: `ai_cache`]
        |
        +---> [HIT (Hash Exists)] ----> Return cached JSON response instantly (saves costs!)
        |
        +---> [MISS (Hash Missing)] --> Forward request to Vertex AI/Gemini
                    |
                    +---> [Gemini Model] -> Analyzes context & parses structured slots
                    +---> [Save Cache] -> Insert prompt hash & response in `ai_cache` Table
                    +---> [Return UI] -> Populate POS Cart with suggested line items
```

---

## 3. Deployment Topology (Google Cloud)

DukaanMitra is optimized for running on secure, serverless infrastructure on Google Cloud Platform:
- **Cloud Run**: Serves the compiled Express server (`dist/server.cjs`) hosting the backend routes and serving Vite's compiled static assets (`dist/`) concurrently under a single container ingress port (`3000`).
- **Cloud SQL**: A managed PostgreSQL database cluster running standard relational operations.
- **Firebase Authentication**: Handles secure user registration, OTP SMS verifications, and email/password accounts.
- **Vertex AI / Gemini API**: Generates transactional parsing and voice transcript evaluations.
- **Cloud Logging**: Aggregates system audit events for compliance tracing.
