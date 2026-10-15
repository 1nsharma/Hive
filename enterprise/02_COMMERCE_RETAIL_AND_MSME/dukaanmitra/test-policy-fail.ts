import { globalTenantRuntime } from './src/os-core/tenant-container';
import { globalCommandBus, Command } from './src/os-core/command-bus';
import { DomainEvent } from './src/os-core/domain-events';
import { globalProjectionEngine } from './src/os-core/projection-engine';
import { globalStateMachineRegistry } from './src/os-core/state-machines';

async function setupOS(tenantId: string) {
  const container = globalTenantRuntime.getContainer(tenantId);
  container.policyEngine.registerRule({
    id: 'MAX_UDHAAR_LIMIT',
    tenantId: tenantId,
    description: 'Ensure udhaar does not exceed 10000',
    condition: (context) => {
      if (context.payload.amount > 10000) return true;
      return false;
    },
    action: (context) => {
      throw new Error(`Policy Violation: Udhaar exceeds limit of 10000. Approval required.`);
    }
  });

  globalCommandBus.registerHandler('CREATE_UDHAAR', {
    handle: async (command: Command) => {
      await container.policyEngine.evaluate({
        tenantId: command.tenantId,
        payload: command.payload
      });
      const event: DomainEvent = {
        id: `evt_${Date.now()}`,
        type: 'UDHAAR_ADDED',
        tenantId: command.tenantId,
        payload: command.payload,
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      return [event];
    }
  });

  return container;
}

async function runTest() {
  const tenantId = 'tenant_456';
  const container = await setupOS(tenantId);

  console.log("=== STARTING POLICY FAILURE TEST ===");
  const parsedData = { customerName: "Rahul", amount: 15000, item: "bulk sugar", type: "udhaar" };

  const command: Command = {
    id: `cmd_${Date.now()}`,
    type: 'CREATE_UDHAAR',
    tenantId: tenantId,
    payload: parsedData,
    timestamp: Date.now(),
    issuerId: 'agent_parser_1'
  };

  try {
    await globalCommandBus.dispatch(command);
  } catch (error: any) {
    console.log("Workflow correctly caught violation:", error.message);
  }
}
runTest();
