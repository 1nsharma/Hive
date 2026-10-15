# Module Dependency Graph (v1.0)

This document maps out the system dependencies, detailing how components, services, and libraries interact inside the DukaanMitra code topology.

---

## 1. High-Level Dependency Graph

The front-end client utilizes a highly decoupled tabs architecture under `App.tsx` coordinating state updates.

```
                  +--------------------------------+
                  |           App.tsx              |
                  +---------------+----------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
+--------+-------+       +--------+-------+       +--------+-------+
|    POSTab      |       |  InventoryTab  |       |   LedgerTab    |
+---+--------+---+       +---+--------+---+       +---+--------+---+
    |        |               |        |               |        |
    |        +------+ +------+        |               |        |
    v               v v               v               v        v
+---+---------------+-----------------+---------------+--------+---+
|                        Client Data State                         |
|  - customers list                                                |
|  - products list                                                 |
|  - transactions registry                                         |
+---------------------------------+--------------------------------+
                                  |
                                  v
+---------------------------------+--------------------------------+
|                        API Client Layer                          |
|  - fetchWithAuth() helper                                        |
|  - localStorage cached registers                                 |
+------------------------------------------------------------------+
```

---

## 2. Server-Side Dependency Flow

```
                      +-----------------------------+
                      |         server.ts           |
                      +--------------+--------------+
                                     |
                                     v
                      +--------------+--------------+
                      |      Auth Middleware        |
                      |  - requireAuth (Firebase)   |
                      |  - optionalAuth (Fallback)  |
                      +--------------+--------------+
                                     |
                     +---------------+---------------+
                     |                               |
                     v                               v
       +-------------+-------------+   +-------------+-------------+
       |         REST APIs         |   |         MitraOS Bus       |
       |  - /api/customers         |   |  - event-bus.ts           |
       |  - /api/products          |   |  - reasoning-store.ts     |
       |  - /api/transactions      |   |  - agent-sandbox.ts       |
       +-------------+-------------+   +-------------+-------------+
                     |                               |
                     +---------------+---------------+
                                     |
                                     v
                      +--------------+--------------+
                      |         Drizzle ORM         |
                      |  - PostgreSQL Database      |
                      +-----------------------------+
```

---

## 3. Package and Library Manifest

The application relies on a modern, highly optimized open-source toolchain:
1. **Frontend UI Engine**: React 18, Vite (Asset Builder), Tailwind CSS (Fluid utility styling), Lucide-React (Unified SVG icons), Framer Motion (Smooth layout transitions).
2. **State & Database**: Drizzle ORM (Backend SQL Query Builder), `pg` (PostgreSQL Client), LocalStorage (Client Offline Sandbox).
3. **AI Reasoning**: `@google/genai` (Official modern Google Gen AI SDK).
4. **Backend Core**: Express (HTTP Web Framework), TypeScript (Build safety), JSONWebToken / Firebase-Admin (Auth verifications).
