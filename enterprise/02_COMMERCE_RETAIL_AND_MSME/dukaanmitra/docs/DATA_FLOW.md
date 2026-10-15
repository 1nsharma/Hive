# Data Flow & Offline Sync Blueprint (v1.0)

This blueprint documents the lifecycle of data within DukaanMitra, detail-charting the synchronization flow, local guest sandboxes, and cloud persistence.

---

## 1. Structured Data Lifecycle (CRUD)

All persistent operations on business records trace a strict operational flow to maintain compliance and auditable chains:

### 1.1 Creation (C)
- **Pathway**: Client UI requests $\rightarrow$ API endpoints intercept $\rightarrow$ Command Bus routes through policy engine validation $\rightarrow$ Row added to SQL via Drizzle.
- **Audit Footprint**: Automatically registers a write event in `user_logs` or `market_research`.

### 1.2 Retrieval (R)
- **Pathway**: Client requests a state refresh $\rightarrow$ GET `/api/db` queries all tenant tables in a single transaction.
- **Optimization**: Employs a 60-second in-memory server cache to resolve subsequent reads instantly, protecting databases from high-frequency dashboard reloads.

### 1.3 Updates (U)
- **Pathway**: Handled strictly via PK filters (`eq(table.id, targetId)`).
- **Isolation Constraint**: Every update statement is hard-coded to require `.where(and(eq(table.id, targetId), eq(table.userId, req.dbUser.id)))` to block cross-user mutations.

### 1.4 Deletion (D)
- **Pathway**: Admin and standard delete routes.
- **Safety Precaution**: Cascade constraints are managed manually in code before executing table purges to avoid orphaned records.

---

## 2. Hybrid Guest & Server Sync Flow

DukaanMitra ensures that guest sandboxes have access to the full functional feature-set of the platform without registering a live account. This dual-pipeline is managed using clean abstractions:

```
                  [Client Interaction Actions]
                               |
                   (Is User Authenticated?)
                  /                        \
             [No / Guest]               [Yes / Tenant]
             /                                \
   [Local Storage State]              [Server API Gates]
   - Saved in browser memory          - Authenticated via JWT
   - Local calculators                - Persisted in Cloud Run database
   - High-fidelity offline sandbox    - Instant real-time replication
```

### 2.1 The Simulated Offline Engine
- **Storage Boundary**: Saved locally under localStorage keys `dukaan_customers`, `dukaan_products`, and `dukaan_transactions`.
- **Functional Alignment**: Simulated calculations (such as calculating credit margins or stock increments) are identical to backend server logic, ensuring the user gets a seamless transition when upgrading to cloud storage.

### 2.2 Account Upgrade Sync Loop
When a Guest user upgrades and signs up for a standard Firebase store account, a clean data migration routine replicates their local state to the persistent Cloud SQL database:

```
[Local Guest State]
       |
       v (User Authenticates / Registers)
[Batch Migrate Request (POST /api/contacts/import or custom upload)]
       |
       v
[Token Authenticated Gateway]
       |
       v
[Parse and validate objects] -----> [Resolve ID clashes / Normalize numbers]
                                                |
                                                v
                                 [Insert Bulk Rows into Cloud SQL]
```

---

## 3. Conflict Resolution Strategy

When multiple devices attempt to synchronize settings or transactions under the same store identifier, DukaanMitra applies an **LWW (Last-Write-Wins) Resolution Model**:
- **Timestamps Verification**: The `updated_at` column is automatically updated with UTC timestamps on every write.
- **Resolution Step**: During batch state updates, the record possessing the newest ISO timestamp overwrites older records.
- **Immutable Ledger Principle**: Transactions (ledgers) cannot be updated once saved. Changes require adding a corrective balancing transaction (reversing entries) rather than modifying historic lines, keeping the database audit-compliant.
