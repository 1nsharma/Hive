# Offline Architecture & Guest Mode (v1.0)

This document details how DukaanMitra (BazaarSync) operates in offline environments and maps out our high-fidelity Guest Mode sandbox, local caching schemas, and persistence rules.

---

## 1. Dual-Mode Operations Framework

DukaanMitra is engineered to allow instant utility access with zero mandatory server setup or connectivity requirements. This is achieved via two distinct, functionally symmetric runtime layers:

```
                  +-----------------------------------+
                  |        Shopkeeper Web UI          |
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            | (Guest Mode)                                  | (Server Mode)
            v                                               v
+-----------+-----------+                       +-----------+-----------+
| Local Simulation Hub  |                       |  Express API Client   |
| - LocalStorage tables |                       |  - POST /transactions |
| - Offline calculus   |                       |  - Server Ledger      |
+-----------------------+                       +-----------------------+
```

---

## 2. Guest Mode Caching & Schema Matching

When a user elects to try the platform as a Guest (`isGuest` matches `true` inside app session states), DukaanMitra mirrors every persistent PostgreSQL schema directly inside the client's web browser using standard, key-value `localStorage` entries:

| PostgreSQL Table | LocalStorage Key | Schema Representation |
| :--- | :--- | :--- |
| `user_settings` | `dukaan_settings` | `{ businessName: string, phone: string, address: string, gstNumber: string }` |
| `customers` | `dukaan_customers` | Array of `{ id: string, name: string, phone: string, balance: number }` |
| `products` | `dukaan_products` | Array of `{ id: string, name: string, stock: number, unit: string, price: number }` |
| `transactions` | `dukaan_transactions`| Array of `{ id: string, customerId: string, amount: number, type: string, date: string }` |

- **ID Generation**: Because the guest database lacks backend incremental sequence support, IDs are generated client-side using unique UUIDs.
- **Precision Floating Points**: Decimal values for product stock, item quantities, and checkout balances are processed as high-precision floats to guarantee no mathematical calculation drift between guest and server runtimes.

---

## 3. Graceful Synchronization and Data Transition

When a registered Guest decides to transition to a permanent Firebase account, the client-side synchronization engine is primed to run a high-fidelity DB migration:
1. **Onboarding Extraction**: Extract the existing `dukaan_settings` payload from localStorage.
2. **REST Sync Loop**: Send structural POST operations to the server (`/api/customers/import`, `/api/products`, `/api/transactions`) to replicate the local ledger entries in the tenant's new isolated SQL table blocks.
3. **Cache Invalidation**: Flush local key-value lists once server confirmation responses return successful HTTP codes, migrating the app state seamlessly to server-dependent mode.
