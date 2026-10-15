# SRE Runbook & Incident Response Manual (v1.0)

This runbook documents step-by-step procedures for diagnosing and mitigating operational incidents, database bottlenecks, and API disruptions on DukaanMitra (BazaarSync).

---

## 1. Incident: Database Connection Exhaustion

- **Symptoms**:
  - Web interface shows "Please wait while application starts..." or HTTP 504 Gateway Timeouts.
  - Express server logs report: `Error: Connect timeout exceeded` or `Pool connections exhausted`.
- **Root Cause**: The Cloud Run container instance scale-up has exhausted the available PostgreSQL connection pool limits of the `db-f1-micro` database tier.

### 1.1 Mitigation Procedure
1. **View Active PostgreSQL Connections**:
   Log into the Google Cloud SQL Console, select your database, and view the active connections graph.
2. **Increase Connection Pool Sizes**:
   If the container scaling count is high, reduce the pool parameters in `.env`:
   ```env
   # Reduce pool connection limit per container instance
   DATABASE_URL="postgres://...&max=10"
   ```
3. **Configure Connection Pooling**:
   For high-volume production, ensure that a serverless VPC connector and **pgBouncer** are allocated to manage connection multiplexing.

---

## 2. Incident: Upstream AI Service Rate-Limiting (HTTP 429)

- **Symptoms**:
  - Conversational digital Munim outputs fallback to static text.
  - Logs report: `[Gemini API Error] 429 Resource Exhausted` or `Quota exceeded for model`.
- **Root Cause**: High billing activity has exhausted the standard developer token limits of your Gemini API Key.

### 2.1 Mitigation Procedure
1. **Check Cache Hits**:
   Confirm that the `ai_cache` table is functioning. Check the `user_logs` or query `aiCache` directly to ensure queries are resolving through cached hashes where possible.
2. **Verify Cascading Fallbacks**:
   Verify that pricing and catalog lookups are falling back to `Open Food Facts` and `FakeStore API` smoothly. The terminal remains operational under rate limits.
3. **Upgrade API Quotas**:
   Log into the Google AI Studio Console or Google Cloud Vertex AI Console and request a quota limit increase.

---

## 3. Incident: Cloud Run Container Memory Exhaustion

- **Symptoms**:
  - Container crashes with: `Memory limit exceeded (OOM)`.
  - Logs report: `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.
- **Root Cause**: High volume image scanning (wholesaler bill uploads up to 50MB) has exhausted the allocated container memory limits.

### 3.1 Mitigation Procedure
1. **Increase Container Memory Limit**:
   Scale container memory limits from 1GB to 2GB or 4GB via Google Cloud Console or using the following CLI command:
   ```bash
   gcloud run deploy dukaanmitra --image gcr.io/[PROJECT_ID]/dukaanmitra --memory 2Gi
   ```
2. **Optimize Garbage Collection**:
   Add Node garbage collection flag arguments to your container start script inside `package.json`:
   ```json
   "start": "node --max-old-space-size=1536 dist/server.cjs"
   ```

---

## 4. Incident: Recovery from a Corrupted Deployment

- **Symptoms**:
  - Front-end shows compilation errors or white blank screens after container updates.
  - Server logs fail on boot with syntax errors.

### 4.1 Rollback Procedure
1. **Identify Previous Stable Revision**:
   Open Google Cloud Run Console, select your service, and click on the **Revisions** tab to identify the last working deployment identifier.
2. **Route Traffic Back to Last Working Revision**:
   Instantly route 100% of incoming production traffic back to the stable revision:
   ```bash
   gcloud run services update-traffic dukaanmitra --to-revisions=dukaanmitra-[PREVIOUS_STABLE_REV]=100
   ```
3. **Re-run Local Linter & Tests**:
   Locally, run compiler checks to identify and resolve the syntax errors:
   ```bash
   npm run lint && npm run build
   ```
