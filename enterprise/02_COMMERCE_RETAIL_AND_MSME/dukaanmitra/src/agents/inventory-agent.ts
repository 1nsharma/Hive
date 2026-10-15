import { globalAgentSandbox } from '../os-core/agent-sandbox';
import { globalApprovalEngine } from '../os-core/human-approval';
import { globalCommandBus, Command } from '../os-core/command-bus';
import { DomainEvent } from '../os-core/domain-events';
import { globalMemorySystem } from '../os-core/memory-layer';
import { globalReasoningStore } from '../os-core/reasoning-store';
import { globalIdempotencyEngine } from '../os-core/idempotency';

export class InventoryAgent {
  readonly agentId = 'agent_inventory_1';
  readonly permissions = ['READ_INVENTORY', 'CREATE_DRAFT_PO'];

  constructor() {
    // Register permissions in sandbox
    globalAgentSandbox.setLimits(this.agentId, {
      spendingLimit: 50000,
      rateLimitPerMinute: 10,
      allowedPermissions: this.permissions,
      requiresApproval: false
    });
  }

  async onInventoryLow(event: DomainEvent) {
    const tenantId = event.tenantId;
    const item = event.payload.item;
    const currentStock = event.payload.currentStock;
    const requiredStock = event.payload.requiredStock || 50;

    // Idempotency check: Don't process the same restock request twice
    const idempKey = globalIdempotencyEngine.generateKey(tenantId, 'RESTOCK_EVALUATION', event.payload);
    if (!globalIdempotencyEngine.checkAndSet(idempKey)) {
      console.log(`[InventoryAgent] Skipping duplicate restock evaluation for ${item}`);
      return;
    }

    const qtyToOrder = requiredStock - currentStock;
    const estimatedPrice = 40; // mock supplier price lookup
    const totalCost = qtyToOrder * estimatedPrice;

    // Reasoning trace
    const reasoningChain = [
      `Detected INVENTORY_LOW for ${item}. Current: ${currentStock}`,
      `Supplier lookup: Best price is ₹${estimatedPrice}/unit`,
      `Calculated reorder quantity: ${qtyToOrder} to reach ${requiredStock}`,
      `Total estimated cost: ₹${totalCost}`
    ];

    let outcome = 'DRAFTED_PO';
    let decision = `Drafted PO for ${qtyToOrder} ${item}`;

    // Agent limit check
    if (!globalAgentSandbox.canExecute(this.agentId, totalCost, 'CREATE_DRAFT_PO')) {
      outcome = 'REJECTED_LIMIT_EXCEEDED';
      decision = `Cannot create PO. Total cost ₹${totalCost} exceeds agent spending limit or missing permission.`;
    } else {
      // Human approval policy check
      if (totalCost > 10000) {
        reasoningChain.push(`Cost ₹${totalCost} > ₹10,000. Requesting human approval.`);
        globalApprovalEngine.requestApproval({
          toolId: 'createPurchaseOrder',
          agentId: this.agentId,
          tenantId: tenantId,
          payload: { item, qtyToOrder, totalCost },
          reason: `Need to restock ${item}. Cost is above auto-approval limit.`
        });
        outcome = 'APPROVAL_REQUESTED';
        decision = `Requested human approval for ${item} PO.`;
      } else {
        reasoningChain.push(`Cost ₹${totalCost} <= ₹10,000. Auto-creating PO.`);
        // Dispatch command to actually create PO
        const cmd: Command = {
          id: `cmd_${Date.now()}`,
          type: 'CREATE_PURCHASE',
          tenantId: tenantId,
          payload: { item, qtyToOrder, totalCost },
          timestamp: Date.now(),
          issuerId: this.agentId
        };
        await globalCommandBus.dispatch(cmd);
      }
    }

    // Save reasoning
    globalReasoningStore.save({
      tenantId,
      agentId: this.agentId,
      decision,
      confidence: 0.95,
      toolsUsed: ['getInventory', 'supplierLookup', 'createPurchaseOrder'],
      evidence: { eventPayload: event.payload },
      outcome,
      reasoningChain
    });

    // Save memory
    globalMemorySystem.store({
      tenantId,
      type: 'agent',
      entityId: this.agentId,
      data: { lastAction: outcome, item, qtyToOrder },
      relevanceScore: 0.8
    });
  }
}

export const inventoryAgent = new InventoryAgent();
