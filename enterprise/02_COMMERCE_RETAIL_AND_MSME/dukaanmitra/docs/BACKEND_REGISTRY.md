# Backend Service & Architecture Registry (v1.0)

This registry catalogs the primary backend entry points, server bootstrapping configs, middleware hierarchies, and API endpoints running within the DukaanMitra (BazaarSync) distributed runtime.

---

## 1. Core Server & Boostrapping

### 1.1 Express App Host (`/server.ts`)
- **Purpose**: Establishes the primary REST routing gateway and hosts static front-end assets in production. Integrates the Vite developer middleware for live module updates under sandbox mode.
- **Dependencies**: `express`, `vite`, `dotenv`, `@google/genai`, `drizzle-orm`.
- **Consumers**: Native Node container runtime execution (`npm run start`).
- **Production Status**: **Production Ready** (Equipped with dynamic compression, high payload limits, and isolated error catches).

### 1.2 MitraOS Strangler Gateway (`src/os-core/strangler-gateway.ts`)
- **Purpose**: Implements the Strangler Fig pattern. Intercepts database transaction requests and safely diverts traffic away from raw SQL insert loops, routing them through the state-driven `CommandBus` to guarantee business policy compliance.
- **Dependencies**: `globalCommandBus` instance.
- **Consumers**: POST API routers (`/api/transactions`, `/api/customers`).
- **Status**: **Production Ready**.

---

## 2. API Endpoints Directory

### 2.1 Unified State Hydration Engine (`GET /api/db`)
- **Purpose**: Gathers and maps related tables (`customers`, `products`, `transactions`) in a single DB transaction. Implements an in-memory server cache to minimize active database load.
- **Dependencies**: `drizzle-orm` query engine, Express request parameters.
- **Caching**: 60-second in-memory TTL with manual validation purging on write-mutations.
- **Status**: **Production Ready**.

### 2.2 OCR Scan & Invoice Analyzer (`POST /api/munim/scan-bill`)
- **Purpose**: Accepts base64 invoice images and executes high-fidelity multimodal entity extraction. Returns a structured JSON schema mapping products, price points, and unit sizes.
- **Dependencies**: `@google/genai` (Gemini Flash), `crypto` MD5 hashing algorithms.
- **Status**: **Production Ready** (Equipped with Open Food Facts API fallback logic during Gemini quota exhaustion).

### 2.3 Natural Language Parser (`POST /api/munim/parse`)
- **Purpose**: Parses unstructured conversational Hinglish/Hindi speech queries into programmatic billing actions.
- **Dependencies**: Gemini LLM structure-matching parameters.
- **Status**: **Production Ready** (Uses `ai_cache` to ensure sub-millisecond retrieval speeds for matching prompts).

### 2.4 Secure SSH Token Exchange (`POST /api/auth/verify-ssh`)
- **Purpose**: Issues cryptographically signed 7-day JWT tokens to verified platform founders, allowing direct access to administration dashboards.
- **Dependencies**: `jsonwebtoken`, `process.env.ADMIN_EMAILS` validation arrays.
- **Status**: **Production Ready**.

### 2.5 WhatsApp Socket Manager (`src/whatsapp/index.ts`)
- **Purpose**: Governs persistent socket handshakes with the Meta WhatsApp Web backend using mobile authentication keys.
- **Dependencies**: `@whiskeysockets/baileys`, `qrcode`, Node.js filesystem modules.
- **Status**: **Production Ready** (Supports isolated tenant credential directories and multi-file connection states).
