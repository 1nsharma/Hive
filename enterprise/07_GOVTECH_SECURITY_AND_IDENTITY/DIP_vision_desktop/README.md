# Aura Vision Platform (Aura v1)

> **Enterprise-Grade, Edge-First Computer Vision & Evidence-Grounded Video Search Platform**

---

## 📌 Engineering Status & Canonical Source of Truth

This repository is governed by the **Aura v1 Canonical Platform Specification**. All architectural proposals, pull requests, and AI/Codex builder tasks must strictly conform to these engineering contracts.

### Canonical Documentation Suite
* **Platform Architecture & Source of Truth:** [docs/AURA_V1_SOURCE_OF_TRUTH.md](docs/AURA_V1_SOURCE_OF_TRUTH.md)  
  *Covers the 20 strategic mandates, 5-service modular monolith, edge-first dataflow, decoupled AI subsystems, and operational boundary models.*
* **Executable M0 Implementation Specification:** [docs/M0_IMPLEMENTATION_SPEC.md](docs/M0_IMPLEMENTATION_SPEC.md)  
  *Contains exact PostgreSQL 16 schemas, Row-Level Security (RLS) policies, RBAC permission matrix, OpenAPI contracts, and cryptographic audit chaining.*
* **Codex M0 Task Breakdown & Acceptance Guide:** [docs/M0_CODEX_EXECUTION_GUIDE.md](docs/M0_CODEX_EXECUTION_GUIDE.md)  
  *Task-by-task execution guide for autonomous engineering agents covering the 10 sequential tasks, target files, code specs, and test assertions.*

---

## 🏛 Platform Topology at a Glance

### Data Plane Flow
```text
CAMERAS (ONVIF / RTSP)
  │
  ▼
AURA EDGE MINI (Appliance)
  ├─ Hardware Decode (H.264 / H.265)
  ├─ Camera Intelligence (Health, Tampering, Blur, Quality)
  ├─ Perception Runtime (Person, Vehicle, Motion, Tracking)
  ├─ Local Ring Buffer (256 GB NVMe)
  ├─ Privacy Filter (Local Face/Plate Masking)
  └─ Hardware-Backed Signing (TPM + Hash Chain)
  │
  ▼ Outbound mTLS (Zero Inbound Ports)
GCP DATA PLANE
  ├─ aura-api (Cloud Run: REST & gRPC APIs)
  ├─ Cloud SQL (PostgreSQL 16 + pgvector/Timescale, Row-Level Security)
  ├─ Cloud Pub/Sub (Event Spine)
  ├─ Cloud Storage (Archival Clips & Event Evidence)
  ├─ aura-worker (Cloud Run: Ingest & Event Processing)
  ├─ aura-ai (Cloud Run: Vision Runtime & VectorStore Abstraction)
  └─ Evidence-Grounded Search (Query Parser + Structured Filter + Reranker)
  │
  ▼
CUSTOMER WEB & INVESTIGATION UI
```

### Ops Control Plane (Strictly Isolated)
```text
                       AURA OPS CONTROL PLANE
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
FLEET MANAGEMENT           AI EVALUATION LAB           TECHNICIAN NETWORK
- Edge Telemetry & OTA     - Sliced Accuracy Metrics   - JIT Ephemeral Access
- Remote Diagnostics       - Failure Taxonomy Monitor  - Work Order Verification
     │                           │                           │
     └───────────────────────────┼───────────────────────────┘
                                 ▼
                     SECURITY & BREAK-GLASS
                     - Dual-Custody Approval
                     - Scoped Ephemeral Access
                     - Tamper-Evident Audit Ledger
```

---

## 🚦 Milestone Gate Sequence (M0 to M4)

Engineering progression strictly adheres to sequential milestone gates. Downstream capabilities are **forbidden** from being implemented until upstream gates pass 100% of automated verification tests:

| Milestone | Focus Area | Gate Status | Anti-Goals / Constraints |
| :--- | :--- | :--- | :--- |
| **M0** | **Foundation** | **ACTIVE MILESTONE** | **NO video streaming, NO camera drivers, NO ML models, NO live prod deploy** |
| **M1** | **Camera & Ingest** | LOCKED (Awaiting M0) | Focus only on ONVIF/RTSP, Aura Edge Mini daemon, and camera health |
| **M2** | **AI Vision Runtime** | LOCKED (Awaiting M1) | Perception models, tracking, event engine, sliced evaluation harness |
| **M3** | **Product & Search** | LOCKED (Awaiting M2) | Customer dashboard, evidence-grounded NL search, alerts, technician app |
| **M4** | **Pilot Hardening** | LOCKED (Awaiting M3) | 10–20 real customer locations, live technicians, cost & latency tuning |

---

## 🎯 Active Execution Directive: Build M0 Only

Codex and engineering agents must focus exclusively on **M0 Foundation**:
1. Multi-tenant database schema with PostgreSQL Row-Level Security (RLS).
2. Authentication (JWT, secure refresh token rotation, TOTP MFA).
3. RBAC permission evaluator and middleware.
4. Cryptographically chained tamper-evident audit ledger (`audit_events`).
5. OpenTelemetry tracing, structured JSON logging with automatic PII/credential masking.
6. CI/CD test harness enforcing >85% test coverage and migration rollbacks.

Refer to [docs/M0_IMPLEMENTATION_SPEC.md](docs/M0_IMPLEMENTATION_SPEC.md) for step-by-step task execution.
