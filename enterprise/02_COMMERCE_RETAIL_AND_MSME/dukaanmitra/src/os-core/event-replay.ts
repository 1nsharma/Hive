import { DomainEvent } from './domain-events';
import { globalProjectionEngine } from './projection-engine';

export class EventReplayEngine {
  replay(tenantId: string, events: DomainEvent[], toTimestamp?: number) {
    const relevantEvents = events
      .filter(e => e.tenantId === tenantId && (!toTimestamp || e.timestamp <= toTimestamp))
      .sort((a, b) => a.timestamp - b.timestamp);

    for (const event of relevantEvents) {
      globalProjectionEngine.processEvent(event);
    }
  }
}

export const globalEventReplay = new EventReplayEngine();
