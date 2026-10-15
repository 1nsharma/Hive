# State Transitions & Error Recovery (v1.0)

This document catalogs the state transition boundaries, visual feedback loops, loading spinners, network errors, and automated retry configurations across DukaanMitra (BazaarSync).

---

## 1. Primary Network Transition States

The application maintains a centralized network status state hook, updating the UI dynamically when connection levels fluctuate:

```
    [Online State]
          |
          v (Socket Disconnects / HTTP Request Fails)
    [Connection Degraded]
          |
          +---> [Immediate UI Update] ---> Render "Simulated Local Backup Active" Banner
          |
          v (Attempts automated silent retry in background)
    [Network Reconnected]
          |
          v
    [Silent Re-Hydration] ---> Fetch /api/db to check schema consistency -> Clear Banner
```

---

## 2. API Response State Progression

All core network operations (e.g. adding products, completing sales, parsing voice notes) follow a strict 4-phase state cycle:

1. **Phase 1: Idle (Ready)**
   - **UI**: Clear form fields, clickable action buttons, stable balance grids.
   - **Triggers**: User enters input and taps Submit.

2. **Phase 2: Pending (Loading)**
   - **UI**: Inputs get greyed out, buttons display a spinning loader, and touch listeners are disabled to prevent duplicate submissions.
   - **Triggers**: Request sent to HTTP API.

3. **Phase 3: Fulfilled (Success)**
   - **UI**: Display success toast, refresh list arrays, clear local input states, and play smooth scale out animations.
   - **Triggers**: Server returns HTTP status code `200` or `201`.

4. **Phase 4: Rejected (Error)**
   - **UI**: Keep prior input values, highlight offending fields with warning colors, show human-readable descriptive banner with a Retry button.
   - **Triggers**: Server returns HTTP `4xx` or `5xx` codes.

---

## 3. High-Risk Recovery Pathways

### 3.1 Token Expiry Recovery
- **Trigger**: Server authorization middleware returns `401 Unauthorized` with an expired token signature.
- **Handler**: The client-side fetch wrapper detects the `401` code, intercepts the failure, invokes Firebase `getIdToken(true)` to pull a fresh token, and automatically replays the pending transaction silently in the background.

### 3.2 Idempotent API Submission Guard
- **Trigger**: Rapid double-clicking of the "Complete POS Checkout" button.
- **Handler**: Front-end forms maintain a native `submitting` boolean lock, blocking secondary event triggers. On the backend, incoming requests require a unique transaction UUID hash, rejecting duplicates instantly at the gateway level.
