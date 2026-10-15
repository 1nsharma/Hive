# Guardrails & Content Alignment

**Section:** 05. AI  
**Status:** ✅ Completed  
**Owner:** Chief AI Architect  
**Last updated:** 2026-07-25  

---

## Purpose

This document outlines the safety guardrails, prompt injection defenses, privacy protection systems, and alignment rules configured across DukaanMitra AI.

---

## 1. Prompt Injection Protection
To prevent malicious user inputs from hijacking system prompts or retrieving cross-tenant ledger databases:
- **Strict Response Schema Guards**: Enforce explicit JSON schemas using the SDK's `responseSchema` parameters. The model is forced to output structured schemas, discarding plain text instructions.
- **Isolated System Instructions**: All critical accountant personality rules and contextual lists are written directly inside `systemInstruction` configurations, keeping them separated from conversational query strings.

---

## 2. Privacy & Demographic Protection
To secure customer and shop data from leaks:
- **Dynamic Context Scope**: The server isolates customer lists and inventory rows dynamically per-request, using authenticated session user IDs (`userId`).
- **Anonymization Hashing**: Cryptographic hashing (SHA-256) is applied to individual metrics, coordinates, and system lookups, shielding personal identifiers from being logged in plain text.

---

## Related Documents

- [AI Architecture](./AI-Architecture.md)
- [Model Registry](./Model-Registry.md)
- [Prompt Library](./Prompt-Library.md)
