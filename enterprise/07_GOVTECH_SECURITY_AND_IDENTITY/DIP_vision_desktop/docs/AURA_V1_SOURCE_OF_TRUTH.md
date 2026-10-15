# Aura v1 Platform Specification: Canonical Engineering Source of Truth

**Status:** APPROVED & CANONICAL  
**Document Version:** 1.0.0  
**Scope:** Production-grade Platform Blueprint & Operating Contracts  
**Target Milestone:** M0 through M4  

---

## 1. Executive Summary & Core Philosophy

**Aura v1** is an enterprise-grade, edge-first computer vision and evidence-grounded video search platform. It rejects over-engineered cloud microservice bloat in favor of a lean, highly resilient, and verifiable architecture designed to connect existing camera fleets, process intelligence locally on the edge, and provide hallucination-free natural language event retrieval in the cloud.

### The Canonical Platform Topologies

#### 1.1 Data Plane Topology
```text
CAMERAS (ONVIF / RTSP)
  │
  ▼
AURA EDGE MINI (Edge Appliance)
  ├─ Stream Ingest & Hardware Decode (H.264 / H.265)
  ├─ Camera Intelligence (Health, Tamper, Blur, Frame Freeze)
  ├─ Perception Runtime (Person, Vehicle, Motion, Zone Tracking)
  ├─ Local Ring Buffer (256 GB NVMe Spooling)
  ├─ Privacy Filter (Local Face/Plate Redaction)
  └─ Cryptographic Signing (Hardware Key + Hash Chain)
  │
  ▼ Secure Outbound TLS (mTLS, Zero Inbound Ports)
GCP CLOUD DATA PLANE
  ├─ aura-api (Cloud Run: Customer REST/gRPC API)
  ├─ Cloud SQL (PostgreSQL 16 + pgvector/Timescale, Row-Level Security)
  ├─ Cloud Pub/Sub (Event Spine & Job Queue)
  ├─ Cloud Storage (Archival Clips & Event Evidence)
  ├─ aura-worker (Cloud Run: Ingest, Archival & Event Processing)
  ├─ aura-ai (Cloud Run: Vision Runtime, VectorStore Abstraction & Search Ranker)
  └─ Evidence-Grounded AI Search Engine (Query Parser + Structured Filter + Reranker)
  │
  ▼
CUSTOMER DASHBOARD & INVESTIGATION UI
```

#### 1.2 Ops Control Plane Topology (Strictly Firewalled)
```text
                         AURA OPS CONTROL PLANE
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
FLEET MANAGEMENT             AI EVALUATION & LAB         TECHNICIAN NETWORK
- Edge Device Telemetry      - Sliced Accuracy Benchmarks- JIT Ephemeral Access
- OTA Staged Rollouts        - Failure Taxonomy Monitor  - Work Order Verification
- Health & Anomaly Signals   - Ground-Truth Annotation   - Cryptographic Proof
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   ▼
                       SECURITY & BREAK-GLASS
                       - Dual-Custody Approval
                       - Scoped Ephemeral Access
                       - Tamper-Evident Audit Ledger
```

---

## 2. The 20 Architectural Mandates

1. **Pragmatic GCP Cloud MVP**: No premature Kubernetes (GKE), Kafka/Redpanda, or Ceph/MinIO clusters. MVP runs entirely on **Cloud Run + Cloud Pub/Sub + Cloud Storage + Cloud SQL (PostgreSQL/pgvector) + Qdrant**. GKE and distributed streaming will only be introduced if scale telemetry justifies the operational overhead.
2. **Edge-First Workload Distribution**: Continuous video decoding, camera health evaluation, motion detection, basic object detection, and NVMe ring-buffering run on the edge. Only lightweight events, telemetry, keyframe embeddings, and requested evidence clips egress over WAN.
3. **Focused MVP Camera Interoperability**: Scope is strictly limited to ONVIF discovery, RTSP streaming, H.264/H.265 decoding, NVR multi-channel discovery, and stream health. PTZ, proprietary vendor SDKs, and advanced ONVIF controls are deferred to Phase 2.
4. **Single Edge Hardware Profile (`Aura Edge Mini`)**: 4–8 cameras, 8 GB RAM, 256 GB NVMe, x86_64 / ARM64 with optional NPU/GPU accelerator. Hardware specs must be empirically validated via pilot decoding/inference benchmarks.
5. **Model Abstraction Layer (`Aura Vision Runtime`)**: Decouples Detector, Tracker, and Embedder interfaces so underlying models can be swapped without modifying platform pipelines.
6. **Three Decoupled AI Subsystems**:
   - **Perception Subsystem**: Person, Vehicle, Object, Motion, Tracking, Multi-Zone Intrusion.
   - **Camera Intelligence Subsystem**: Blur, Brightness, Obstruction, Frame Freeze, FPS drops, Stream Quality, Tampering, Night Visibility.
   - **Semantic Intelligence Subsystem**: Keyframe & Event Embeddings, Natural Language Query Planning, Evidence Retrieval, Cross-Modal Reranking.
7. **Hallucination-Free Natural Language Video Search**:
   - LLMs are **never** permitted to watch unguided raw video.
   - Pipeline: Query $\rightarrow$ Query Parser $\rightarrow$ Structured Filters (Time/Camera/Zone/Object) $\rightarrow$ Structured Event Search + Vector Search $\rightarrow$ Evidence Ranking $\rightarrow$ Top-K Evidence Clips $\rightarrow$ LLM Context $\rightarrow$ Natural Language Answer + Clickable Evidence Clips (`"View Evidence"`).
