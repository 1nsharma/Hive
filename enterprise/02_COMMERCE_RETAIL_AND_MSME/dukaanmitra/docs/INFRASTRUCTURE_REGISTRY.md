# Infrastructure & Resource Registry (v1.0)

This registry records the configurations, hardware profiles, networking parameters, and access credentials of the infrastructure resources powering DukaanMitra (BazaarSync).

---

## 1. Google Cloud Run (Container Service)

The unified React SPA and Express backend runs containerized on Google Cloud Run:

- **Instance Regional Allocation**: `asia-southeast1` (Singapore) to ensure sub-100ms latencies for Indian local merchants.
- **CPU Allocation**: 1 vCPU (allocated on-demand during requests).
- **Memory Allocation**: 1 GB RAM (scales dynamically to support multimodal scanner file uploads up to 50MB).
- **Concurrency Cap**: Up to 80 simultaneous requests per container instance prior to auto-scaling triggers.
- **Auto-Scaling Parameters**:
  - Minimum Instances: `0` (scales down to zero during closed shop hours to eliminate idle server charges).
  - Maximum Instances: `10` (safeguards against high-frequency DDoS attempts or API runaways).
- **Timeout Limit**: 300 seconds (safeguards long-running AI voice streams or batch bulk contact imports).

---

## 2. Google Cloud SQL (Managed Database)

Transactional persistence is managed via an enterprise-tier Google Cloud SQL instance:

- **Database Engine**: PostgreSQL v15
- **Hardware Tier**: `db-f1-micro` (Developer Sandbox tier) scalable up to custom high-availability instances in production.
- **Storage Profile**: SSD (Solid State Drives) with auto-increase enabled. Initial storage size is 10 GB.
- **Connection Model**: Public IP restricted via SSL/TLS certificates and whitelisted Authorized Networks, or accessed securely via VPC Serverless Connectors.
- **Automated Backups**: Enabled. Daily automated backups are retained for 7 days with Point-in-Time Recovery (PITR) active to support instant database rollbacks to any second.

---

## 3. Firebase Authentication & Security Services

Security profiles and login gateways are managed via Firebase Auth:

- **Auth Providers**: SMS One-Time Password (OTP) verification and Google Single Sign-On (SSO).
- **Platform Access**: Managed via the standard Web SDK on the frontend and validated server-side using the `firebase-admin` SDK.
- **Session Lifetimes**: Standard ID tokens expire after 1 hour, refreshing automatically behind the scenes via Firebase SDK client logic.

---

## 4. Google Secret Manager Allocation

Sensitive keys and connection tokens are kept out of GitHub repositories by storing them securely inside Google Secret Manager:

| Secret Name | Referenced Key | Accessing Service | Security Policy |
| :--- | :--- | :--- | :--- |
| **`DATABASE_URL`** | Postgres DB connection URI | Cloud Run Container | Read-only access bound to the container's service account. |
| **`GEMINI_API_KEY`** | Google AI Studio Key | Cloud Run Container | Read-only access bound to the container's service account. |
| **`JWT_SECRET`** | Admin JWT signing secret | Cloud Run Container | Read-only access bound to the container's service account. |

---

## 5. Container Networking & Ingress Rules

To protect database endpoints and secure user connection sessions:
- **HTTPS Enforcement**: All incoming HTTP traffic is permanently redirected to HTTPS at the Nginx reverse-proxy gateway layer.
- **CORS Constraints**: Cross-Origin Resource Sharing is locked to the platform's active subdomains. External requests lacking valid session JWTs or Firebase tokens are discarded instantly.
- **Port Ingress Binding**: The Express server.ts listens on host `0.0.0.0` and port `3000`, matching Google Cloud Run's default routing ingress rules.
