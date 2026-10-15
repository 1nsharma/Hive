# Data Relationship & Ledger Intelligence (v1.0)

This blueprint documents and maps structural relationships, transactional balance-checks, physical inventory pipelines, and unified ledgers in DukaanMitra.

---

## 1. Unified Ledger & Accounting Transitions

The core of DukaanMitra is the **Double-Entry-Style Udhaari Credit System** mapping Customers to financial transactions and cash-flow reports.

```
       +-----------------------+
       |       Customer        |
       |  - id: serial         |
       |  - balance: double    | <------------------------+
       +-----------+-----------+                          |
                   |                                      |
                   | (Places sale or payment)             |
                   v                                      | (Recalculates and
       +-----------+-----------+                          |  updates balance)
       |      Transaction      |                          |
       |  - customer_id        |                          |
       |  - amount: double     |                          |
       |  - type: 'credit' /   |                          |
       |         'payment'     | -------------------------+
       +-----------------------+
```

### 1.1 The Balance Formula State Rule
Whenever a transaction row is inserted via the OS Strangler loop, a corresponding mutation is triggered to recalculate the targeted Customer's balance:
- **Transaction Type: `'credit'`**: Increases customer's outstanding balance:
  $$\text{New Balance} = \text{Current Balance} + \text{Transaction Amount}$$
- **Transaction Type: `'payment'`**: Decreases customer's outstanding balance:
  $$\text{New Balance} = \text{Current Balance} - \text{Transaction Amount}$$
- **Safety Policy**: If the newly calculated balance exceeds the customer's credit ceiling (configured via domain rules), the `policy-engine` rejects the operation prior to writing to the PostgreSQL server.

---

## 2. Inventory & Stock Replacement Transitions

Physical product assets follow a parallel double-entry tracking logic through `stock_transactions`:

```
       +-----------------------+
       |        Product        |
       |  - id: serial         |
       |  - stock: double      | <------------------------+
       +-----------+-----------+                          |
                   |                                      |
                   | ( replenishment or checkout sale)     |
                   v                                      | (Calculates and
       +-----------+-----------+                          |  updates stock)
       |   StockTransaction    |                          |
       |  - product_id         |                          |
       |  - quantity: double   |                          |
       |  - type: 'in' / 'out' | -------------------------+
       +-----------------------+
```

### 2.1 The Stock Transition State Rule
Replenishments and sales trigger automated delta adjustments on the `products.stock` column:
- **Adjustment Type: `'in'`** (Supplier replenishment or returns):
  $$\text{New Stock} = \text{Current Stock} + \text{Quantity}$$
- **Adjustment Type: `'out'`** (Client checkout sale or damage write-offs):
  $$\text{New Stock} = \text{Current Stock} - \text{Quantity}$$
- **Alert Triggers**: If $\text{New Stock} \le \text{lowStockThreshold}$, an alert is broadcasted on the `event-bus`, spawning warning tags on the client view.

---

## 3. Drizzle ORM Relationships Mapping (`src/db/schema.ts`)

Relations are formally declared using the Drizzle `relations` API to ensure clean join resolutions:

```ts
export const usersRelations = relations(users, ({ many, one }) => ({
  customers: many(customers),
  transactions: many(transactions),
  products: many(products),
  stockTransactions: many(stockTransactions),
  marketResearch: many(marketResearch),
  userLogs: many(userLogs),
  settings: one(userSettings)
}));
```

### Join Path Matrix

| Source Entity | Target Entity | Relation Type | Cardinality | Join Keys |
| :--- | :--- | :---: | :---: | :--- |
| `User` | `Customer` | One-To-Many | $1 : N$ | `users.id` = `customers.userId` |
| `User` | `Product` | One-To-Many | $1 : N$ | `users.id` = `products.userId` |
| `User` | `Transaction` | One-To-Many | $1 : N$ | `users.id` = `transactions.userId` |
| `User` | `UserSetting` | One-To-One | $1 : 1$ | `users.id` = `userSettings.userId` |
| `Customer` | `Transaction` | One-To-Many | $1 : N$ | `customers.id` = `transactions.customerId` |
| `Product` | `StockTransaction`| One-To-Many| $1 : N$ | `products.id` = `stockTransactions.productId` |
