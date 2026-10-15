# API Dependency & Integration Map (v1.0)

This document maps the package dependencies, database schema relationships, third-party API integrations, and internal event propagation pathways active inside DukaanMitra (BazaarSync).

---

## 1. Package Dependency Tree

Our server layers are built on lightweight, performant packages to ensure rapid Cloud Run compilation and execution times:

```
[DukaanMitra Server (server.ts)]
  |
  +-- express (v4.18+) -----------------> REST Controller and routing engine
  +-- drizzle-orm (v0.29+) -------------> Type-safe SQL query builder and schema adapter
  +-- @google/genai (v0.1+) -------------> Standard SDK for Gemini AI processing
  +-- @whiskeysockets/baileys ----------> Persistent WhatsApp Web socket manager
  +-- jsonwebtoken ---------------------> Signature verifier for admin JWTs
  +-- dotenv ---------------------------> Dynamic environment configuration loader
```

---

## 2. ORM Database Schema Linkages

Each backend API maps directly to corresponding PostgreSQL tables managed by Drizzle ORM:

| Route Path | Principal SQL Table | Sub-Table Operations |
| :--- | :--- | :--- |
| `/api/auth/*` | `users` | Writes JWT tracking rows to `userLogs` |
| `/api/settings` | `userSettings` | Reads and updates configuration columns |
| `/api/db` | `customers`, `products`, `transactions` | Combined select inside a unified transactional loop |
| `/api/customers` | `customers` | Writes to `customers` table |
| `/api/products` | `products` | Writes to `products` table |
| `/api/transactions` | `transactions` | Writes transaction and customer balance modifications |
| `/api/stock-adjust`| `stockTransactions` | Modifies catalog totals and records adjustments |
| `/api/munim/*` | `aiCache` | Matches hashed queries against pre-saved JSON outputs |

---

## 3. Remote Third-Party Integrations & Fallbacks

To preserve core billing functions under network degradation or API rate limits, our endpoints utilize robust fallback integrations:

```
               [Incoming Lookup / Scan Request]
                              |
                     (Is Gemini Active?)
                    /                   \
               [Yes]                     [No / Rate Limited (429)]
               /                             \
     [Gemini 2.5 Flash]               (Type of Lookup Request)
     - Conversational parse           /                       \
     - Multimodal Invoice OCR    [Barcode Number]         [Product Name Text]
                                       |                           |
                            [Open Food Facts API]           [FakeStore API]
                            - Standard name matches         - Generic category price
```

1. **Google Gen AI**: Used inside `/api/munim/parse`, `/api/munim/scan-bill`, and `/api/ai/suggest-catalog` to translate unstructured language or images.
2. **Open Food Facts API**: Serves as a rate-limit fallback for product scans.
3. **FakeStore API**: Provides placeholder pricing ranges when Gemini is unavailable.
4. **WhatsApp Web Sockets (Baileys)**: Establishes a socket handshake with Meta WhatsApp systems, caching localized session configuration files in isolated user folders.

---

## 4. Internal State Routing (Strangler Pattern)

To guarantee business policy compliance (e.g. checking if a credit addition exceeds a customer's total allowed udhaar balance), critical database writes are routed through the state-driven `CommandBus`:

```
[API POST Route Request]
          |
          v
[Strangler Fig Interception]
          |
          v
[globalCommandBus.dispatch()] -----> [Policy Engine Verification]
                                                |
                                         (Policy Cleared)
                                                |
                                                v
[Projection Engine DB Writes] <----- [Event Bus Domain Events]
          |
          v
[AI Workflow Trigger (Background)]
```

- **Saga Transaction Controls**: If any intermediate stage in the Command Bus fails (e.g., policy violation), the transaction is immediately rejected before reaching the SQL database.
