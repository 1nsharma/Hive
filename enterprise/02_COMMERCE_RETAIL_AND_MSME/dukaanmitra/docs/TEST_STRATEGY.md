# Test Automation Strategy (v1.0)

This document details the test automation plan, testing tiers, tools, simulation parameters, and CI/CD pipelines designed to verify the stability of DukaanMitra (BazaarSync).

---

## 1. Multi-Tiered Testing Strategy

DukaanMitra ensures maximum runtime stability by testing features across three separate environments:

```
+-------------------------------------------------------+
|  Tier 3: End-to-End Testing (Playwright / Cypress)     |
|  Verifies critical merchant workflows (POS / Checkout) |
+---------------------------+---------------------------+
                            |
                            v
+---------------------------+---------------------------+
|  Tier 2: Integration Testing (Supertest / Vitest)     |
|  Verifies API routes, Auth, and DB tenant isolation   |
+---------------------------+---------------------------+
                            |
                            v
+---------------------------+---------------------------+
|  Tier 1: Unit Testing (Vitest)                        |
|  Verifies GST, HSN engines, parsers, and state logic  |
+-------------------------------------------------------+
```

---

## 2. Test Execution Tiers & Configurations

### 2.1 Tier 1: Unit Testing (Server & Client)
- **Target Systems**: GST calculation engines, Digital Munim fuzzy matching algorithms, locale date-time helpers.
- **Recommended Tools**: `Vitest` (fast, native ES Modules execution).
- **Mocking Boundaries**: External network requests (e.g., Google AI Studio, Firebase Auth handshake) must be mocked using static fixture inputs.

### 2.2 Tier 2: Integration Testing
- **Target Systems**: Express API route endpoints (`/api/*`), middleware authenticators, Drizzle ORM operations, database schema validations.
- **Recommended Tools**: `Vitest` and `Supertest`.
- **Mocking Boundaries**: A lightweight in-memory PostgreSQL simulation or isolated containerized PostgreSQL is initialized before the suite run, ensuring actual queries are validated against the schema.

### 2.3 Tier 3: End-to-End (E2E) Browser Testing
- **Target Systems**: Local Sandbox offline sync, transaction form submission, receipt scanning camera triggers, dynamic route transitions.
- **Recommended Tools**: `Playwright` or `Cypress`.
- **Mocking Boundaries**: Playwright tests use actual browser environments. Auth tokens are mocked or pre-authorized via programmatic test accounts.

---

## 3. Recommended CI/CD Verification Workflow

To enforce quality gates automatically during developer pull-requests:

```yaml
# .github/workflows/verify-pipeline.yml
name: "DukaanMitra Quality Verification Pipeline"
on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main", "develop" ]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Project Dependencies
        run: npm ci

      - name: Run Quality Linters
        run: npm run lint

      - name: Execute Server & Client Build
        run: npm run build

      - name: Execute Automated Test Suites
        run: npm run test # To be configured with Vitest
```
