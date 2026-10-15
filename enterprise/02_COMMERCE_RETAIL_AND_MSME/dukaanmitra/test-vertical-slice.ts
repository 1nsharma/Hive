import { globalTenantRuntime } from './src/os-core/tenant-container';
import { globalCommandBus, Command } from './src/os-core/command-bus';
import { DomainEvent } from './src/os-core/domain-events';
import { globalProjectionEngine, Projection } from './src/os-core/projection-engine';
import { globalReasoningStore } from './src/os-core/reasoning-store';
import { globalObservability } from './src/os-core/observability';
import { globalStateMachineRegistry } from './src/os-core/state-machines';
import { globalSemanticIntelligence } from './src/os-core/semantic-intelligence';
import { globalPolicyEngine } from './src/os-core/policy-engine';

// Mocking Knowledge Graph for the sake of completion
class KnowledgeGraph {
  nodes: any[] = [];
  edges: any[] = [];
  addNode(node: any) { this.nodes.push(node); }
  addEdge(edge: any) { this.edges.push(edge); }
}
const globalKnowledgeGraph = new KnowledgeGraph();

// Initialize the OS environment
async function setupOS(tenantId: string) {
  const container = globalTenantRuntime.getContainer(tenantId);
  
  // 1. Setup Projections
  globalProjectionEngine.register({
    name: 'CustomerBalanceProjection',
    apply: (event: DomainEvent, currentState: any) => {
      const state = { ...currentState };
      if (event.type === 'UDHAAR_ADDED') {
        const customer = event.payload.customerName;
        state[customer] = (state[customer] || 0) + event.payload.amount;
      }
      return state;
    }
  });

  // 2. Setup Policy
  container.policyEngine.registerRule({
    id: 'MAX_UDHAAR_LIMIT',
    tenantId: tenantId,
    description: 'Ensure udhaar does not exceed 10000',
    condition: (context) => {
      if (context.payload.amount > 10000) return true;
      return false;
    },
    action: (context) => {
      throw new Error(`Policy Violation: Udhaar exceeds limit of 10000`);
    }
  });

  // 3. Register Command Handler
  globalCommandBus.registerHandler('CREATE_UDHAAR', {
    handle: async (command: Command) => {
      // Validate Policy
      await container.policyEngine.evaluate({
        tenantId: command.tenantId,
        payload: command.payload
      });

      // State Machine
      const canTransition = globalStateMachineRegistry.canTransition('ORDER', 'DRAFT', 'PENDING');
      if (!canTransition) throw new Error("Invalid state transition");

      // Emit Event
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

async function runVerticalSlice() {
  const tenantId = 'tenant_123';
  const container = await setupOS(tenantId);

  console.log("=== STARTING VERTICAL SLICE: WhatsApp Udhaar Entry ===");
  const inputMessage = "Rahul 500 sugar udhaar";
  console.log(`Input: "${inputMessage}"\n`);

  // 1. Parse Input (Simulated AI Agent parsing)
  console.log("[1] Parsing input...");
  const parsedData = {
    customerName: "Rahul",
    amount: 500,
    item: "sugar",
    type: "udhaar"
  };

  // 10. Store AI Reasoning
  globalReasoningStore.save({
    tenantId,
    agentId: 'agent_parser_1',
    decision: 'Parsed unstructured text to structured Udhaar intent',
    confidence: 0.95,
    toolsUsed: ['nlp_parser'],
    evidence: { text: inputMessage },
    outcome: 'SUCCESS',
    reasoningChain: ['Identified name: Rahul', 'Identified amount: 500', 'Identified intent: udhaar']
  });

  // 2. Create Command
  console.log("[2] Creating Command...");
  const command: Command = {
    id: `cmd_${Date.now()}`,
    type: 'CREATE_UDHAAR',
    tenantId: tenantId,
    payload: parsedData,
    timestamp: Date.now(),
    issuerId: 'agent_parser_1'
  };

  try {
    // 3, 4, 5, 6. Execute Command Bus
    console.log("[3] Executing Command Bus...");
    const events = await globalCommandBus.dispatch(command);

    // 7. Update Projection Engine
    console.log("[7] Updating Projections...");
    for (const evt of events) {
      globalProjectionEngine.processEvent(evt);
    }

    // 8. Update Knowledge Graph
    console.log("[8] Updating Knowledge Graph...");
    globalKnowledgeGraph.addNode({ id: 'Rahul', type: 'Customer' });
    globalKnowledgeGraph.addNode({ id: 'sugar', type: 'Product' });
    globalKnowledgeGraph.addEdge({ source: 'Rahul', target: 'sugar', relation: 'PURCHASED_ON_UDHAAR', amount: 500 });

    // 9. Execute Semantic Intelligence
    console.log("[9] Executing Semantic Intelligence...");
    const currentState = globalProjectionEngine.getState(tenantId, 'CustomerBalanceProjection');
    const insights = globalSemanticIntelligence.analyze(events, currentState);
    if (insights.length > 0) {
      console.log("   Insights generated:", insights);
    }
    
    // 11. Write Observability Log
    console.log("[11] Writing Observability Log...");
    globalObservability.logAction({
      tenantId,
      agentId: 'agent_core',
      actionType: 'DECISION',
      payload: events,
      reasoning: 'Successfully processed CREATE_UDHAAR command',
      latencyMs: 15,
      costEstimate: 0
    });

    // 12. Update Tenant Memory
    console.log("[12] Updating Tenant Memory...");
    container.memorySystem.store({
      tenantId,
      type: 'customer',
      entityId: 'Rahul',
      data: { lastPurchase: 'sugar', lastUdhaarAmount: 500 },
      relevanceScore: 1.0
    });

    // 13. Generate WhatsApp Response
    console.log("[13] Generating WhatsApp Response...");
    const responseMessage = `✅ 500 ka udhaar Rahul ke khate me (sugar ke liye) likh diya gaya hai.`;
    
    console.log("\n=== EXECUTION SUMMARY ===");
    console.log("Trace: Input -> Parse -> Command -> Policy -> StateMachine -> Event -> Projection -> Graph -> Reasoning -> Observability -> Memory -> Response");
    console.log("\nEvents Generated:\n", JSON.stringify(events, null, 2));
    console.log("\nProjections State:\n", JSON.stringify(globalProjectionEngine.getState(tenantId, 'CustomerBalanceProjection'), null, 2));
    console.log("\nGraph Changes:\n", JSON.stringify({ nodes: globalKnowledgeGraph.nodes, edges: globalKnowledgeGraph.edges }, null, 2));
    console.log("\nAI Reasoning:\n", JSON.stringify(globalReasoningStore.getRecords(tenantId), null, 2));
    console.log("\nAudit Logs:\n", JSON.stringify(globalObservability.getLogs(tenantId), null, 2));
    console.log("\nFinal Response:\n", responseMessage);

  } catch (error: any) {
    console.error("Workflow failed:", error.message);
  }
}

runVerticalSlice();
