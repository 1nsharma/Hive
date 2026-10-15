import { DomainEvent } from './domain-events';

export interface Projection {
  name: string;
  apply: (event: DomainEvent, currentState: any) => any;
}

export class ProjectionEngine {
  private projections: Map<string, Projection> = new Map();
  private state: Map<string, any> = new Map(); // tenantId_projectionName -> state

  register(projection: Projection) {
    this.projections.set(projection.name, projection);
  }

  processEvent(event: DomainEvent) {
    for (const projection of this.projections.values()) {
      const key = `${event.tenantId}_${projection.name}`;
      const currentState = this.state.get(key) || {};
      const nextState = projection.apply(event, currentState);
      this.state.set(key, nextState);
    }
  }

  getState(tenantId: string, projectionName: string) {
    return this.state.get(`${tenantId}_${projectionName}`);
  }
}

export const globalProjectionEngine = new ProjectionEngine();
