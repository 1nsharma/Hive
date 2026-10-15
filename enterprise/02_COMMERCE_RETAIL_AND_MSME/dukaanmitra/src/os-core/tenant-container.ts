import { EventBus } from './event-bus';
import { MemorySystem } from './memory-layer';
import { PolicyEngine } from './policy-engine';
import { WorkflowEngine } from './workflow-engine';

export class TenantContainer {
  public eventBus = new EventBus();
  public memorySystem = new MemorySystem();
  public policyEngine = new PolicyEngine();
  public workflowEngine = new WorkflowEngine();
  
  constructor(public readonly tenantId: string) {
    // Initialize isolated instances per tenant
  }
}

export class TenantRuntime {
  private tenants: Map<string, TenantContainer> = new Map();

  getContainer(tenantId: string): TenantContainer {
    if (!this.tenants.has(tenantId)) {
      this.tenants.set(tenantId, new TenantContainer(tenantId));
    }
    return this.tenants.get(tenantId)!;
  }
}

export const globalTenantRuntime = new TenantRuntime();
