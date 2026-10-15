export interface ReasoningRecord {
  id: string;
  tenantId: string;
  agentId: string;
  decision: string;
  confidence: number;
  toolsUsed: string[];
  evidence: any;
  outcome: string;
  reasoningChain: string[];
  timestamp: number;
}

export class AIReasoningStore {
  private records: ReasoningRecord[] = [];

  save(record: Omit<ReasoningRecord, 'id' | 'timestamp'>) {
    this.records.push({
      ...record,
      id: `rs_${Date.now()}`,
      timestamp: Date.now()
    });
  }

  getRecords(tenantId: string): ReasoningRecord[] {
    return this.records.filter(r => r.tenantId === tenantId);
  }
}

export const globalReasoningStore = new AIReasoningStore();
