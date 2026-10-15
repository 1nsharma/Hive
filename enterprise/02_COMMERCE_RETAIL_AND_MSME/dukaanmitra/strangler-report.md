# THE GREAT REWIRING: Architecture Migration Plan

## 1. Exact Files to Modify
- `server.ts` (Express REST Gateway)
- `src/os-core/command-bus.ts` (Register command types)
- `src/os-core/domain-events.ts` (Register event types)
- `src/os-core/event-bus.ts` (Create global event bus instance if not already existing)
- **New File**: `src/os-core/strangler-gateway.ts` (Compatibility & translation layer)

## 2. Exact Imports to Replace
In `server.ts`:
- **Remove**: Direct `db.insert(...)` and `db.update(...)` inside REST routes.
- **Add**: 
  ```typescript
  import { globalCommandBus } from './src/os-core/command-bus';
  import { initStranglerGateway } from './src/os-core/strangler-gateway';
  ```

## 3. Exact Routes to Rewire (Phase 1)
- `POST /api/transactions` → `globalCommandBus.dispatch({ type: 'ADD_TRANSACTION' })`
- `POST /api/customers` → `globalCommandBus.dispatch({ type: 'CREATE_CUSTOMER' })`
- `POST /api/products` → `globalCommandBus.dispatch({ type: 'CREATE_PRODUCT' })`
- `POST /api/stock-adjust` → `globalCommandBus.dispatch({ type: 'ADJUST_INVENTORY' })`
- `POST /api/whatsapp/send-bill` → `globalCommandBus.dispatch({ type: 'SEND_WHATSAPP' })`

## 4. Migration Strategy: Strangler Fig Pattern
1. **Intercept (Command Phase)**: Modify Express REST endpoints to act as API Gateways. Instead of executing Drizzle SQL, they emit a Command object to `globalCommandBus`.
2. **Translate (Gateway Phase)**: The `strangler-gateway.ts` handles the command, checks policies, and emits a `DomainEvent` via `EventBus`.
3. **Execute (Projection Phase)**: Legacy CRUD logic is moved into Event Handlers inside `strangler-gateway.ts` (listening to `UDHAAR_ADDED`, `INVENTORY_LOW`, etc.). These handlers perform the actual Drizzle `db.insert()` and `db.update()`.
4. **Extend (AI Phase)**: The AI Agents (`inventory-agent`, `finance-agent`) subscribe to the same EventBus. Without changing any UI or DB logic, they now react autonomously to system events.

## 5. Compatibility Layer
A new `StranglerGateway` has been introduced (`src/os-core/strangler-gateway.ts`) that acts as the bridge between the old CRUD world and the new EDA/OS Kernel:
- Maps `ADD_TRANSACTION` command to `UDHAAR_ADDED` or `PAYMENT_RECEIVED` events based on payload.
- Automatically handles the inventory deduction side-effect for transactions.
- Conditionally fires `INVENTORY_LOW` if a transaction causes stock to drop below threshold, hooking up the `inventoryAgent` seamlessly.

## 6. Rollback Strategy
Since this is a Strangler Pattern:
- The UI remains **100% completely untouched**.
- The Database Schema remains **100% untouched**.
- To rollback, simply revert the modified routes in `server.ts` to their previous direct `db.insert` logic (saved in git history).
- The transition is completely isolated to the Express Controller layer.
