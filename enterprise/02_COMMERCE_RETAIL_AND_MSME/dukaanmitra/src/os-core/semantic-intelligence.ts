import { DomainEvent } from './domain-events';

export interface SemanticInsight {
  tenantId: string;
  category: 'HEALTH' | 'OPPORTUNITY' | 'RISK';
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  timestamp: number;
}

export class SemanticIntelligenceLayer {
  analyze(events: DomainEvent[], currentState: any): SemanticInsight[] {
    // Convert raw events to meaning
    // Dummy example
    const insights: SemanticInsight[] = [];
    if (currentState?.inventoryLevel === 'LOW' && currentState?.salesTrend === 'DOWN') {
      insights.push({
        tenantId: 'system',
        category: 'RISK',
        level: 'HIGH',
        description: 'Business Health Risk HIGH: Sales down + inventory low',
        timestamp: Date.now()
      });
    }
    return insights;
  }
}

export const globalSemanticIntelligence = new SemanticIntelligenceLayer();
