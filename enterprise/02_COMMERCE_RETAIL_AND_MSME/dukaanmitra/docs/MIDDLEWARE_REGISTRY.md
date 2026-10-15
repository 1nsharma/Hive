# Middleware Registry (v1.0)

This registry records all active Express middleware functions, documenting their order of execution, validation schemas, and role enforcement strategies.

---

## 1. Global Middleware Layers

These processors execute on every incoming HTTP connection prior to routing matching:

| Middleware | Purpose | Key Configurations |
| :--- | :--- | :--- |
| **`express.json`** | Parses incoming requests with JSON payloads. | `limit: "50mb"` (Necessary to support massive high-resolution OCR scan image uploads). |
| **`express.urlencoded`** | Parses URL-encoded parameters. | `limit: "50mb"`, `extended: true`. |
| **`vite.middlewares`** | Mounts the Vite dev server inside the Express loop in non-production runtimes. | Only active when `process.env.NODE_ENV !== "production"`. |

---

## 2. Protected Security Guards (`src/middleware/auth.ts`)

### 2.1 requireAuth
- **Purpose**: Restricts access to authenticated tenants and extracts database-backed profiles.
- **Workflow**:
  1. Inspects the `Authorization` header for `Bearer <Token>`. Returns `401 Unauthorized` if empty.
  2. Decodes local admin JWT payloads. Maps verified identifiers to standard users in the `users` table via `getOrCreateUser()`.
  3. Validates standard Firebase authentication payloads. Ensures the user is synchronizing to their isolated tenant-space database rows.
- **Attributes Injected to Request (`AuthRequest`)**:
  - `user`: The decoded raw token payload.
  - `dbUser`: The verified SQL database user row (`{ id, uid, email }`).
  - `isAdmin`: Boolean indicating whether the user possesses supervisor credentials.

### 2.2 requireAdmin
- **Purpose**: Restricts access to platform administration routes (such as logs viewing, telemetry monitoring, and cache clearing).
- **Workflow**:
  1. Wraps `requireAuth` to verify credentials first.
  2. Inspects `req.isAdmin`. If `false`, returns `403 Forbidden: Admin access required`.

### 2.3 optionalAuth
- **Purpose**: Supports loose tenant isolation for demographic tracking and product lookups without forcing guest users to authenticate.
- **Workflow**:
  - If the `Authorization` header is present, it attempts to verify the credentials and populate `req.dbUser`.
  - If credentials are missing or validation fails, it proceeds silently (`next()`) without returning an HTTP error.
