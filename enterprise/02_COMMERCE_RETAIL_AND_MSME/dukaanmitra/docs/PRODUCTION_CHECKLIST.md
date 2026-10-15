# Production Readiness Checklist (v1.0)

This checklist provides the final quality gates, pre-flight checks, and post-deployment validations needed to transition DukaanMitra (BazaarSync) safely to a live production environment.

---

## 1. Pre-Deployment Quality Gates (Build & Configuration)

Before committing a code build to the master branch or deploying a release image to Google Artifact Registry:

- [ ] **Lint Verification**: Core linter checks must compile without typescript or syntax errors (`npm run lint`).
- [ ] **Security Dependency Check**: Scan node packages for known vulnerabilities (`npm audit`).
- [ ] **Environment Variable Alignment**: Confirm that `.env.example` lists all new keys and that they are securely stored inside Google Secret Manager (not in the code base).
- [ ] **Vite Asset Bundler Check**: Ensure static React assets are minified inside the `/dist` directory (`npm run build`).

---

## 2. Infrastructure Pre-Flight Checks (Google Cloud & Firebase)

Before routing active merchant traffic to the production cluster:

- [ ] **Cloud SQL Pool Cap**: Set the maximum pool size to allow 50 concurrent merchant databases connections per container instance.
- [ ] **Firebase Authentication Origin limits**: Restrict valid auth callback origins in the Firebase dashboard to only allow production subdomains.
- [ ] **Scale-to-Zero Limits**: Confirm scale-to-zero is active on non-essential dev containers, and that production contains a minimum of 1 active warm instance to prevent startup lag.
- [ ] **Secret Access Policy**: Confirm the custom Service Account `dukaanmitra-cloud-run` is bound to the containers with Least Privilege roles.

---

## 3. Post-Deployment Live Verification (Smoke Tests)

Once the container is live and traffic allocation is restored, the QA lead executes the following verification loop:

1. **Service Liveness Check**: Ping `https://[PROD_URL]/api/health` to confirm the server returns HTTP 200.
2. **Database Connectivity Verification**: Ping `https://[PROD_URL]/api/health/ready` to ensure the container can execute queries against PostgreSQL.
3. **Session Verification**: Complete a test user signup using SMS OTP, verify JWT retrieval, and confirm the user record is written to the database.
4. **Billing Ledger Smoke Test**: Enter a test ledger entry ("Sanjay 500 Milk") and verify it is correctly categorized and saved to the user's dashboard.
