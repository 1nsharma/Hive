# Cloud Infrastructure Mapping

**Section:** 15. Infrastructure  
**Status:** ✅ Completed  
**Owner:** Permanent Chief Cloud Architect  
**Last updated:** 2026-07-25  

---

## Purpose

This document outlines the cloud infrastructure resources, regional bindings, and architectural properties of DukaanMitra (BazaarSync) on Google Cloud.

---

## Content

DukaanMitra is hosted in containerized micro-monolith layout on **Google Cloud Run** with high-speed data Persistence layers:

1. **Cloud Run Container Execution**: Deployed in the `asia-southeast1` region with scale-to-zero settings to eliminate off-hours compute costs.
2. **Cloud SQL PostgreSQL Database**: Persists sales, products, and customer registers safely with automated 7-day backup cycles.
3. **Firebase Services**: Authenticates merchants via Phone OTP and verifies incoming tokens via standard middlewares.

For complete, detailed topology diagrams, environment configuration keys, and deployment pipelines, reference the master files:
- [Cloud Architecture Blueprint](../CLOUD_ARCHITECTURE.md)
- [Infrastructure Resource Registry](../INFRASTRUCTURE_REGISTRY.md)
- [Deployment & Operations Guide](../DEPLOYMENT_GUIDE.md)

---

## Related Documents

- [Cloud Architecture Blueprint](../CLOUD_ARCHITECTURE.md)
- [Infrastructure Resource Registry](../INFRASTRUCTURE_REGISTRY.md)
- [Deployment & Operations Guide](../DEPLOYMENT_GUIDE.md)
