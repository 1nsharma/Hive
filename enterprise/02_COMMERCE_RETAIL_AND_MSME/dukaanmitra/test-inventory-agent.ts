import { inventoryAgent } from './src/agents/inventory-agent';
import { globalCommandBus, Command } from './src/os-core/command-bus';
import { globalReasoningStore } from './src/os-core/reasoning-store';
import { globalApprovalEngine } from './src/os-core/human-approval';
import { DomainEvent } from './src/os-core/domain-events';
import { globalSagaEngine } from './src/os-core/saga-engine';

async function runTest() {
  const tenantId = 'tenant_999';

  console.log("=== SETUP ENVIRONMENT ===");
  // Register CREATE_PURCHASE command to simulate creating a PO using a Saga
  globalCommandBus.registerHandler('CREATE_PURCHASE', {
    handle: async (command: Command) => {
      console.log(`[CommandBus] Creating purchase order for ${command.payload.item} (Amount: ₹${command.payload.totalCost})`);
      
      const sagaResult = await globalSagaEngine.runSaga(`saga_${Date.now()}`, [
        {
          name: 'Reserve Funds',
          execute: async () => { console.log("   -> Reserving funds..."); },
          compensate: async () => { console.log("   -> Reverting fund reservation..."); }
        },
        {
          name: 'Generate Draft PO Invoice',
          execute: async () => { console.log("   -> Generating draft PO invoice..."); },
          compensate: async () => { console.log("   -> Cancelling draft PO invoice..."); }
        },
        {
          name: 'Notify Supplier',
          execute: async () => { 
            console.log("   -> Notifying supplier over WhatsApp API..."); 
            // Uncomment to simulate failure to test compensation
            // throw new Error("Supplier API timeout");
          },
          compensate: async () => { console.log("   -> Sending cancellation notice to supplier..."); }
        }
      ]);

      if (!sagaResult.success) {
        throw new Error(`Saga failed: ${sagaResult.error}`);
      }

      const evt: DomainEvent = {
        id: `evt_${Date.now()}`,
        type: 'PURCHASE_CREATED',
        tenantId: command.tenantId,
        payload: command.payload,
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      return [evt];
    }
  });

  console.log("\n=== SCENARIO 1: Inventory Low (Below Approval Limit) ===");
  const event1: DomainEvent = {
    id: `evt_inv_1`,
    type: 'INVENTORY_LOW',
    tenantId,
    payload: { item: 'Sugar 1kg', currentStock: 2, requiredStock: 50 }, // Qty: 48 * 40 = ₹1920
    timestamp: Date.now(),
    sourceId: 'system_monitor'
  };
  await inventoryAgent.onInventoryLow(event1);

  console.log("\n=== SCENARIO 2: Idempotency Check (Duplicate Event) ===");
  // Should be skipped
  await inventoryAgent.onInventoryLow(event1);

  console.log("\n=== SCENARIO 3: Inventory Low (Above Approval Limit) ===");
  const event3: DomainEvent = {
    id: `evt_inv_3`,
    type: 'INVENTORY_LOW',
    tenantId,
    payload: { item: 'Rice 25kg', currentStock: 0, requiredStock: 300 }, // Qty: 300 * 40 = ₹12000
    timestamp: Date.now(),
    sourceId: 'system_monitor'
  };
  await inventoryAgent.onInventoryLow(event3);

  console.log("\n=== EXECUTION SUMMARY ===");
  console.log("\nAI Reasoning Records:");
  console.log(JSON.stringify(globalReasoningStore.getRecords(tenantId), null, 2));
  
  console.log("\nHuman Approvals Pending:");
  console.log(JSON.stringify(globalApprovalEngine.getPendingRequests(tenantId), null, 2));
}

runTest();
