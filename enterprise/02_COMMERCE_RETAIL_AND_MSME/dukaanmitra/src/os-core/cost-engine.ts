export interface CostMetric {
  tenantId: string;
  type: 'GEMINI_TOKENS' | 'WHATSAPP_USAGE' | 'SMS' | 'CALLS' | 'STORAGE' | 'WORKFLOW_EXECUTION' | 'AGENT_EXECUTION';
  amount: number;
  costInINR: number;
  timestamp: number;
}

export class CostEngine {
  private metrics: CostMetric[] = [];

  track(metric: Omit<CostMetric, 'timestamp'>) {
    this.metrics.push({
      ...metric,
      timestamp: Date.now()
    });
  }

  getTotalCost(tenantId: string): number {
    return this.metrics
      .filter(m => m.tenantId === tenantId)
      .reduce((sum, m) => sum + m.costInINR, 0);
  }
}

export const globalCostEngine = new CostEngine();
