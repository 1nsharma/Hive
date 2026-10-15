# Architecture Decision Records (ADR)

**Version:** 1.0.0  
**Last Updated:** Phase 0 Audit  
**Status:** Active Development

---

## Overview

This document tracks significant architectural decisions made during PetJanu's development. Each decision is recorded with context, options considered, and consequences.

---

## ADR-001: Dual Database Strategy (Supabase + Firebase)

**Date:** 2026-08-11  
**Status:** Accepted (with concerns)  
**Deciders:** Architect Agent, Data Agent

### Context

The project requires both structured relational data (users, pets, orders) and real-time features (live sync, offline support). The team evaluated using a single database vs. multiple specialized databases.

### Decision

Use **Supabase PostgreSQL** as the primary database for structured data and **Firebase Firestore** for real-time features and caching.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Supabase only | Single source of truth, simpler ops | Limited real-time capabilities |
| Firebase only | Excellent real-time, offline support | Complex queries, higher cost at scale |
| **Both (chosen)** | Best of both worlds | Complexity, potential consistency issues |

### Consequences

**Positive:**
- Optimal query performance for relational data
- Real-time sync for critical features
- Offline resilience via LocalStorage fallback

**Negative:**
- Increased operational complexity
- Potential data consistency challenges
- Higher infrastructure costs

### Migration Path

If consolidation becomes necessary:
1. Move all data to Supabase
2. Implement polling/websockets for real-time needs
3. Use Supabase Realtime subscriptions

---

## ADR-002: Vercel as Primary Hosting Platform

**Date:** 2026-08-11  
**Status:** Accepted  
**Deciders:** DevOps Agent, Architect Agent

### Context

The application needs reliable hosting with global CDN, serverless functions, and easy deployment workflows.

### Decision

Deploy frontend and serverless APIs on **Vercel**, with Cloud Run as backup option.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Vercel | Zero-config deployments, edge network | Vendor lock-in, cost at scale |
| AWS/GCP | Full control, cost optimization | Higher operational overhead |
| **Vercel (chosen)** | Developer experience, performance | Pricing tiers |

### Consequences

**Positive:**
- Instant deployments from Git
- Automatic SSL and CDN
- Serverless function support

**Negative:**
- Limited customization of build process
- Cost increases with traffic

---

## ADR-003: React 19 with TypeScript

**Date:** 2026-08-11  
**Status:** Accepted  
**Deciders:** Frontend Agent, Architect Agent

### Context

The frontend framework choice impacts developer productivity, performance, and maintainability.

### Decision

Use **React 19** with **TypeScript** for type-safe component development.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| React 19 + TS | Type safety, ecosystem, hiring pool | Build complexity |
| Vue/Svelte | Simpler learning curve | Smaller ecosystem |
| Next.js | SSR, routing built-in | Heavier bundle |

### Consequences

**Positive:**
- Strong typing reduces runtime errors
- Large talent pool
- Excellent tooling support

**Negative:**
- TypeScript configuration complexity
- Longer initial setup time

---

## ADR-004: Razorpay for Payment Processing

**Date:** 2026-08-11  
**Status:** Accepted  
**Deciders:** Backend Agent, Security Agent, PM Agent

### Context

Indian market requires local payment gateway with UPI, cards, and wallets support plus GST compliance.

### Decision

Integrate **Razorpay** for all payment processing with webhook verification.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Razorpay | India-focused, UPI support, GST invoices | India-only initially |
| Stripe | Global, excellent DX | Limited India support |
| Paytm | Popular in India | Developer experience concerns |

### Consequences

**Positive:**
- Full Indian payment method coverage
- RBI compliant
- Built-in GST invoicing

**Negative:**
- Requires webhook security implementation
- Regional limitation for global expansion

---

## ADR-005: Google Gemini AI for Health Triage

**Date:** 2026-08-11  
**Status:** Accepted  
**Deciders:** Backend Agent, Architect Agent

### Context

The AI health assistant needs accurate veterinary guidance with appropriate guardrails.

