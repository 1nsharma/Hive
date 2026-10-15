# Aura v1: M0 Codex Execution Guide & Task Specifications

**Milestone:** M0 — Foundation & Multi-Tenant Core  
**Document Status:** CANONICAL & CODEX-EXECUTABLE  
**Target Engine:** Codex Builder / Autonomous Engineering Agents  
**Gate Status:** STRICT PRE-REQUISITE FOR M1 (Camera & Ingestion)  

---

## 0. Codex Directive & Inviolable Guardrails

> [!CAUTION]
> ### INVIOLABLE DIRECTIVE FOR CODEX BUILDER
> You are commissioned to build **M0 Foundation ONLY**. 
> - **DO NOT** import, scaffold, or reference RTSP, ONVIF, FFmpeg, GStreamer, WebRTC, OpenCV, YOLO, RT-DETR, PyTorch, TensorFlow, CLIP, SigLIP, Qdrant, Milvus, or camera streaming packages.
> - **DO NOT** create camera discovery daemons, edge agent loops, or video processing pipelines.
> - **DO NOT** script automated cloud deployment pipelines to live production infrastructure.
> 
> *Any pull request or commit containing camera or video code will trigger an immediate build failure and rejection.*

---

## 1. M0 Execution Sequence Overview

Codex must implement the 10 tasks strictly in order. Each task depends on the artifacts of previous tasks and has its own automated verification criteria:

```text
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-01: Repository Bootstrap & Common Packages         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-02: PostgreSQL 16 Schema, Migrations & RLS Engine  │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-03: Authentication, Session Rotation & TOTP MFA    │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-04: Organizations & Locations Domain Management    │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-05: RBAC Engine & Database RLS Middleware          │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-06: Cryptographically Chained Audit Ledger Service │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-07: REST API Contracts & Request Envelopes         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-08: Secrets Schema Validation & Log Redaction      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-09: Observability, Tracing & Health Probes         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  M0-TASK-10: CI/CD Pipeline & M0 Acceptance Gate Suite      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
                      [ M0 GATE PASS / FAIL ]
```

---

## 2. Detailed Task Specifications

---

### M0-TASK-01: Repository Bootstrap & Common Packages

#### 1. Goal
Establish the monorepo skeleton, root build configuration, shared error taxonomy, structured JSON logger with PII sanitization, and request context primitives.

#### 2. Target Files
- `go.mod` (Go 1.22+, module path `github.com/aura-vision/aura`)
- `Makefile` (targets: `build`, `test`, `test-coverage`, `lint`, `migrate-up`, `migrate-down`, `docker-dev`)
- `.golangci.yml` (strict lint rules: errcheck, gosec, staticcheck, revive)
- `packages/common/errors/errors.go` (Domain errors with HTTP status mapping)
- `packages/common/logger/logger.go` (Zero-allocation structured JSON logger with secret redaction)
- `packages/common/ctxkeys/ctxkeys.go` (Context keys for TraceID, TenantID, UserID, Roles)

#### 3. Code Specifications & Types
```go
// packages/common/errors/errors.go
package errors

type ErrorCode string

const (
    ErrUnauthorized      ErrorCode = "UNAUTHORIZED"
    ErrForbidden         ErrorCode = "FORBIDDEN"
    ErrNotFound          ErrorCode = "NOT_FOUND"
    ErrTenantViolation   ErrorCode = "TENANT_VIOLATION"
    ErrValidation        ErrorCode = "VALIDATION_FAILED"
    ErrInternal          ErrorCode = "INTERNAL_ERROR"
)

type AppError struct {
    Code       ErrorCode `json:"code"`
    Message    string    `json:"message"`
    HTTPStatus int       `json:"-"`
    Details    any       `json:"details,omitempty"`
}
```

```go
// packages/common/logger/logger.go
// Must regex-redact keys matching: (?i)(password|secret|token|authorization|cookie|jwt|key|cred)
func SanitizeFields(key string, val any) any
```

#### 4. Verification Test
- **Test File:** `packages/common/logger/logger_test.go`
- **Assertion:** Passing `{"password": "plain_secret_123", "token": "ey..."}` to logger produces `{"password":"[REDACTED]","token":"[REDACTED]"}`. Zero secret leakage.

