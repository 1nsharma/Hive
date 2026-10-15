# Infrastructure Map & Deployment Blueprint (v1.0)

This document diagrams the container topology, network ingress configurations, reverse proxy layers, and cloud run deployment paths for DukaanMitra (BazaarSync).

---

## 1. Container Topology & Network Ingress

```
               +-----------------------------------+
               |      Internet (Public Client)     |
               +-----------------+-----------------+
                                 |
                                 v [HTTPS Traffic]
               +-----------------+-----------------+
               |    Nginx Reverse Proxy Gateway    |
               +-----------------+-----------------+
                                 |
                                 v [Port 3000 Ingress Routing]
               +-----------------+-----------------+
               |       Cloud Run Container         |
               |                                   |
               |   +---------------------------+   |
               |   |     Express Server        |   |
               |   |   - Node.js (V8 Runtime)  |   |
               |   |   - Port: 3000 (Host: 0.0) |   |
               |   +-------------+-------------+   |
               |                 |                 |
               |                 v                 |
               |   +-------------+-------------+   |
               |   |    Drizzle Query Builder  |   |
               |   +-------------+-------------+   |
               +-----------------+-----------------+
                                 |
            +--------------------+--------------------+
            v                                         v
+-----------+-----------+                 +-----------+-----------+
|  Cloud SQL PostgreSQL |                 |     Firebase Auth     |
+-----------------------+                 +-----------------------+
```

- **Port Routing Constraint**: The hosting infrastructure strictly enforces Port `3000` as the ONLY externally accessible channel. The Express server binds to host `0.0.0.0` and port `3000` to satisfy ingress routing rules.
- **Production Compilation**: Production builds compile the server TS entry point into a single, bundled CommonJS file (`dist/server.cjs`) using `esbuild`. This bypasses module-resolution checks and significantly accelerates container startup latency.

---

## 2. Environment Configuration Matrix

Operational parameters are documented and maintained in `.env.example`:

| Key Name | Security Level | Purpose |
| :--- | :---: | :--- |
| `PORT` | Public | Standard container port (Default: `3000`) |
| `GEMINI_API_KEY` | Private (Secret) | Binds to Google Vertex AI/Gemini endpoints |
| `DATABASE_URL` | Private (Secret) | Cloud SQL PostgreSQL connection string |
| `JWT_SECRET` | Private (Secret) | Cryptographic signature seed for admin session JWTs |
| `ADMIN_EMAILS` | Public Config | Whitelisted email addresses authorized for SSH verification |

---

## 3. Observability & Recovery Framework

### 3.1 Logging Structure
- Backend logging uses structured stdout outputs.
- WhatsApp message pipelines stream telemetry logs via `pino` for low-footprint performance.
- Conversational transaction actions are recorded directly in the SQL `user_logs` and `market_research` tables, creating comprehensive business audit chains.

### 3.2 Resilience & Self-Healing
- **Gemini Rate Limit Fallbacks**: If an upstream model returns `429 Resource Exhausted`, API endpoints seamlessly capture the failure, route requests to lightweight Open Food Facts/FakeStore REST endpoints, and serve structured mock records so transaction flows never halt.
- **Connection Retry Policy**: If PostgreSQL connections suffer transient drops, the Drizzle adapter instance is configured with auto-retry limits to keep the host process alive.
