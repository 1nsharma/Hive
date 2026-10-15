# Multi-Tenant Architecture & Isolation Guidelines (v1.0)

DukaanMitra is designed as an enterprise-grade multi-tenant software-as-a-service (SaaS) platform, capable of hosting thousands of local businesses securely on a unified scalable backend.

---

## 1. Multi-Tenancy Strategy

DukaanMitra utilizes a **Shared Database / Separate Rows** tenant architecture (Logical Tenant Isolation). This structure ensures extreme cost efficiency and near-zero database administrative overhead while guaranteeing robust, ironclad security boundaries.

```
                      ┌─────────────────────────────────┐
                      │    Shared Cloud SQL Instance    │
                      ├─────────────────────────────────┤
                      │        "dukaanmitra_db"         │
                      └────────────────┬────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│ Tenant 1 (Row-1) │          │ Tenant 2 (Row-2) │          │ Tenant N (Row-N) │
│ userId = 101     │          │ userId = 102     │          │ userId = 999     │
└──────────────────┘          └──────────────────┘          └──────────────────┘
```

### 1.1 Tenant Context Mapping
- **`userId`**: Primary database relational link (references `users.id` serial key).
- **`tenantId`**: String identifier configured as `tenant_${userId}` at the virtual container layer.
- **`orgId`**: Organization boundary linked to multiple retail branches (where applicable).

---

## 2. Row-Level Data Isolation (Drizzle-ORM Enforcement)

To completely eliminate the risk of **Cross-Tenant Data Exposure** (where Merchant A accidentally views or edits Merchant B's ledger entries), every database query is forced through a strict security boundary.

### 2.1 Explicit Identification Constraints
Every SQL statement querying user-authored metrics must explicitly filter on the active user session ID (`req.dbUser.id`).

#### Examples:
* **Product Retrieval**:
  ```ts
  const userProducts = await db.select()
    .from(products)
    .where(eq(products.userId, req.dbUser.id));
  ```
* **Customer Updates**:
  ```ts
  await db.update(customers)
    .set({ name, phone })
    .where(and(
      eq(customers.id, customerId),
      eq(customers.userId, req.dbUser.id)
    ));
  ```

### 2.2 Relational Join Isolation
When querying joined tables (e.g. transactions and associated customer rows), both elements are verified to reside inside the tenant scope:
```ts
const userDetails = await db.select()
  .from(transactions)
  .innerJoin(customers, eq(transactions.customerId, customers.id))
  .where(and(
    eq(transactions.userId, req.dbUser.id),
    eq(customers.userId, req.dbUser.id)
  ));
```

---

## 3. Core Virtual Runtime Isolation (`TenantContainer`)

At the platform's kernel engine level (`/src/os-core/tenant-container.ts`), the runtime instantiates fully isolated processing environments for each tenant.

- **`TenantContainer`**: Holds independent microservices:
  - **`EventBus`**: Local event loop processing.
  - **`MemorySystem`**: Ephemeral fast context caches.
  - **`PolicyEngine`**: Rule checks and rate limit guards.
  - **`WorkflowEngine`**: Core state machines tracking asynchronous background processes.
- **`TenantRuntime`**: A thread-safe management registry governing active tenant allocations.

```ts
export class TenantRuntime {
  private tenants: Map<string, TenantContainer> = new Map();

  getContainer(tenantId: string): TenantContainer {
    if (!this.tenants.has(tenantId)) {
      this.tenants.set(tenantId, new TenantContainer(tenantId));
    }
    return this.tenants.get(tenantId)!;
  }
}
```

---

## 4. Operational Safety Guidelines

1. **Never write raw `db.select().from(table)` queries without a `.where(...)` constraint.**
2. **Never expose auto-incremented database IDs directly without a double-checking session guard.**
3. **Always invalidate tenant caching (`clearUserCache(userId)`) immediately upon modifications to keep memory grids in complete synchronization.**
