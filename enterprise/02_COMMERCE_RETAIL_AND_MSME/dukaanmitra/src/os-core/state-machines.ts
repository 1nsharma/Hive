export type LifecycleState = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface StateMachineDefinition {
  entityType: string;
  initialState: LifecycleState;
  transitions: Record<LifecycleState, LifecycleState[]>;
}

export class StateMachineRegistry {
  private machines: Map<string, StateMachineDefinition> = new Map();

  register(machine: StateMachineDefinition) {
    this.machines.set(machine.entityType, machine);
  }

  canTransition(entityType: string, from: LifecycleState, to: LifecycleState): boolean {
    const machine = this.machines.get(entityType);
    if (!machine) return false;
    return machine.transitions[from]?.includes(to) || false;
  }
}

export const globalStateMachineRegistry = new StateMachineRegistry();

// Initialize basic state machines
globalStateMachineRegistry.register({
  entityType: 'ORDER',
  initialState: 'DRAFT',
  transitions: {
    'DRAFT': ['PENDING', 'CANCELLED'],
    'PENDING': ['ACTIVE', 'CANCELLED', 'FAILED'],
    'ACTIVE': ['COMPLETED', 'FAILED'],
    'COMPLETED': [],
    'FAILED': ['PENDING'],
    'CANCELLED': []
  }
});
