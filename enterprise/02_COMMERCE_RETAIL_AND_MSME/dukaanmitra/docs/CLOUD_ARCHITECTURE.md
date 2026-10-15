# Google Cloud Platform & Server Architecture Blueprint (v1.0)

This blueprint documents the production-grade deployment architecture, service dependencies, runtime environments, and networking models of DukaanMitra (BazaarSync) on Google Cloud Platform.

---

## 1. Google Cloud Architecture Map

DukaanMitra utilizes a fully serverless, highly scalable, and secure micro-monolith layout hosted on **Google Cloud**.

```
                       [ Public Users / Merchants ]
                                     |
                                     v [HTTPS Ingress]
                      +------------------------------+
                      |      Nginx Reverse Proxy     |
                      |    (Port 3000 Routing Layer) |
                      +--------------+---------------+
                                     |
                                     v [Port 3000 Ingress]
                      +--------------+---------------+
                      |       Google Cloud Run       |
                      |   - Node.js Runtime (V8)     |
                      |   - Containerized App Engine |
                      |   - Auto-scales: 0 to N      |
                      +-------+--------------+-------+
                              |              |
         +--------------------+              +--------------------+
         | (Private Network)                 | (IAM Service Acc)  |
         v                                   v                    v
+--------+-----------+              +--------+----------+  +------+------------+
|  Cloud SQL (Postgres)|            | Firebase Auth &   |  |   Gemini 2.5      |
|  - Managed Server  |              | Firestore SDK     |  |   Flash API       |
|  - Pool: max_conns |              +-------------------+  +-------------------+
+--------------------+
```

- **Execution Ingress (Port 3000 Rule)**: The Cloud Run execution environment is fronted by an Nginx ingress layer that routes public requests to port `3000`. The containerized server binds to host `0.0.0.0` and port `3000` to satisfy this entry routing pattern.
- **Node.js Production Bundle**: To minimize cold start latencies, production builds compile the TypeScript codebase into a unified, lightweight, self-contained CommonJS file (`dist/server.cjs`) using `esbuild`.

---

## 2. Infrastructure Registry & Service Status

The following is the audit status of all Google Cloud and platform services:

| GCP / Platform Service | Configuration Scope | Integration Status | Role / Purpose |
| :--- | :--- | :---: | :--- |
| **`Cloud Run`** | Serverless Container | **Implemented** | Hosts the backend Express and compiled React SPA resources. |
| **`Cloud SQL`** | PostgreSQL DB Instance | **Implemented** | High-durability transaction storage for customers, products, and ledgers. |
| **`Firebase Auth`** | Client Auth SDK | **Implemented** | End-user (shopkeeper) secure login and phone registration. |
| **`Firebase Admin`** | Server Auth Verification| **Implemented** | Validates incoming user tokens on the proxy middleware. |
| **`Secret Manager`** | Secret Credentials Env | **Implemented** | Stores `DATABASE_URL`, `GEMINI_API_KEY`, and `JWT_SECRET` keys. |
| **`Gemini API`** | `@google/genai` Client | **Implemented** | Drives Digital Munim speech parsing and multimodal invoice scanning. |
| **`Cloud Logging`** | Stdout Log Routing | **Implemented** | Captures application trace streams, audit lines, and server crashes. |
| **`Cloud Storage`** | File/Image Storage | **Future Ready**| Intended for long-term wholesaler invoice PDF backups. |
| **`Cloud Build`** | Container Compilation | **Configured** | Compiles docker images using custom `Dockerfile`. |

---

## 3. Deployment Pipeline & Build Controls

The system's DevOps lifecycle is automated to ensure consistent and reproducible environments:

```
[ Git Push / Dev Server Boot ]
              |
              v
[ Dependency Verification ] ---------> Runs `npm run lint` (TypeScript verification)
              |
              v
[ esbuild Bundle Compile ] ----------> Compiles TS into `dist/server.cjs`
              |
              v
[ Container Packaging ] -------------> Packages build files via unified Dockerfile
              |
              v
[ Google Cloud Run Deploy ] ---------> Deploys revision to Cloud Run serverless engine
```

### 3.1 Build Output Optimization
The compilation command `npm run build` triggers dual compilation pipelines:
1. **Frontend Asset Build**: `vite build` translates React sources into compressed, cache-friendly static files located inside `dist/`.
2. **Backend Server Bundle**: `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs` compiles the server entry point into a standalone production file. This eliminates node module-resolution overhead, resulting in rapid cold-starts.

---

## 4. Environment Separation Matrix

To ensure that testing and validation actions do not compromise production ledgers:

| Environment | Host URL / Ingress | DB Binding | Secret Allocation |
| :--- | :--- | :--- | :--- |
| **Development** | Localhost Port 3000 | Dev SQLite / PG | Sandbox/Local `.env` secrets |
| **Staging/Preview**| `ais-pre-...run.app` | Preview PostgreSQL | Staging Secret Manager values |
| **Production** | `ais-dev-...run.app` | Production PostgreSQL| Production Secret Manager values |

---

## 5. Reliability & Disaster Recovery (SRE)

- **Database Connection Pool**: The database pool adapter handles transient network failures by employing custom wait-and-retry connections.
- **AI Rate Limit Resiliency**: If Gemini Vertex limits are met (`429`), endpoints automatically cascade requests to lightweight public lookups (`Open Food Facts` & `FakeStore API`) to keep POS sales terminals unblocked.
- **State Preservation**: In the event of network disruption, client-side browsers preserve local state within sandboxed LocalStorage configurations, re-synchronizing with PostgreSQL upon connection restoration.
