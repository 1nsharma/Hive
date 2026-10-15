# Model Registry

**Section:** 05. AI  
**Status:** ✅ Completed  
**Owner:** Chief AI Architect  
**Last updated:** 2026-07-25  

---

## Purpose

This document registries all active artificial intelligence models integrated with DukaanMitra (MitraOS), detailing fallback mechanisms and api metrics.

---

## 1. Active Model Specifications

| Module / Service ID | Active Model Name | Provider | Pricing / Token Class | Context Window |
| :--- | :--- | :---: | :---: | :---: |
| `munim-parser` | `gemini-2.5-flash` | Google Cloud / GenAI | Low-latency Flash | 1M Tokens |
| `ocr-vision` | `gemini-2.5-flash` | Google Cloud / GenAI | Low-latency Flash | 1M Tokens |
| `catalog-creator` | `gemini-2.5-flash` | Google Cloud / GenAI | Low-latency Flash | 1M Tokens |
| `pricing-guru` | `gemini-2.5-flash` | Google Cloud / GenAI | Low-latency Flash | 1M Tokens |
| `onboard-profiler` | `gemini-2.5-flash` | Google Cloud / GenAI | Low-latency Flash | 1M Tokens |

---

## 2. Upstream Upgrades Roadmap

- **Basic Dialogue Operations**: Recommended upgrade is `'gemini-3.6-flash'` (high reasoning density, ultra-low latencies).
- **Tax Auditing & Calculations**: Recommended model is `'gemini-3.1-pro-preview'` for advanced multi-variable arithmetic.
- **Voice Integrations**: Designed to integrate with `'gemini-3.1-flash-live-preview'` to stream PCM audio back and forth.

---

## Related Documents

- [AI Architecture](./AI-Architecture.md)
- [Prompt Library](./Prompt-Library.md)
- [Guardrails](./Guardrails.md)
