# Business Flow Intelligence (v1.0)

This document maps out the core user journeys, transactional flows, and background processing pipelines in DukaanMitra (BazaarSync).

---

## 1. Tenant Authentication & Initial Hydration Flow

```
[Start Session]
       |
       v
[Check Local Storage JWT / Firebase Token]
       |
       +---> [Token Missing / Expired] ----> Render <LoginScreen />
       |                                           |
       |                                           +---> [Tap Guest Mode] ---> Initialize LocalStorage Cache
       |                                           +---> [OTP / SSH Key]  ---> Verify with Backend -> Set Token
       v
[Token Found (Server Mode)]
       |
       v
[Fetch /api/db (Hydration payload)]
       |
       +---> [If Settings Missing] ---> Redirect to Onboarding Wizard ---> POST /api/settings ---> Load Workspace
       +---> [If Settings Found]   ---> Populate App Context Cache  ---> Render <WorkspaceOS />
```

---

## 2. POS Billing & Checkout Lifecycle

```
[Shopkeeper Adds Items to Cart]
       |
       v
[Select Customer Account]
       |
       +---> [Walk-in Cash Customer] -> Set Payment Method: Cash / UPI
       +---> [Udhaari Customer]      -> Set Payment Method: Khata (Debtor Account)
       v
[Click Complete Order]
       |
       +---> [Local Guest Mode] ------> Append to localStorage `transactions` -> Update Local Balances
       |
       +---> [Server-Sync Mode] ------> POST /api/transactions
                                             |
                                             v
                                      [Database Insertion]
                                             |
                                             +---> Write sale invoice to `transactions` table
                                             +---> If 'Khata': Increment `balance` column in `customers` table
                                             |
                                             v
                                      [Emit Event Bus Signal] ---> Trigger MitraOS Loop
```

---

## 3. Natural Voice Parsing Flow (AI-Munim)

```
[Shopkeeper presses Voice Input on Omnibar]
       |
       v
[Capture Transcript: "रमेश को 500 रुपये की चीनी उधार दी"]
       |
       v
[POST /api/munim/parse]
       |
       v
[Backend calculates MD5 of raw string]
       |
       +---> [Cache Hit (ai_cache)] ---> Return saved structured JSON response instantly
       |
       +---> [Cache Miss] --------------> Forward prompts to Vertex AI (Gemini 1.5 Flash)
                                             |
                                             v
                                      [JSON Response Generated]
                                      - Name: "रमesh"
                                      - Action: "Debit/Credit"
                                      - Amount: 500
                                      - Item: "चीनी"
                                             |
                                             v
                                      [Write to ai_cache table]
                                             |
                                             v
[UI receives Structured Schema] ---> Open POS confirmation card with auto-filled fields
```

---

## 4. GST Compliance Return Workflow (Roadmap Integration)

```
[Quarterly / Monthly Return Start]
       |
       v
[Prepare outward supply log] ---> Gather records in `transactions` where `type` === 'sale'
       |
       v
[Check Buyer Identifiers]
       |
       +---> [Has Buyer GSTIN] ----> Format in GSTR-1 Section 4A (B2B invoices)
       +---> [No Buyer GSTIN]  ----> Format in GSTR-1 Section 7 (B2C Supply)
       v
[Synthesize Tax Splits (CGST/SGST/IGST)]
       |
       v
[GSTR-1 JSON Assembly] ---> Generate compliant offline utility schema payload
       |
       v
[User Downloads JSON File] ---> Direct upload to official CBIC portal
```
