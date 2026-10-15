# Incident Response & Disaster Recovery Manual (v1.0)

This manual provides the step-by-step procedures, runbooks, and command parameters for detecting, managing, and recovering from security incidents or infrastructure breaches on DukaanMitra (BazaarSync).

---

## 1. Incident: Compromise / Leak of API Keys

- **Severity**: **Critical**
- **Symptom**: Unauthorized token usage spikes in Google AI Studio or Firebase console, or a developer accidentally pushes the `.env` configuration file containing real API keys to a public GitHub repository.

### 1.1 Remediation Action Steps
1. **Revoke the Leaked Key**:
   Immediately open the Google Cloud Console (APIs & Services -> Credentials) and delete the compromised API key.
2. **Generate a New Key**:
   Create a fresh, unrestricted API key inside the target Google Cloud Project.
3. **Update Google Secret Manager**:
   Add a new version of the leaked secret key in Secret Manager:
   ```bash
   echo -n "NEW_SECRET_API_KEY_HERE" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
   ```
4. **Trigger a Rolling Restart**:
   Restart the Cloud Run service to force containers to fetch the latest version of the key:
   ```bash
   gcloud run services update dukaanmitra --update-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest
   ```

---

## 2. Incident: Cross-Tenant Data Disclosure Alert

- **Severity**: **Critical**
- **Symptom**: A merchant reports seeing records (e.g., customers, ledgers, or transactions) belonging to a different business.

### 2.1 Remediation Action Steps
1. **Quarantine the Service**:
   Instantly route all public traffic to a static holding page to stop further data leakage:
   ```bash
   gcloud run services update-traffic dukaanmitra --to-tags=maintenance=100
   ```
2. **Isolate Audit Logs**:
   Query Cloud Logging to identify all requests made to `/api/db` in the preceding 2 hours. Trace correlation IDs to determine if session variables were mixed:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND jsonPayload.url=\"/api/db\"" --limit=1000
   ```
3. **Verify Middleware Bindings**:
   Inspect `/src/middleware/auth.ts` and `/server.ts` to ensure `req.dbUser` is being resolved correctly from the active bearer token and is not shared globally or cached in-memory across requests.
4. **Deploy Fix & Verify**:
   Compile, lint, and deploy the corrected build to staging, run the automated tenant isolation suite, and restore production traffic once verified.

---

## 3. Incident: Bruteforce / Credential Stuffing on Login

- **Severity**: **High**
- **Symptom**: Logs show a rapid spike in unauthenticated HTTP `POST /api/settings` or Firebase registration handshakes returning HTTP 401 errors.

### 3.1 Remediation Action Steps
1. **Enable Firebase App Check**:
   Enable Firebase App Check in the Firebase Console to ensure only requests from your verified client application can query the Auth endpoints.
2. **Configure Nginx Rate Limits**:
   If the attacks bypass Firebase, update Nginx rules to rate limit incoming requests on `/api/*` endpoints:
   ```nginx
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;
   ```
3. **Monitor Client IPs**:
   Block offending IP ranges using Google Cloud Armor policies or Cloud Run security rules.

---

## Related Documents

- [Security Control Registry](./SECURITY_REGISTRY.md)
- [Platform Monitoring Blueprint](./MONITORING.md)
- [SRE Incident Runbooks](./SRE_RUNBOOK.md)
