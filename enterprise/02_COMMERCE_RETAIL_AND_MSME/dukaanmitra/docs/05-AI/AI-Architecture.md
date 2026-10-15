# AI System Architecture

**Section:** 05. AI  
**Status:** ✅ Completed  
**Owner:** Chief AI Architect  
**Last updated:** 2026-07-25  

---

## Purpose

This document outlines the architectural patterns, integration pipelines, and component relationships of the DukaanMitra AI platform (MitraOS). It describes how stateless, high-performance generative models are integrated with real-time merchant ledger and inventory systems.

---

## 1. Context-Based Stateless LLM Execution

To run efficiently on Google Cloud Run containers, MitraOS employs a stateless context-injected request pipeline. Rather than holding expensive, in-memory sessions that complicate scalability, the server collects active context per-request:

```
[Client Input] -> [Express Server] -> [Query DB for Active Context] -> [Inject Context into System Instruction] -> [Call Gemini API]
```

This context comprises:
- **Active Customers List**: Maps spoken names to existing customer identifiers.
- **Active Product SKUs**: Facilitates accurate inventory and stock mapping.
- **Merchant Style Configurations**: Adapts tone of voice, greeting vocabulary, and tax compliance level to the shopkeeper's localized expectations.

---

## 2. High-Speed Hashed Caching Engine (`ai_cache`)

Generative operations utilize a PostgreSQL-backed cache table (`ai_cache`) to completely bypass remote Vertex AI/Google Gen AI calls for identical inputs:

- **Hash Generation**:
  - Conversational requests (`/api/munim/parse`) generate an MD5 checksum of the lowercase, trimmed search string.
  - OCR scans (`/api/munim/scan-bill`) generate a SHA-256 checksum of the base64 image data.
- **Cache Hit Pathway**: Sub-millisecond read times are achieved, returning identical structured JSON payloads directly from PostgreSQL while keeping Google Gen AI token budgets at $0.00.

---

## 3. Rate-Limit Resilience & public API Fallbacks

To handle standard API quota restrictions, all generative calls implement automatic cascading fallback pathways:

1. **Active Gemini Call**: Requests are first dispatched to Gemini 2.5 Flash.
2. **Quota Check (`isRateLimit`)**: If HTTP 429 is encountered, the route interceptor catches the exception.
3. **External API Failover**:
   - Barcode Lookups fallback to query the **Open Food Facts API** by barcode identifier.
   - Text Lookups fallback to search the **FakeStore API** with calculated rupee adjustments (`USD * 80`).
4. **Mock Synthesis Safeguard**: If remote resources are completely unreachable, the system compiles a structurally valid placeholder output based on the input string to keep checkout counters active.

---

## Related Documents

- [Model Registry](./Model-Registry.md)
- [Prompt Library](./Prompt-Library.md)
- [Guardrails](./Guardrails.md)
