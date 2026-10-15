import { globalAgentSandbox } from '../os-core/agent-sandbox.js';
import { globalCommandBus, Command } from '../os-core/command-bus.js';
import { DomainEvent } from '../os-core/domain-events.js';

export class FinanceAgent {
  readonly agentId = 'agent_finance';
  readonly permissions = ['READ_DOCS', 'UPDATE_DOCS'];

  constructor() {
    globalAgentSandbox.setLimits(this.agentId, {
      spendingLimit: 1000,
      rateLimitPerMinute: 60,
      allowedPermissions: this.permissions,
      requiresApproval: true
    });
  }

  async processDocument(event: DomainEvent) {
    console.log(`[FinanceAgent] Processing document in category: Finance`);
    // Agent logic for Finance
  }
}

export const financeAgent = new FinanceAgent();