---

### M0-TASK-02: PostgreSQL 16 Schema, Migrations & RLS Engine

#### 1. Goal
Implement versioned PostgreSQL schema migrations and Row-Level Security (RLS) policies guaranteeing cryptographic multi-tenant isolation at the database layer.

#### 2. Target Files
- `deploy/migrations/000001_initial_schema.up.sql`
- `deploy/migrations/000001_initial_schema.down.sql`
- `deploy/migrations/000002_rls_policies.up.sql`
- `deploy/migrations/000002_rls_policies.down.sql`
- `packages/database/postgres.go` (pgxpool connection pool with health checking and tenant session variable injection)
- `services/aura-api/tests/integration/migration_test.go` (Automated Up $\rightarrow$ Down $\rightarrow$ Up migration verification)

#### 3. Execution Requirements
- All tenant tables (`locations`, `users`, `user_roles`, `sessions`, `audit_events`) must have an `organization_id UUID NOT NULL` column.
- Enable RLS on every tenant table: `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;`.
- RLS policy must evaluate:
  ```sql
  organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
  OR current_setting('app.is_super_admin', true) = 'true'
  ```
- Database client must provide `WithTenant(ctx, orgID, fn)` which executes queries inside a transaction with:
  ```sql
  SET LOCAL app.current_organization_id = '<org_id>';
  ```

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/integration/rls_test.go`
- **Assertions:**
  1. Insert record for Org A.
  2. Query `SELECT * FROM locations` under Org B context $\rightarrow$ returns 0 records.
  3. Attempt `INSERT INTO locations (organization_id, ...) VALUES (Org_A_ID, ...)` under Org B context $\rightarrow$ returns SQL RLS policy violation error.

---

### M0-TASK-03: Authentication, Session Rotation & TOTP MFA

#### 1. Goal
Implement enterprise authentication using Argon2id password hashing, RS256/HS256 signed JWT access tokens (15m expiry), opaque refresh tokens with cryptographic rotation, session revocation, and TOTP-based MFA.

#### 2. Target Files
- `packages/common/crypto/password.go` (Argon2id hash & verify with salt)
- `services/aura-api/internal/auth/jwt.go` (Sign and parse JWT with tenant claims)
- `services/aura-api/internal/auth/session_service.go` (Session storage, rotation, family revocation)
- `services/aura-api/internal/auth/totp.go` (TOTP generation and RFC 6238 validation)
- `services/aura-api/internal/auth/handlers.go` (`/login`, `/refresh`, `/logout`, `/mfa/setup`, `/mfa/verify`)

#### 3. Security Rules
- Refresh tokens must be stored in PostgreSQL as `SHA-256(token)`. Never store raw refresh tokens in the database.
- Refresh Token Rotation: Each use generates a new refresh token and invalidates the previous one.
- **Family Revocation:** If an invalidated refresh token is presented again (indicating token theft), immediately invalidate all active sessions belonging to that user session family.

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/unit/auth_test.go`
- **Assertions:**
  1. Valid credentials return `access_token` and `refresh_token`.
  2. `/refresh` with valid token returns new pair; old token immediately fails.
  3. Replaying the old refresh token revokes all user sessions and returns `401 Unauthorized`.
  4. Passwords in database match Argon2id hash format; zero plaintext.

---

### M0-TASK-04: Organizations & Locations Domain Management

#### 1. Goal
Implement the core organizational hierarchy and physical site/location domain services.

#### 2. Target Files
- `services/aura-api/internal/organizations/model.go`
- `services/aura-api/internal/organizations/repository.go`
- `services/aura-api/internal/organizations/service.go`
- `services/aura-api/internal/organizations/handlers.go`
- `services/aura-api/internal/locations/model.go`
- `services/aura-api/internal/locations/repository.go`
- `services/aura-api/internal/locations/service.go`
- `services/aura-api/internal/locations/handlers.go`

