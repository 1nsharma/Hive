# Milestone 0 (M0) Executable Implementation Specification

**Milestone:** M0 — Foundation & Secure Multi-Tenant Core  
**Document Status:** CANONICAL & EXECUTABLE  
**Target Engine:** Codex Builder / Engineering Team  
**Gate Status:** BLOCKS M1 (Camera & Ingestion)  

---

## 1. Milestone Objective & Anti-Goals

### 1.1 Objective
Construct the production-ready foundational layer for Aura v1. At the conclusion of M0, the platform must provide multi-tenant isolation, cryptographic audit trails, zero-trust role-based access control (RBAC), structured observability, and automated CI/CD validation.

### 1.2 Strict Anti-Goals (Forbidden in M0)
> [!CAUTION]
> **DO NOT IMPLEMENT ANY OF THE FOLLOWING IN M0:**
> - Video stream ingestion, RTSP/ONVIF parsing, or camera discovery.
> - Edge agent runtimes, hardware bindings, or device daemon protocols.
> - Machine learning models, inference workers, or vector databases (Qdrant/Milvus).
> - Video playback, streaming proxies, or WebRTC pipelines.
> - Production deployment to live cloud infrastructure.
> 
> *Any code submitted during M0 containing video processing or camera streaming will fail acceptance review.*

---

## 2. Monorepo Repository Structure

The platform uses a standardized, modular monorepo structure designed for clean separation of concerns:

```text
aura/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Automated lint, test, security & migration gate
│       └── pr-audit.yml              # Code review & schema validation
├── deploy/
│   ├── docker/
│   │   ├── Dockerfile.api            # Multi-stage production container for aura-api
│   │   ├── Dockerfile.worker         # Multi-stage container for aura-worker
│   │   └── docker-compose.dev.yml    # Local dev: Postgres 16, pgvector, Redis, Pub/Sub mock
│   └── migrations/
│       ├── 000001_initial_schema.up.sql
│       ├── 000001_initial_schema.down.sql
│       ├── 000002_rls_policies.up.sql
│       └── 000002_rls_policies.down.sql
├── packages/
│   ├── common/                       # Shared platform primitives
│   │   ├── config/                   # Strongly typed environment schema validation
│   │   ├── crypto/                   # SHA-256 hash chaining, password hashing (Argon2id)
│   │   ├── errors/                   # Domain error types & HTTP status code mapping
│   │   ├── logger/                   # Zero-alloc structured JSON logger with PII masking
│   │   ├── rbac/                     # Role & permission evaluator
│   │   └── telemetry/                # OpenTelemetry tracer & metric definitions
│   └── database/                     # DB connection pool & transaction manager
├── services/
│   ├── aura-api/                     # Primary Customer & Admin REST/gRPC API
│   │   ├── cmd/server/main.go        # Service entrypoint
│   │   ├── internal/
│   │   │   ├── auth/                 # JWT, refresh token rotation, MFA/TOTP
│   │   │   ├── organizations/        # Organization & location management
│   │   │   ├── users/                # User management & invitations
│   │   │   ├── audit/                # Audit event ingestion & verification
│   │   │   └── middleware/           # Auth, Tenant Context, RLS, RateLimit, TraceID
│   │   └── tests/
│   │       ├── unit/                 # Pure unit tests
│   │       └── integration/          # Multi-tenancy RLS & API integration tests
│   └── aura-worker/                  # Background worker skeleton (M0 minimal)
│       └── cmd/worker/main.go
├── go.mod / package.json / Makefile
├── .golangci.yml / .eslintrc.json
└── README.md
```

---

## 3. PostgreSQL 16 Schema & Row-Level Security (RLS)

### 3.1 Migration `000001_initial_schema.up.sql`

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_DELETE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Physical Locations / Sites under an Organization
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_locations_org ON locations(organization_id);

-- System Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INVITED', 'SUSPENDED', 'DEACTIVATED')),
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_email UNIQUE(organization_id, email)
);
CREATE INDEX idx_users_org ON users(organization_id);

-- Standard RBAC Permissions
CREATE TABLE permissions (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'org:read', 'user:invite', 'audit:read'
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL
);

-- Standard Platform Roles
CREATE TABLE roles (
    id VARCHAR(64) PRIMARY KEY, -- 'SUPER_ADMIN', 'ORG_ADMIN', 'LOCATION_ADMIN', 'CUSTOMER_USER', 'SUPPORT_AGENT', 'TECHNICIAN', 'AUDITOR'
    is_system_role BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT NOT NULL
);

