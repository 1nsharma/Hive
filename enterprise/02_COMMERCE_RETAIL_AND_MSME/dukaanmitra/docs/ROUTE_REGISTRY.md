# Route Registry (v1.0)

This registry catalogs all navigation boundaries, authentication guards, and path logic within DukaanMitra.

---

## 1. Unified Client-Side Route Structures

Since the platform is engineered as a highly responsive full-screen Progressive Web Application (PWA), routing is managed via a state-driven tab controller (`activeTab` state in `App.tsx`) with Framer Motion transitions rather than heavy, flicker-prone browser URLs. This guarantees frictionless sandboxed operation inside the Google AI Studio iframe environment.

### 1.1 Gatekeeping Route Guards
All views are protected by three levels of structural checks:

```
[Entry Point: main.tsx]
        |
        v
[Guard 1: User Logged In?]
        |
        +---> NO  ----> Render <LoginScreen />
        |
        +---> YES
              |
              v
[Guard 2: Store Onboarded?]
              |
              +---> NO  ----> Render <OnboardingWizard />
              |
              +---> YES
                    |
                    v
[Guard 3: Admin Role Required?]
                    |
                    +---> YES (If activeTab === 'admin' and user.isAdmin === false) --> Reject Navigation
                    +---> NO  ----> Mount Target Component inside central shell
```

---

## 2. Tab Route Directory

| Route / Tab ID | Access Level | Description | Exit/Back Destination |
| :--- | :---: | :--- | :--- |
| `"dashboard"` | Standard / Guest | Central shop cockpit displaying summary cards | N/A (Root) |
| `"pos"` | Standard / Guest | Point-of-Sale billing desk | `"dashboard"` |
| `"ledger"` | Standard / Guest | Digital Khata ledger and client balances | `"dashboard"` |
| `"inventory"` | Standard / Guest | SKU list and barcode settings | `"dashboard"` |
| `"reports"` | Standard / Guest | Margin calculations and Excel/Sheets syncing | `"dashboard"` |
| `"settings"` | Standard / Guest | Main options profile | `"dashboard"` |
| `"visits"` | Staff / Guest | Field-agent visits and location audits | `"settings"` |
| `"staff"` | Staff / Guest | Manager overview of field agents | `"settings"` |
| `"whatsapp_connection"` | Standard / Guest | Live WhatsApp QR connection simulation | `"settings"` |
| `"whatsapp_orders"` | Standard / Guest | Customer inbox parsing for cart additions | `"settings"` |
| `"admin"` | Administrator | Supervisor panel viewing tracking and system cache | `"dashboard"` |

---

## 3. Server-Side API Protected Routing

Every server-side API route under `/api/*` is fortified with Express middleware (`src/middleware/auth.ts`):
- **`requireAuth`**: Inspects standard Authorization headers for a valid Firebase JWT. Extracted metadata matches the active tenant ID and rejects requests failing authorization checks.
- **`requireAdmin`**: Cross-references verified token emails with the database administrator list, rejecting non-founder tokens with `403 Forbidden`.
- **`optionalAuth`**: Permits sandbox guest interactions by decoding local tokens, ensuring seamless operation across both registration states.