#### 3. Business Constraints
- Organization slugs must be unique, lowercase alphanumeric with hyphens (regex: `^[a-z0-9]+(-[a-z0-9]+)*$`).
- Locations must belong to exactly one organization and enforce IANA timezone validation (e.g. `America/New_York`, `UTC`, `Asia/Kolkata`).

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/unit/organizations_test.go`
- **Assertions:**
  1. Duplicate slug creation returns `409 Conflict`.
  2. Invalid timezone string returns `400 Bad Request`.

---

### M0-TASK-05: RBAC Engine & Database RLS Middleware

#### 1. Goal
Implement role-permission resolution, HTTP authorization middleware, and automated PostgreSQL tenant context injection.

#### 2. Target Files
- `packages/common/rbac/evaluator.go` (Role to permission resolver)
- `services/aura-api/internal/middleware/auth.go` (JWT verification & context population)
- `services/aura-api/internal/middleware/tenant.go` (Injects `app.current_organization_id` into DB transaction)
- `services/aura-api/internal/middleware/rbac.go` (`RequirePermission(perm string)` HTTP middleware)

#### 3. Evaluation Logic
```go
func (e *Evaluator) HasPermission(userRoles []string, requiredPerm string) bool {
    // 1. SUPER_ADMIN has global wildcard
    if slices.Contains(userRoles, "SUPER_ADMIN") {
        return true
    }
    // 2. Resolve cached permissions for roles
    for _, role := range userRoles {
        if permissions, ok := e.roleMap[role]; ok {
            if slices.Contains(permissions, requiredPerm) {
                return true
            }
        }
    }
    return false
}
```

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/integration/rbac_middleware_test.go`
- **Assertions:**
  1. `CUSTOMER_USER` attempting `POST /api/v1/users/invite` receives `403 Forbidden`.
  2. `ORG_ADMIN` attempting `POST /api/v1/users/invite` succeeds (`201 Created`).
  3. `SUPER_ADMIN` accessing internal ops endpoint succeeds.

---

### M0-TASK-06: Cryptographically Chained Audit Ledger Service

#### 1. Goal
Implement an append-only, tamper-evident audit ledger that cryptographically links every privileged event to its predecessor using SHA-256 hash chaining.

#### 2. Target Files
- `packages/common/crypto/audit_hash.go` (Canonical payload serializer and SHA-256 chain calculator)
- `services/aura-api/internal/audit/model.go`
- `services/aura-api/internal/audit/repository.go`
- `services/aura-api/internal/audit/service.go`
- `services/aura-api/internal/audit/verifier.go` (Background integrity checker)

#### 3. Chaining Formula
$$\text{CanonicalString} = \text{prev\_hash} \parallel \text{seq} \parallel \text{org\_id} \parallel \text{timestamp} \parallel \text{actor\_id} \parallel \text{action} \parallel \text{resource\_type} \parallel \text{resource\_id} \parallel \text{status} \parallel \text{SHA256(context\_json)}$$