-- Role to Permission Mapping
CREATE TABLE role_permissions (
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User Role Assignment (Scoped to Org or optional Location)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_role_scope UNIQUE(user_id, organization_id, role_id, location_id)
);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- Active User Sessions & Refresh Tokens
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(64) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token_hash);

-- Cryptographically Chained Audit Ledger
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_number BIGSERIAL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_type VARCHAR(32) NOT NULL CHECK (actor_type IN ('USER', 'SERVICE', 'SYSTEM', 'ANONYMOUS')),
    actor_id VARCHAR(255) NOT NULL,
    actor_email VARCHAR(255),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE', 'DENIED')),
    ip_address INET,
    user_agent TEXT,
    correlation_id VARCHAR(128) NOT NULL,
    context_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_event_hash VARCHAR(64) NOT NULL,
    event_hash VARCHAR(64) NOT NULL,
    CONSTRAINT uq_audit_seq UNIQUE(sequence_number)
);
CREATE INDEX idx_audit_org_time ON audit_events(organization_id, timestamp_utc DESC);
CREATE INDEX idx_audit_resource ON audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_correlation ON audit_events(correlation_id);
```

### 3.2 Migration `000002_rls_policies.up.sql` (Row-Level Security)

Row-Level Security ensures that tenant isolation is enforced at the database engine level, preventing any cross-tenant data leakage even if application code omits `WHERE organization_id = ...`.

```sql
-- Enable RLS on Tenant-bound Tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- 1. Locations Policy
CREATE POLICY tenant_isolation_locations ON locations
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    )
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 2. Users Policy
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    )
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 3. User Roles Policy
CREATE POLICY tenant_isolation_user_roles ON user_roles
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 4. Sessions Policy
CREATE POLICY tenant_isolation_sessions ON sessions
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 5. Audit Events Policy (Tenants can read their own logs; only service role can insert)
CREATE POLICY tenant_isolation_audit_read ON audit_events
    FOR SELECT
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

CREATE POLICY tenant_isolation_audit_insert ON audit_events
    FOR INSERT
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );
```

---

## 4. RBAC Matrix & Permission Model

### 4.1 Permission Registry

| Permission Code | Category | Description |
| :--- | :--- | :--- |
| `org:read` | Organization | View organization profile and settings |
| `org:write` | Organization | Update organization name, billing, and settings |
| `location:create` | Location | Provision new site or physical branch |
| `location:read` | Location | View locations and site details |
| `location:update` | Location | Edit location parameters and timezone |
| `location:delete` | Location | Decommission site |
| `user:invite` | Identity | Invite new team members |
| `user:read` | Identity | List and view tenant users |
| `user:update_roles` | Identity | Assign or revoke roles for users |
| `user:deactivate` | Identity | Suspend or deactivate user access |
| `audit:read` | Compliance | Query tamper-evident audit logs |
| `support:access` | Ops | Ephemeral customer support view |
| `system:manage` | Ops Control | Internal SuperAdmin platform operations |

### 4.2 Role-to-Permission Mapping

```text
SUPER_ADMIN (Internal Ops Control Plane Only)
└── ALL PERMISSIONS + system:manage + RLS Bypass

ORG_ADMIN (Tenant Root)
├── org:read, org:write
├── location:create, location:read, location:update, location:delete
├── user:invite, user:read, user:update_roles, user:deactivate
└── audit:read

LOCATION_ADMIN (Site Manager)
├── org:read
├── location:read, location:update
├── user:read
└── audit:read (Scoped to location)

CUSTOMER_USER (Standard Operator)
├── org:read
└── location:read

SUPPORT_AGENT (Ephemeral Support Ticket)
├── org:read
├── location:read
└── user:read (Masked PII)

AUDITOR (Compliance Officer)
├── org:read
├── location:read
├── user:read
└── audit:read (Full tenant ledger)

TECHNICIAN (Field Installer - JIT Only)
└── INACTIVE by default in M0. Unlocked in M1/M3 via explicit work order.
```

---

## 5. API Contracts & Specifications

### 5.1 Authentication Flow

#### `POST /api/v1/auth/login`
Authenticates a user and returns an access token, refresh token, and tenant context.

- **Request Body:**
```json
{
  "email": "admin@enterprise.com",
  "password": "SecurePassword123!",
  "mfa_code": "123456" // Optional unless MFA enabled
}
```

- **Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "rt_8f3a9b2c1d0e4f5a6b7c8d9e...",
  "expires_in": 900,
  "token_type": "Bearer",
  "user": {
    "id": "c1f7b0f6-9f82-4f01-9f93-9c593457a445",
    "email": "admin@enterprise.com",
    "full_name": "Jane Doe",
    "organization_id": "018f2d50-7a31-7e89-a567-890123456789",
    "roles": ["ORG_ADMIN"]
  }
}
```

