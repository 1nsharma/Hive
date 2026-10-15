# Request Flow Intelligence (v1.0)

This document diagrams and documents the lifecycle of an incoming HTTP request traveling through the DukaanMitra (BazaarSync) backend.

---

## 1. Request Processing Lifecycle

```
[Incoming HTTP Client Request]
             |
             v
[Stage 1: Express Parser Middleware] ---> JSON, URL-Encoded, and CORS parsing (Max 50MB payload limits)
             |
             v
[Stage 2: Auth Gatekeeper Guard] --------> Check header: Authorization: Bearer <Token>
             |                                    |
             |                                    +---> Missing/Invalid  ---> Reject with HTTP 401
             |                                    +---> Valid custom JWT ---> Attach `dbUser` (SSH Admin or Mock User)
             |                                    +---> Valid Firebase   ---> Attach `dbUser` (Verified SQL User Profile)
             v
[Stage 3: Authorization (Role Gate)] ----> Inspect request handler requirement (e.g. requireAdmin)
             |                                    |
             |                                    +---> Failed Role      ---> Reject with HTTP 403
             v
[Stage 4: Schema Input Validation] ------> Checks request body payload parameters
             |
             v
[Stage 5: Business Engine & Policy] ----> Intercepts payload and dispatches commands to the event loops
             |                                    |
             |                                    +---> Failed Check     ---> Reject with HTTP 400
             v
[Stage 6: ORM Database Mutation] -------> Updates transactional rows in PostgreSQL via Drizzle ORM
             |
             v
[Stage 7: Response & Dispatch] ---------> Send JSON response to client (Purge 60-second DB memory cache)
             |
             v
[Stage 8: Async Logging & Monitoring] ---> Writes audit metadata, IP address, and user-agent into `user_logs`
```

---

## 2. Segmented Execution Analysis

### 2.1 Stage 2: Token Verification Guard
The server supports a robust multi-source authentication flow:
1. **Custom JWT Parsing**: Intercepts tokens with high priority. If decoded with type `admin_ssh` or `mock_user`, it bypasses external Firebase lookups to support local sandboxed administration.
2. **Firebase IdToken Verification**: If JWT decoding fails, the Bearer payload is sent to `adminAuth.verifyIdToken()` (Firebase Admin SDK).
3. **Failsafe Decoder**: If network degradation causes a verification error, the token is decoded unsafely (`jwt.decode`) to extract existing user information (`sub` / `user_id`), keeping the local guest session functional.

### 2.2 Stage 5: Strangler Pattern Event Loop
Rather than invoking direct SQL database mutations for ledger rows, mutating requests (such as creating customer accounts or adding transactions) are sent to `globalCommandBus.dispatch()` inside `/src/os-core/`:
- **Command validation**: The command payload is verified against structural typescript schemas.
- **Policy evaluation**: The policy engine checks the tenant's current limits (e.g., maximum outstanding credit debt).
- **Projections write**: Successful execution writes the data to the appropriate database tables and triggers related AI workflow reactions in the background.
