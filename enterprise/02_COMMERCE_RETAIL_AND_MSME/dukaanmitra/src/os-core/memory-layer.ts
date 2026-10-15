/**
 * 🚨 Memory Layer
 * Gives Agents context about the business, customers, and history.
 */

export type MemoryType = 'short_term' | 'long_term' | 'business' | 'customer' | 'agent' | 'conversation';

export interface MemoryNode {
  id: string;
  tenantId: string;
  type: MemoryType;
  entityId?: string; // e.g. customerId, agentId
  data: any;
  timestamp: number;
  relevanceScore: number; // 0 to 1
}

export class MemorySystem {
  private memories: MemoryNode[] = [];

  store(memory: Omit<MemoryNode, 'id' | 'timestamp'>) {
    this.memories.push({
      ...memory,
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now()
    });
  }

  retrieve(tenantId: string, type: MemoryType, entityId?: string): MemoryNode[] {
    return this.memories.filter(m => 
      m.tenantId === tenantId && 
      m.type === type && 
      (!entityId || m.entityId === entityId)
    ).sort((a, b) => b.relevanceScore - a.relevanceScore); // Highest relevance first
  }
}

export const globalMemorySystem = new MemorySystem();