#### `POST /api/v1/auth/refresh`
Rotates the refresh token and returns a new short-lived access token.

- **Request Body:**
```json
{
  "refresh_token": "rt_8f3a9b2c1d0e4f5a6b7c8d9e..."
}
```
- **Response (200 OK):** Returns new `access_token` and rotated `refresh_token`. Old refresh token is immediately invalidated.

#### `POST /api/v1/auth/logout`
Revokes the session and marks the refresh token hash as revoked in the database.

---

### 5.2 Organizations & Locations

#### `GET /api/v1/organizations/me`
Retrieves the tenant profile for the authenticated user's organization.

#### `POST /api/v1/locations`
Provisions a new physical site within the organization.
- **Request Body:**
```json
{
  "name": "Headquarters - Building A",
  "address": "100 Innovation Way, Austin, TX",
  "timezone": "America/Chicago"
}
```

#### `GET /api/v1/locations`
Lists all sites belonging to the tenant (enforced by RLS).

---

### 5.3 Tamper-Evident Audit Ledger

#### `GET /api/v1/audit-events`
Queries the tenant's immutable audit log.

- **Query Parameters:**
  - `start_time` (RFC3339)
  - `end_time` (RFC3339)
  - `actor_id` (optional UUID)
  - `resource_type` (optional string)
  - `limit` (default 50, max 200)
  - `cursor` (pagination cursor)

- **Response (200 OK):**
```json
{
  "events": [
    {
      "id": "7a31f82d-1144-48f5-9ab2-8173491823ab",
      "sequence_number": 1042,
      "timestamp_utc": "2026-09-20T23:25:00Z",
      "actor_type": "USER",
      "actor_id": "c1f7b0f6-9f82-4f01-9f93-9c593457a445",
      "actor_email": "admin@enterprise.com",
      "action": "USER_ROLE_ASSIGNED",
      "resource_type": "USER",
      "resource_id": "893b1234-9f82-4f01-9f93-9c593457a111",
      "status": "SUCCESS",
      "ip_address": "198.51.100.24",
      "correlation_id": "trace-8f921a-3341",
      "context": {
        "assigned_role": "LOCATION_ADMIN",
        "location_id": "018f2d50-7a31-7e89-a567-890123456789"
      },
      "prev_event_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "event_hash": "a4b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1"
    }
  ],
  "next_cursor": "1041"
}
```

---

## 6. Cryptographic Audit Hash-Chaining Formula

Every audit event is cryptographically linked to its predecessor, guaranteeing tamper-evidence:

$$\text{CanonicalString} = \text{prev\_hash} \parallel \text{seq} \parallel \text{org\_id} \parallel \text{timestamp} \parallel \text{actor\_id} \parallel \text{action} \parallel \text{resource\_type} \parallel \text{resource\_id} \parallel \text{status} \parallel \text{SHA256(context\_json)}$$

$$\text{event\_hash} = \text{SHA256}(\text{CanonicalString})$$

If an attacker alters an audit record in the database, the hash chain breaks from that sequence number forward, triggering an immediate security alert upon verification.

---

## 7. Secrets & Zero-Credentials Policy

1. **Zero Raw Credentials in Code or Repositories**:
   - Configuration is supplied via environment variables or GCP Secret Manager.
   - Every service validates environment schemas using strict validation at startup (e.g., Go `envconfig` with `required:true`). Missing secrets trigger immediate process panic.
2. **Log Redaction Filter**:
   - Structured logger automatically intercepts and sanitizes fields matching:
     `password`, `secret`, `token`, `authorization`, `cookie`, `jwt`, `private_key`, `refresh_token`.
   - Replaced with `[REDACTED]`.

---

## 8. Observability & Health Contracts

### 8.1 Probes
- `GET /healthz`: Basic liveness probe (returns `200 OK` if process is running).
- `GET /readyz`: Readiness probe (checks active database connection pool ping). If database is unreachable, returns `503 Service Unavailable`.
- `GET /metrics`: Standard Prometheus metrics endpoint.

### 8.2 Standard Metrics
- `http_requests_total{method, path, status}` (Counter)
- `http_request_duration_seconds{method, path}` (Histogram)
- `db_pool_connections{state="active|idle|max"}` (Gauge)
- `auth_attempts_total{status="success|failure"}` (Counter)
- `audit_events_emitted_total{action}` (Counter)

---

## 9. CI/CD Pipeline Gates (`.github/workflows/ci.yml`)

The CI pipeline runs on every pull request and commit to `main`:

