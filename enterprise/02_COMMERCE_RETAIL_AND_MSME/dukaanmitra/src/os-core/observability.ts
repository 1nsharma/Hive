/**
 * 🚨 Observability Layer
 * Audit logging, reasoning tracking, latency, and costs for AI actions.
 */

export interface AgentAuditLog {
  id: string;
  tenantId: string;
  agentId: string;
  actionType: 'TOOL_CALL' | 'DECISION' | 'ERROR' | 'MEMORY_ACCESS';
  payload: any;
  reasoning: string; // Why did the AI decide to do this?
  latencyMs: number; // Execution time
  costEstimate: number; // Estimated token cost
  timestamp: number;
}

export class ObservabilityLayer {
  private logs: AgentAuditLog[] = [];

  logAction(log: Omit<AgentAuditLog, 'id' | 'timestamp'>) {
    this.logs.push({
      ...log,
      id: `audit_${Date.now()}`,
      timestamp: Date.now()
    });
  }

  getLogs(tenantId: string): AgentAuditLog[] {
    return this.logs.filter(l => l.tenantId === tenantId);
  }
}

export const globalObservability = new ObservabilityLayer();
