# Platform Observability Architecture (v1.0)

This document details the tracking models, logging structures, error-monitoring practices, and KPIs configured to observe DukaanMitra (BazaarSync) in real-time.

---

## 1. Structured Logging System

To support automated analysis and tracing, DukaanMitra uses a standardized JSON-based console logging system:

```json
{
  "timestamp": "2026-07-25T21:40:00.000Z",
  "level": "error",
  "correlationId": "tx_9a8b7c6d5e",
  "userId": "usr_42",
  "path": "/api/munim/parse",
  "message": "AI Studio parsing failed due to network timeout",
  "error": {
    "name": "APIError",
    "status": 504,
    "stack": "..."
  }
}
```

- **Correlation ID Tracking**: Every request generates an `X-Correlation-ID` header. If an error occurs, this ID links the API trace, the DB query log, and the client UI error modal together.
- **Low-overhead logging**: Standard requests write logs to the container `stdout` stream, which is processed by GCP Logging without slowing down the core Express event loop.

---

## 2. Key Performance Indicators (KPIs)

DukaanMitra tracks three primary categories of metrics to optimize both merchant workflows and platform operations:

### 2.1 System Performance KPIs
- **Static Asset Load Speed**: Target `<1.5s` for first meaningful paint (FMP) on local mobile networks.
- **API Response Speeds**: Target p95 `<50ms` for core data routes, and `<5ms` for memory-cached endpoints.
- **DB Connection Latency**: Target `<15ms` for PostgreSQL transaction block executions.

### 2.2 Artificial Intelligence (AI) KPIs
- **Cache Hit Rate**: Monitor percentage of requests answered by the hashed `ai_cache` table. Target `>60%`.
- **Inference Time**: Target p50 `<3s` for conversational Digital Munim parsing, and `<5s` for OCR scanners.
- **Failure Ratio**: Cap Gemini API rate failures (HTTP 429) at `<2%` using exponential backoffs.

### 2.3 Merchant Business KPIs
- **Daily active billing users (DAUs)**: Tracks active transaction logs per merchant space.
- **Offline Guest Conversion**: Number of guest sandbox sessions that successfully convert to cloud-synced accounts.
- **Average Bill Processing Time**: Speed from clicking "Scan Bill" to rendering the completed ledger draft.

---

## 3. Alerts & Incident Routing

Alert thresholds trigger Slack, Email, or PagerDuty schedules dynamically based on incident severity:

| Alert Scenario | Trigger Threshold | Target Action | SLA |
| :--- | :--- | :--- | :--- |
| **P1 Outage** | Container availability drops < 95% over 2 min | SRE PagerDuty paging | 15 Min |
| **P2 Degradation** | HTTP 500 error counts > 2% of total traffic | Slack channel alert | 1 Hour |
| **Quota Cap** | Gemini API rate limits (429) > 10 occurrences | Cloud console dashboard log | Next Day |

---

## 4. Health Checks

To support Cloud Run load-balancer health checks and automated service restarts:
- **Liveness Endpoint**: `GET /api/health` returns HTTP 200 `{"status": "ok"}` when the Express container is active.
- **Readiness Endpoint**: `GET /api/health/ready` actively pings the PostgreSQL connection pool to confirm that database transactions are functional before accepting ingress traffic.