```yaml
name: Aura M0 Foundation Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Secret Scanning
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD
      - name: Go Linter
        uses: golangci/golangci-lint-action@v4
        with:
          version: latest

  database-migration-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: aura_test
          POSTGRES_USER: aura_user
          POSTGRES_PASSWORD: aura_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Run Migrations UP
        run: make migrate-up
      - name: Test Migration Rollback DOWN
        run: make migrate-down
      - name: Run Migrations UP Re-apply
        run: make migrate-up

  integration-tests:
    needs: [database-migration-test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Unit & RLS Integration Tests
        run: make test-coverage
      - name: Enforce Coverage Gate (>85%)
        run: make check-coverage-threshold
```

---

## 10. Codex Task Breakdown (M0 Execution Sequence)

Codex Builder must execute these tasks sequentially. No step may be skipped:

```text
TASK 1: Monorepo Foundation & Tooling
- Initialize monorepo directory layout.
- Configure Makefile, linter configs, and root package manifests.
- Implement packages/common/errors and packages/common/logger with PII masking.

TASK 2: Database Migrations & RLS Policies
- Write 000001_initial_schema.up.sql and down.sql.
- Write 000002_rls_policies.up.sql and down.sql.
- Create migration test harness verifying Up -> Down -> Up idempotency.

TASK 3: Database Client & Tenant Context Middleware
- Implement PostgreSQL connection pool manager with pgx.
- Write transaction wrapper injecting SET LOCAL app.current_organization_id.
- Write integration tests proving Tenant B cannot read Tenant A records.

TASK 4: Authentication Engine
- Implement Argon2id password hasher.
- Implement JWT access token generator and RS256 / HS256 validator.
- Implement Refresh Token rotation with session revocation table.
- Implement TOTP MFA setup and verification package.

TASK 5: RBAC Engine & Middleware
- Implement role-permission evaluation cache.
- Implement HTTP middleware RequirePermission("user:invite", etc.).
- Unit test permission denial returning 403 Forbidden.

TASK 6: Organizations & Locations APIs
- Implement handlers, services, and repositories for Organizations and Locations.
- Add input validation (slug formatting, timezone validation).

TASK 7: Cryptographic Audit Ledger Service
- Implement canonical string serializer and SHA-256 event hash generator.
- Implement sequential hash-chain verification routine.
- Wire automatic audit event recording on all privileged actions.

TASK 8: Health Probes, Metrics & Observability
- Implement /healthz, /readyz, and Prometheus /metrics endpoints.
- Inject OpenTelemetry TraceID and SpanID into all request contexts and logs.

TASK 9: Docker Compose & Local Developer Setup
- Create deploy/docker/docker-compose.dev.yml with Postgres 16 and migration runner.
- Provide seed script creating default SuperAdmin and test tenant.

TASK 10: M0 Acceptance Test Suite Execution
- Run complete test suite and generate M0 verification report.
```

---

## 11. M0 Acceptance Gate Verification Suite

The M0 milestone is officially **PASSED** only when every assertion below is verified by automated test:

```text
[ ] AUTHENTICATION
    [x] Valid credentials return 200 OK with valid JWT and refresh token.
    [x] Expired access token is rejected with 401 Unauthorized.
    [x] Refresh token rotation returns new access token and revokes old refresh token.
    [x] Replaying a revoked refresh token revokes all descendant sessions (family revocation).
    [x] Passwords stored strictly using Argon2id / bcrypt; zero plaintext passwords.

[ ] TENANT ISOLATION (RLS)
    [x] Organization A user querying /api/v1/locations receives ONLY Organization A sites.
    [x] Raw SQL query without WHERE clause executing under Org A context returns ONLY Org A rows.
    [x] Attempt to insert a Location with Org B ID under Org A context fails with RLS violation.

[ ] RBAC ENFORCEMENT
    [x] CUSTOMER_USER calling POST /api/v1/users/invite receives 403 Forbidden.
    [x] ORG_ADMIN calling POST /api/v1/users/invite receives 201 Created.
    [x] SUPER_ADMIN calling internal Ops endpoint passes; normal user receives 403 Forbidden.

[ ] AUDIT LEDGER INTEGRITY
    [x] Every privileged mutation (create user, assign role, delete location) creates an audit row.
    [x] Tampering with any past audit event breaks SHA-256 chain verification.
    [x] Audit logs contain zero raw passwords, bearer tokens, or secrets.

[ ] OBSERVABILITY & RECOVERY
    [x] /readyz returns 503 if database connection is terminated.
    [x] Trace ID propagated across HTTP headers and structured log entries.
    [x] Database migrations execute UP and DOWN without syntax or foreign-key errors.
```
