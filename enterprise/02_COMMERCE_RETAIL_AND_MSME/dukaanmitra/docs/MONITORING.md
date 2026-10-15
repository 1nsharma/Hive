# Platform Monitoring & Observability Blueprint (v1.0)

This blueprint outlines the performance tracking systems, alerting boundaries, logging pipelines, and observability practices configured across DukaanMitra (BazaarSync).

---

## 1. Google Cloud Logging Architecture

All system outputs, container state changes, and errors write directly to standard output stream channels (`stdout` and `stderr`).

```
[ Application Logs (console.log) ]
                 |
                 v
     [ Google Cloud Logging ] ---------> Standardized log aggregation
                 |
        +--------+--------+
        |                 |
        v                 v
[ Cloud Run Metrics ]  [ SRE Alerting Alerts ]
```

- **Pino Log Integrations**: Low-level network logs (such as WhatsApp socket connections) are managed via `pino` to avoid server CPU overhead.
- **Log Retention Policy**: Log streams are kept inside Google Cloud Logging for 30 days, providing complete traces for compliance and debugging.

---

## 2. Key SRE Operational Metrics

To ensure high-performance availability for local Indian merchants, SRE teams monitor three key parameters:

### 2.1 API Response Latencies (Target: <50ms)
- **Normal Flow**: Dashboard hydration requests (`GET /api/db`) utilize a server memory cache to resolve queries in under **5ms**.
- **Calculated Threshold**: Standard database reads requiring cold calls to Cloud SQL target a p95 latency of under **45ms**.
- **Generative Flows**: Multimodal invoice scans (`POST /api/munim/scan-bill`) require 3 to 5 seconds due to model inference cycles.

### 2.2 Token-Consumption Monitoring
- **Optimization Target**: Over **60%** of duplicate natural language requests should hit the local hashed `ai_cache` database table, resulting in $0.00 token expenses and sub-5ms latencies.
- **Alert Trigger**: If cache hit rates drop below **30%**, SRE alerts are triggered to audit user input modifications and verify hashing algorithms.

### 2.3 System Error Budgets (Target: 99.9% Availability)
- **Error Budget Policy**: Total allowable failed connections or unhandled server exceptions is capped at **0.1%** per month.
- **Circuit Breakers**: If PostgreSQL experiences high latency or connection drops, the application active pool drops new attempts instantly, serving mock templates to prevent system lockups.

---

## 3. SRE Incident Alerting Thresholds

Alert notifications are automatically dispatched to on-call engineers under these conditions:

| Alert Metric | Condition | Severity | On-Call SLA |
| :--- | :--- | :---: | :--- |
| **Container Crashes** | Memory utilization > 90% | Critical | Instant (Page Team) |
| **Service Outages** | HTTP 500 error count > 1% in 5 min | Critical | Instant (Page Team) |
| **API Latency Spikes** | p99 latency > 2000ms for standard API | Warning | 12 Hours |
| **Quota Depletion** | Gemini API rate limits (HTTP 429) > 5% | Warning | Next Business Day |

---

## 4. Operational Telemetry and Tracing

- **Local Development Debugging**: Running `npm run dev` prints beautiful, readable console logs capturing incoming requests, database execution speeds, and AI model results.
- **Container Audit Logs**: Requests are stamped with a unique correlation identifier (`X-Correlation-ID`) in the header, letting SRE teams trace transaction errors from front-end actions through database updates.
