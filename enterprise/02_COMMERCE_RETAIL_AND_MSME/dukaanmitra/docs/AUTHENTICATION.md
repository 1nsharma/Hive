# Authentication Architecture (v1.0)

This document provides a detailed specification of the Authentication System in DukaanMitra, describing the protocols, session lifecycle, guest modes, and security configurations.

---

## 1. High-Level Architecture Flow

DukaanMitra integrates a multi-layered authentication framework designed for real-time mobile/desktop synchronizations. The system combines Firebase Authentication for primary client-side user verification, a customized JSON Web Token (JWT) protocol for administrative secure commands, and a verified fallback decoder mechanism.

```
                    ┌────────────────────────────┐
                    │     DukaanMitra Client     │
                    └──────────────┬─────────────┘
                                   │
                      Bearer token (Firebase / JWT)
                                   ▼
                    ┌────────────────────────────┐
                    │    Express API Gateway     │
                    └──────────────┬─────────────┘
                                   │
                    ┌──────────────┴─────────────┐
                    │  requireAuth Middleware    │
                    └──────────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
 ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
 │ Custom JWT   │          │ Firebase Auth│          │ Fallback     │
 │ Verification │          │ Verification │          │ Token Decode │
 └──────┬───────┘          └──────┬───────┘          └──────┬───────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  ▼
                    ┌────────────────────────────┐
                    │    Sync & Register User    │
                    │   (getOrCreateUser SQL)    │
                    └──────────────┬─────────────┘
                                   ▼
                    ┌────────────────────────────┐
                    │     Request Authorized     │
                    └────────────────────────────┘
```

---

## 2. Authentication Tokens

The gateway processes three distinct token patterns presented in the `Authorization: Bearer <Token>` HTTP header:

### 2.1 Firebase ID Tokens (Production)
- **Issuer**: Firebase Authentication (`https://securetoken.google.com/<ProjectId>`)
- **Verification Method**: Verified server-side via the Firebase Admin SDK (`adminAuth.verifyIdToken(token)`).
- **Session Duration**: 1 hour.
- **User Identity Synchronization**: Triggers `getOrCreateUser(uid, email)` in the PostgreSQL instance, mapping Firebase `uid` to sequential relational `users.id` schema.

### 2.2 Custom Admin JWT (Administrative Terminal)
- **Secret Key**: `JWT_SECRET` environment variable (defaults to `bazaarsync-super-secret-key-2026`).
- **Signature Algorithm**: HMAC-SHA256.
- **Verification Method**: Handled by custom `jwt.verify(token, JWT_SECRET)`.
- **Payload Schema**:
  ```json
  {
    "type": "admin_ssh" | "mock_user",
    "email": "amitsharma99976@gmail.com",
    "iat": 1782384000,
    "exp": 1782387600
  }
  ```

### 2.3 Fallback Token Decoder (Active Sandbox Mode)
To ensure extreme platform reliability in isolated development environments or during partial network failures:
- If a token fails standard validation (e.g. expired, offline token cache, signature mismatch under sandboxed networks), the middleware applies a local `jwt.decode` validation step.
- Validates that the payload contains a proper identifier (`user_id` or `sub`) and email, logs in the database, and resumes the session.

---

## 3. Session Management Lifecycle

### 3.1 Initial Login & Synchronization
1. User provides credentials (Phone OTP, Email-Password, or Google Sign-In).
2. Client receives verified token.
3. Client attaches token as `Bearer <Token>` to all API calls.
4. Gateway intercepts request, verifies token, extracts user parameters, and queries the database via `getOrCreateUser`.
5. Trigger session log entry with `eventType: "login"`.

### 3.2 Session Log Tracking
Each session action writes an audit trail to the `user_logs` table:
- **`eventType`**: `login` | `logout` | `session_start`
- **Fields**: captures IP address, user-agent details, user IDs, and metadata.

### 3.3 Active Logout
1. User requests session termination.
2. Client logs a `logout` event payload to `/api/auth/session-log`.
3. Clear credentials from `localStorage` (`bazaarsync_user`, `bazaarsync_auth`, `bazaarsync_demo_id`).
4. Re-route client to the landing splash screen.

---

## 4. Offline / Guest Sandbox Mode

DukaanMitra offers a full local sandbox. This mode does not communicate with the Postgres SQL database.

### 4.1 State Management
- Data resides directly in the client's memory or `localStorage` (`bazaarsync_guest_db`, `bazaarsync_staff`).
- All reads and writes are executed on client-side context hooks.

### 4.2 Local to Cloud Synchronization (Merge Protocol)
When an anonymous guest user signs up for a formal account:
1. Client detects offline data in `localStorage`.
2. Initiates the **Merge Protocol** inside the iframe without disruptive alerts.
3. Transmits local transactions, customers, and product items as a bulk payload.
4. Relational database inserts the elements, mapping them to the newly generated `userId`.
5. Empties the guest local storage.

---

## 5. Security & Verification Policy

- **Credential Vault**: System API keys and `JWT_SECRET` keys are fetched dynamically from GCP Secret Manager or read from secure environment variables.
- **Private API Guard**: All mutations (`/api/customers`, `/api/products`, `/api/transactions`) require valid Bearer verification.
- **Admin Isolation**: Admins are matched explicitly via the `ADMIN_EMAILS` environment configurations. Attempting to access administrative telemetry paths `/api/admin/*` without an admin token rejects with `403 Forbidden`.