$$\text{event\_hash} = \text{SHA256}(\text{CanonicalString})$$

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/integration/audit_chain_test.go`
- **Assertions:**
  1. Create 5 audit events $\rightarrow$ verify all 5 hashes link consecutively.
  2. Directly mutate `context_json` or `actor_id` of event #3 in database via raw SQL.
  3. Run `verifier.VerifyChain()` $\rightarrow$ immediately flags sequence #3 and #4 as corrupted.

---

### M0-TASK-07: REST API Contracts & Request Envelopes

#### 1. Goal
Expose standardized REST APIs with unified JSON response envelopes, correlation IDs, and input validation.

#### 2. Target Files
- `services/aura-api/internal/api/router.go`
- `services/aura-api/internal/api/response.go` (Standard `{ "data": ..., "meta": ..., "error": ... }` envelopes)
- `services/aura-api/cmd/server/main.go` (HTTP server bootstrap with graceful shutdown)

#### 3. Standard JSON Response Formats
- **Success:**
```json
{
  "data": { ... },
  "meta": {
    "correlation_id": "req-18a7b93c-2341",
    "timestamp": "2026-09-20T23:30:00Z"
  }
}
```
- **Error:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "User lacks required permission: user:invite",
    "correlation_id": "req-18a7b93c-2341"
  }
}
```

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/integration/api_envelope_test.go`
- **Assertion:** All 4xx and 5xx responses return well-formed error envelopes with matching `X-Correlation-ID` header.

---

### M0-TASK-08: Secrets Schema Validation & Log Redaction

#### 1. Goal
Enforce zero-credentials policy at application startup and guarantee no sensitive headers, tokens, or passwords leak into logs or error payloads.

#### 2. Target Files
- `packages/common/config/config.go` (Strict environment parser, e.g. using `kelseyhightower/envconfig`)
- `services/aura-api/internal/middleware/sanitize.go` (Stripping sensitive HTTP headers and query params before logging)

#### 3. Validation Logic
- If any required variable (`DATABASE_URL`, `JWT_SIGNING_KEY`, `APP_ENV`) is unset, the process must terminate immediately with exit code 1.
- Log sanitizer must redact `Authorization: Bearer ...`, `Cookie: ...`, and JSON keys matching secret patterns.

#### 4. Verification Test
- **Test File:** `packages/common/config/config_test.go`
- **Assertions:**
  1. Starting app without `DATABASE_URL` triggers immediate validation error.
  2. Logging an incoming request with `Authorization: Bearer secret-token` produces `Authorization: [REDACTED]`.

---

### M0-TASK-09: Observability, Tracing & Health Probes

#### 1. Goal
Implement OpenTelemetry distributed trace propagation, Prometheus metrics instrumentation, and Kubernetes/Cloud Run health and readiness endpoints.

#### 2. Target Files
- `packages/common/telemetry/tracer.go` (OpenTelemetry W3C trace context extractor/injector)
- `packages/common/telemetry/metrics.go` (Prometheus metrics registry)
- `services/aura-api/internal/api/health.go` (`/healthz`, `/readyz`, `/metrics`)

#### 3. Health Probe Specifications
- `GET /healthz` (Liveness): Returns `200 OK` as long as the HTTP listener is responsive.
- `GET /readyz` (Readiness): Pings the PostgreSQL connection pool. If pool is exhausted or database is down, returns `503 Service Unavailable`.
- `GET /metrics`: Returns standard Prometheus text format containing:
  - `http_requests_total{method, path, status}`
  - `http_request_duration_seconds_bucket`
  - `db_pool_connections{state="active|idle|max"}`
  - `auth_failures_total`

#### 4. Verification Test
- **Test File:** `services/aura-api/tests/integration/health_test.go`
- **Assertions:**
  1. Under normal conditions, `/readyz` returns 200.
  2. Disconnect database pool $\rightarrow$ `/readyz` returns 503.

---

### M0-TASK-10: CI/CD Pipeline & M0 Acceptance Gate Suite

#### 1. Goal
Package all linting, security scans, migration tests, and acceptance criteria into an automated GitHub Actions pipeline and local developer compose harness.

#### 2. Target Files
- `.github/workflows/ci.yml`
- `deploy/docker/docker-compose.dev.yml` (Postgres 16 Alpine + healthcheck)
- `scripts/verify-m0-gate.sh` (or `.ps1` on Windows) — Single executable script running the entire verification suite.

#### 3. Acceptance Criteria Checklist Enforced by CI
```text
✓ 1. Linter & Static Analysis passes with 0 warnings.
✓ 2. Secret Scanner (TruffleHog / Gitleaks) passes with 0 detected leaks.
✓ 3. Database migrations execute UP -> DOWN -> UP with 0 errors.
✓ 4. Unit & Integration test suite passes 100%.
✓ 5. Overall code coverage is >= 85%.
✓ 6. Multi-tenant RLS isolation test verifies 0 cross-tenant data leakage.
✓ 7. Tamper-evident audit chain verification detects manual DB edits.
✓ 8. Zero camera, RTSP, ONVIF, or video dependencies in go.mod / code.
```

---

## 3. M0 Gate Pass Protocol

When Task 10 succeeds and all CI checks turn green:
1. Codex generates an automated `M0_VERIFICATION_REPORT.md` documenting test coverage, benchmark results, and RLS validation logs.
2. Engineering Lead / Human Approver signs off.
3. **Only then is M1 (Camera & Ingestion) unlocked for development.**