8. **Multi-Dimensional AI Evaluation Engine**: Accuracy is never represented as a single flat mAP number. Benchmarks are sliced by Daylight vs. Low Light, Indoor vs. Outdoor, 720p vs. 1080p, Camera Model variants, Weather, and Distance tiers.
9. **Formal AI Failure Taxonomy**: Hierarchical classification for automated root cause analysis:
   - `False Positive`: Shadow, Reflection, Animal, Motion Artifact, Glare.
   - `False Negative`: Low Light, Occlusion, Blur, Small Object / Far Distance.
   - `Tracking Failure`: ID Switch, Premature Termination, Trajectory Drift.
   - `Classification Failure`: Misclassification, Scale Ambiguity.
   - `Search / Retrieval Failure`: Semantic Mismatch, Temporal Window Miss.
10. **Strict Data Plane vs. Ops Control Plane Separation**: Customer Data Plane (`aura-api`, customer events, customer video) is strictly isolated from internal Ops Control Plane (`aura-ops`, fleet management, AI Lab, technician dispatch, model deployment, failure taxonomy).
11. **Technician JIT Access Lifecycle**: Job Assignment $\rightarrow$ Time-bounded Scoped Credential $\rightarrow$ Camera Onboarding / Diagnostics $\rightarrow$ Cryptographic Installation Proof $\rightarrow$ Customer Handover $\rightarrow$ Immediate Revocation. Zero persistent customer credentials for technicians.
12. **Break-Glass Emergency Protocol**: Justified emergency ticket $\rightarrow$ Dual-approval $\rightarrow$ Time-limited ephemeral token $\rightarrow$ Strict scope restriction $\rightarrow$ Immutable audit logging $\rightarrow$ Automatic session termination.
13. **Defensible, Risk-Neutral Terminology**: Replace accusatory language ("Fraud Detected") with defensible operational indicators: "Operational Anomaly", "Risk Signal", "Repeat-installation anomaly", "Investigation Required".
14. **Cryptographically Signed Tamper Evidence**: Video Block $\rightarrow$ SHA-256 Hash $\rightarrow$ Previous Block Hash $\rightarrow$ Hardware-backed Device Signing Key (TPM) $\rightarrow$ Authenticated Network Timestamp $\rightarrow$ Cloud Audit Ledger.
15. **Empirical Disaster Recovery**: RPO 15 min and RTO 1 hr treated as design targets validated through automated backup/restore drills (Cloud SQL point-in-time recovery, Cloud Storage object versioning, edge local spooling).
16. **VectorStore Abstraction Layer**: Interface supporting `QdrantVectorStore`, `PgVectorStore`, and future `MilvusVectorStore`, shielding business logic from vendor lock-in.
17. **Pragmatic 5-Service Modular Monolith**:
   - `aura-api`: Public API, authentication, tenant management, camera registry, incident viewing.
   - `aura-worker`: Async ingest, Cloud Pub/Sub worker, clip archiving, webhook dispatcher.
   - `aura-edge`: Edge agent daemon, ONVIF discovery, RTSP ingest, local inference, buffer spooler.
   - `aura-ai`: Model inference service, embedding pipeline, query planner, evidence ranker.
   - `aura-ops`: Fleet telemetry, OTA orchestrator, technician dispatch, model evaluation, failure taxonomy dashboard.
18. **Codex Engineering Workflow & Guardrails**: Multi-agent development lifecycle with hard boundary controls preventing automated write access to production databases, master camera credentials, or unapproved model deployments.
19. **Milestone-Driven Delivery Roadmap**: M0 (Foundation), M1 (Camera & Ingest), M2 (AI Engine & Vision Runtime), M3 (Product & Search), M4 (Pilot Hardening).
20. **Business Packaging Coupled to Internal Metering**: Clean customer tiers (Starter, Business, Pro, Enterprise) backed by internal granular metering (active streams, storage GB/month, AI inference units, search queries).

---

## 3. Milestone Gate Enforcement

Engineering progression is strictly gated. Downstream milestones cannot begin until upstream acceptance tests pass completely:

```text
┌─────────────────────────────────────────────────────────────┐
│  M0: FOUNDATION                                            │
│  Monorepo, Auth, Tenant RLS, RBAC, DB Schemas, Audit Logs,   │
│  CI/CD, Secrets, Baseline Observability, Recovery Drills   │
└──────────────────────────────┬──────────────────────────────┘
                               │ MUST PASS ACCEPTANCE GATE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M1: CAMERA & INGESTION                                     │
│  Aura Edge Mini Daemon, ONVIF Discovery, RTSP Streaming,    │
│  H.264/H.265 Decoding, Camera Registry, Camera Health Check │
└──────────────────────────────┬──────────────────────────────┘
                               │ MUST PASS ACCEPTANCE GATE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M2: AI ENGINE & VISION RUNTIME                             │
│  Perception (Person/Vehicle/Tracking), Event Engine,        │
│  Evidence Clip Extractor, Sliced Evaluation Harness        │
└──────────────────────────────┬──────────────────────────────┘
                               │ MUST PASS ACCEPTANCE GATE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M3: PRODUCT & SEARCH                                       │
│  Customer Web Dashboard, Evidence-grounded NL Search,       │
│  Incident Alerts, Technician App, Ops Control Console       │
└──────────────────────────────┬──────────────────────────────┘
                               │ MUST PASS ACCEPTANCE GATE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M4: PILOT HARDENING                                        │
│  10–20 Live Customer Sites, Real Cameras & Technicians,     │
│  Empirical Latency, Cost, Sliced Accuracy & Failure Tuning  │
└─────────────────────────────────────────────────────────────┘
```