### Decision

Use **Google Gemini 3.6 Flash** API with server-side proxy for key protection.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Gemini | Fast, cost-effective, good accuracy | API dependency |
| GPT-4 | Higher accuracy | More expensive |
| Self-hosted LLM | Full control | Infrastructure overhead |

### Consequences

**Positive:**
- Cost-effective for high-volume queries
- Fast response times
- Good balance of accuracy/speed

**Negative:**
- External API dependency
- Rate limiting considerations
- Token usage tracking required

---

## ADR-006: In-Memory Observability Console

**Date:** 2026-08-11  
**Status:** Accepted (temporary)  
**Deciders:** Backend Agent, DevOps Agent

### Context

CTO dashboard needed for monitoring system health during development and early production.

### Decision

Implement **in-memory stores** in `server.ts` for audit logs, event queues, and metrics with plan to migrate to persistent storage.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| In-memory | Simple, fast, no dependencies | Data loss on restart |
| Database-backed | Persistent, queryable | Additional complexity |
| External service | Feature-rich | Cost, integration effort |

### Consequences

**Positive:**
- Immediate observability without setup
- Zero additional infrastructure
- Fast implementation

**Negative:**
- **Data resets on server restart** (known issue)
- Not suitable for production long-term
- Must migrate before launch

**TODO:** Migrate to database-backed storage in Sprint 3.

---

## ADR-007: Phone Masking for Privacy

**Date:** 2026-08-11  
**Status:** Accepted  
**Deciders:** Security Agent, PM Agent

### Context

Lost pet finders need to contact owners without exposing personal phone numbers publicly.

### Decision

Implement **masked phone relay** system where finder calls go through a proxy number.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Full masking | Maximum privacy | Implementation complexity |
| Partial display | Simpler | Privacy concerns |
| In-app chat only | No phone exposure | Requires app download |

### Consequences

**Positive:**
- Protects user privacy
- Reduces spam/harassment risk
- Complies with DPDP Act requirements

**Negative:**
- Requires telephony integration
- Additional cost for relay service

---

## ADR-008: LocalStorage Fallback Strategy

**Date:** 2026-08-11  
**Status:** Accepted  
**Deciders:** Frontend Agent, Data Agent

### Context

Application must remain functional when database connections fail or are unavailable.

### Decision

Use **LocalStorage** as client-side fallback with automatic sync when connection restored.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| LocalStorage | Simple, works offline | Limited capacity, not synced |
| IndexedDB | Larger capacity | More complex API |
| Service Worker cache | Automatic | Limited to HTTP responses |

### Consequences

**Positive:**
- Graceful degradation
- Works in low-connectivity areas
- Simple implementation

**Negative:**
- Data may become stale
- Sync conflicts possible
- Limited to string storage

---

## Pending Decisions

### ADR-PENDING-001: WhatsApp Business API Provider

**Status:** Under Review  
**Options:** Twilio, Meta Direct, Gupshup  
**Deadline:** Sprint 2 start

### ADR-PENDING-002: Error Tracking Service

**Status:** Under Review  
**Options:** Sentry, LogRocket, Datadog  
**Deadline:** Sprint 4 start

### ADR-PENDING-003: Email Service Provider

**Status:** Under Review  
**Options:** SendGrid, Postmark, SES  
**Deadline:** Sprint 2 start

---

## Decision Template

```markdown
### ADR-XXX: [Title]

**Date:** YYYY-MM-DD  
**Status:** [Proposed | Accepted | Deprecated | Superseded]  
**Deciders:** [List of agents]

### Context

[What is the issue that we're trying to resolve?]

### Decision

[What is the change that we're proposing?]

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| ... | ... | ... |

### Consequences

**Positive:**
- ...

**Negative:**
- ...

### References

- [Link to related issues]
- [Link to documentation]
```

---

**Document Owner:** Architect Agent  
**Review Cycle:** Per-decision basis  
**Next Review:** When new architectural decisions arise
