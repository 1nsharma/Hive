export interface SandboxLimits {
  spendingLimit: number;
  rateLimitPerMinute: number;
  allowedPermissions: string[];
  requiresApproval: boolean;
}

export class AgentSandbox {
  private limits: Map<string, SandboxLimits> = new Map(); // agentId -> limits
  private usage: Map<string, { spent: number; callsLastMinute: number }> = new Map();

  setLimits(agentId: string, limits: SandboxLimits) {
    this.limits.set(agentId, limits);
  }

  canExecute(agentId: string, cost: number, permission: string): boolean {
    const limits = this.limits.get(agentId);
    if (!limits) return false;
    
    if (!limits.allowedPermissions.includes(permission)) return false;
    
    const currentUsage = this.usage.get(agentId) || { spent: 0, callsLastMinute: 0 };
    if (currentUsage.spent + cost > limits.spendingLimit) return false;
    if (currentUsage.callsLastMinute >= limits.rateLimitPerMinute) return false;

    return true;
  }
}

export const globalAgentSandbox = new AgentSandbox();
