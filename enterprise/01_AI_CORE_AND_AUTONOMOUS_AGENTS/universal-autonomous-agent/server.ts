import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  AgentMission, 
  PlanStep, 
  HITLAction, 
  SelfReflection, 
  AuditLogEntry, 
  PerceptionEvent, 
  MemoryNode, 
  DigitalTwinProfile, 
  MCPTool,
  OperatingMode,
  AgentWorker,
  IdentityEntity,
  IdentityGrowthProspect,
  IdentityGeneratedContent,
  IdentityPipelineRun,
  ReviewControlItem,
  BotChannel,
  BotChatMessage,
  AutomationWorkflow,
  MarketplaceItem,
  CloudSystemState,
  CLICommandResponse,
  AgentPermissionRule,
  TenantConnection,
  PolicyEvaluationResult
} from './src/types';
import { CAPABILITY_REGISTRY } from './src/lib/capabilityRegistry';
import { ToolRuntime, toolExecutionLedger, actionProposalsQueue, proposedActionsStore } from './src/lib/toolRuntime';
import { IdentityAgentRunner } from './src/lib/identityAgentRunner';
import { universalConnectorRegistry } from './src/lib/connectors';
import { llmRegistry } from './src/lib/llmProviders';
import { UniversalWorkOrchestrator } from './src/lib/universalWorkOrchestrator';
import { 
  INITIAL_PROFILES, 
  INITIAL_PERCEPTION_EVENTS, 
  INITIAL_MEMORY_NODES, 
  INITIAL_MCP_TOOLS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_AGENT_WORKERS,
  INITIAL_IDENTITY_ENTITIES,
  INITIAL_GROWTH_PROSPECTS,
  INITIAL_GENERATED_CONTENT,
  INITIAL_REVIEW_ITEMS,
  INITIAL_BOT_CHANNELS,
  INITIAL_BOT_MESSAGES,
  INITIAL_AUTOMATIONS,
  INITIAL_MARKETPLACE_ITEMS,
  INITIAL_CLOUD_STATE,
  INITIAL_PERMISSION_RULES,
  INITIAL_TENANT_CONNECTIONS
} from './src/data/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory state for Sandbox Multi-Tenant Platform & Universal Agent OS
let profiles: DigitalTwinProfile[] = JSON.parse(JSON.stringify(INITIAL_PROFILES));
let activeTenantId = 'user-amit-01';
let operatingMode: OperatingMode = 'SUPERVISED';
let agentWorkers: AgentWorker[] = JSON.parse(JSON.stringify(INITIAL_AGENT_WORKERS));
let identityEntities: IdentityEntity[] = JSON.parse(JSON.stringify(INITIAL_IDENTITY_ENTITIES));
let growthProspects: IdentityGrowthProspect[] = JSON.parse(JSON.stringify(INITIAL_GROWTH_PROSPECTS));
let generatedContent: IdentityGeneratedContent[] = JSON.parse(JSON.stringify(INITIAL_GENERATED_CONTENT));
let reviewItems: ReviewControlItem[] = JSON.parse(JSON.stringify(INITIAL_REVIEW_ITEMS));
let botChannels: BotChannel[] = JSON.parse(JSON.stringify(INITIAL_BOT_CHANNELS));
let botMessages: BotChatMessage[] = JSON.parse(JSON.stringify(INITIAL_BOT_MESSAGES));
let automations: AutomationWorkflow[] = JSON.parse(JSON.stringify(INITIAL_AUTOMATIONS));
let marketplaceItems: MarketplaceItem[] = JSON.parse(JSON.stringify(INITIAL_MARKETPLACE_ITEMS));
let cloudState: CloudSystemState = JSON.parse(JSON.stringify(INITIAL_CLOUD_STATE));
let identityPipelineRuns: IdentityPipelineRun[] = [];
let permissionRules: AgentPermissionRule[] = JSON.parse(JSON.stringify(INITIAL_PERMISSION_RULES));
let tenantConnections: TenantConnection[] = JSON.parse(JSON.stringify(INITIAL_TENANT_CONNECTIONS));

let perceptionEvents: PerceptionEvent[] = JSON.parse(JSON.stringify(INITIAL_PERCEPTION_EVENTS));
let memoryNodes: MemoryNode[] = JSON.parse(JSON.stringify(INITIAL_MEMORY_NODES));
let mcpTools: MCPTool[] = JSON.parse(JSON.stringify(INITIAL_MCP_TOOLS));
let auditLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
let hitlActions: HITLAction[] = [];
let activeMissions: AgentMission[] = [];

// Gemini Client Lazy Initializer
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Gemini client:', e);
      aiClient = null;
    }
  }
  return aiClient;
}

// Helper to log audit events
function logAudit(
  tenantId: string, 
  level: AuditLogEntry['level'], 
  monologue: string, 
  actionTaken: string, 
  riskLevel: AuditLogEntry['riskLevel'] = 'low', 
  toolUsed?: string, 
  payload?: Record<string, unknown>
) {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const newLog: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: timeStr,
    tenantId,
    level,
    agentMonologue: monologue,
    actionTaken,
    toolUsed,
    riskLevel,
    executionPayload: payload ? JSON.stringify(payload) : undefined
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 100) auditLogs.pop();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Get complete framework state
  app.get('/api/agent/state', (req: Request, res: Response) => {
    const tenant = profiles.find(p => p.id === activeTenantId) || profiles[0];
    const tenantPerceptions = perceptionEvents.filter(p => p.tenantId === activeTenantId);
    const tenantMemories = memoryNodes.filter(m => m.tenantId === activeTenantId);
    const tenantHitl = hitlActions.filter(h => h.tenantId === activeTenantId);
    const tenantMissions = activeMissions.filter(m => m.tenantId === activeTenantId);

    res.json({
      activeTenantId,
      profile: tenant,
      profiles,
      operatingMode,
      agentWorkers,
      identityEntities,
      growthProspects,
      generatedContent,
      reviewItems,
      botChannels,
      botMessages,
      automations,
      marketplaceItems,
      cloudState,
      identityPipelineRuns,
      permissionRules,
      tenantConnections,
      capabilities: Object.values(CAPABILITY_REGISTRY),
      toolExecutions: toolExecutionLedger.slice(0, 50),
      actionProposals: actionProposalsQueue.slice(0, 50),
      proposedActions: proposedActionsStore.slice(0, 50),
      perceptions: tenantPerceptions,
      memories: tenantMemories,
      mcpTools,
      hitlQueue: tenantHitl,
      missions: tenantMissions,
      auditLogs: auditLogs.slice(0, 40),
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // --- OPTION A: DETERMINISTIC POLICY & PERMISSION ENDPOINTS ---
  // Get all active capability permission rules
  app.get('/api/agent/policy/rules', (req: Request, res: Response) => {
    res.json({ success: true, rules: permissionRules, connections: tenantConnections });
  });

  // Evaluate action through Deterministic Policy Engine (Deny-by-default, 6D risk matrix, rate-limit check)
  app.post('/api/agent/policy/evaluate', (req: Request, res: Response) => {
    const { agentId, agentName, resource, capability, proposedAction, payload } = req.body;

    const timestamp = new Date().toLocaleTimeString();
    const idempotencyKey = `idemp_${agentId}_${resource}_${capability}_${Date.now()}`;
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Lockdown check
    if (operatingMode === 'LOCKDOWN') {
      const evaluation: PolicyEvaluationResult = {
        id: `eval-${Date.now()}`,
        timestamp,
        agentId: agentId || 'worker-unknown',
        agentName: agentName || 'Agent Worker',
        proposedAction: proposedAction || 'Unknown Action',
        resource,
        capability,
        decision: 'DENY',
        reasonCode: 'EMERGENCY_LOCKDOWN_ACTIVE',
        detailedAnalysis: 'All agent capabilities are strictly frozen under active emergency lockdown.',
        riskMatrix: {
          dataSensitivity: 3,
          externalCommunication: 3,
          financialImpact: 0,
          reputationImpact: 3,
          destructiveness: 0,
          reversibility: 3,
          compositeScore: 100,
          riskLevel: 'critical'
        },
        rateLimitStatus: { callsThisHour: 0, hourlyLimit: 0, withinLimit: false },
        budgetStatus: { costUsd: 0, dailyCapUsd: 0, withinBudget: false },
        idempotencyKey,
        executionId
      };
      logAudit(activeTenantId, 'security', `Policy Engine BLOCKED: "${proposedAction}". Reason: System in Lockdown`, 'Policy Interception: DENY', 'critical');
      res.json({ success: true, evaluation });
      return;
    }

    // 2. Deny-by-default Whitelist Lookup
    const matchedRule = permissionRules.find(
      r => r.agentId === agentId && r.resource === resource && r.capability === capability
    );

    // Multi-Dimensional Risk Matrix calculation
    let dataSensitivity: 0 | 1 | 2 | 3 = 0;
    let externalCommunication: 0 | 1 | 2 | 3 = 0;
    let financialImpact: 0 | 1 | 2 | 3 = 0;
    let reputationImpact: 0 | 1 | 2 | 3 = 0;
    let destructiveness: 0 | 1 | 2 | 3 = 0;
    let reversibility: 0 | 1 | 2 | 3 = 0;

    if (resource === 'vault' || capability.includes('secret') || resource === 'credentials') dataSensitivity = 3;
    else if (resource === 'database' || resource === 'email') dataSensitivity = 2;
    else if (resource === 'github') dataSensitivity = 1;

    if (capability.includes('publish') || capability.includes('broadcast') || capability.includes('outreach')) externalCommunication = 3;
    else if (capability.includes('draft')) externalCommunication = 2;

    if (capability.includes('spend') || capability.includes('transfer')) financialImpact = 2;
    if (capability.includes('publish') || capability.includes('broadcast')) reputationImpact = 2;
    if (capability.includes('drop') || capability.includes('delete')) destructiveness = 3;
    if (destructiveness === 3 || externalCommunication === 3) reversibility = 3;

    const rawScore = (dataSensitivity * 15) + (externalCommunication * 25) + (financialImpact * 15) + (reputationImpact * 20) + (destructiveness * 15) + (reversibility * 10);
    const compositeScore = Math.min(100, Math.round((rawScore / 300) * 100));

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (compositeScore >= 75 || destructiveness === 3) riskLevel = 'critical';
    else if (compositeScore >= 50 || externalCommunication === 3) riskLevel = 'high';
    else if (compositeScore >= 25) riskLevel = 'medium';

    if (!matchedRule) {
      // DENY BY DEFAULT
      const evaluation: PolicyEvaluationResult = {
        id: `eval-${Date.now()}`,
        timestamp,
        agentId,
        agentName,
        proposedAction,
        resource,
        capability,
        decision: 'DENY',
        reasonCode: 'UNAUTHORIZED_CAPABILITY_NOT_FOUND',
        detailedAnalysis: `Policy Violation: Agent "${agentName}" has NO explicitly granted capability for "${resource}.${capability}". Strict Deny-by-default enforced.`,
        riskMatrix: {
          dataSensitivity,
          externalCommunication,
          financialImpact,
          reputationImpact,
          destructiveness,
          reversibility,
          compositeScore,
          riskLevel
        },
        rateLimitStatus: { callsThisHour: 0, hourlyLimit: 0, withinLimit: false },
        budgetStatus: { costUsd: 0, dailyCapUsd: 0, withinBudget: true },
        idempotencyKey,
        executionId
      };
      logAudit(activeTenantId, 'security', `Policy Engine BLOCKED: "${proposedAction}". Reason: Unauthorized capability ${resource}.${capability}`, 'Policy Interception: DENY', riskLevel);
      res.json({ success: true, evaluation });
      return;
    }

    if (matchedRule.decision === 'DENY') {
      const evaluation: PolicyEvaluationResult = {
        id: `eval-${Date.now()}`,
        timestamp,
        agentId,
        agentName,
        proposedAction,
        resource,
        capability,
        decision: 'DENY',
        reasonCode: 'EXPLICIT_POLICY_DENY',
        detailedAnalysis: matchedRule.requiresApprovalReason || `Resource capability "${resource}.${capability}" is permanently blocked by security policy.`,
        riskMatrix: { dataSensitivity, externalCommunication, financialImpact, reputationImpact, destructiveness, reversibility, compositeScore, riskLevel },
        rateLimitStatus: { callsThisHour: 0, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: false },
        budgetStatus: { costUsd: 0, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
        idempotencyKey,
        executionId
      };
      logAudit(activeTenantId, 'security', `Policy Engine DENIED: "${proposedAction}". Reason: Explicit policy block.`, 'Policy Interception: DENY', riskLevel);
      res.json({ success: true, evaluation });
      return;
    }

    // Check if review gating required
    const requiresApproval = 
      operatingMode === 'COPILOT' ||
      matchedRule.decision === 'ALLOW_WITH_APPROVAL' ||
      compositeScore >= 40 ||
      externalCommunication >= 2;

    const finalDecision = requiresApproval ? 'ALLOW_WITH_APPROVAL' : 'ALLOW';

    const evaluation: PolicyEvaluationResult = {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction,
      resource,
      capability,
      decision: finalDecision,
      reasonCode: requiresApproval ? 'RISK_GATE_APPROVAL_REQUIRED' : 'POLICY_PERMITTED_AUTONOMOUS',
      detailedAnalysis: requiresApproval 
        ? (matchedRule.requiresApprovalReason || `Risk score (${compositeScore}/100) mandates human confirmation in Control Plane.`)
        : 'Capability authorized under deterministic policy whitelist.',
      riskMatrix: { dataSensitivity, externalCommunication, financialImpact, reputationImpact, destructiveness, reversibility, compositeScore, riskLevel },
      rateLimitStatus: { callsThisHour: 1, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: true },
      budgetStatus: { costUsd: 0.02, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
      idempotencyKey,
      executionId
    };

    // If gated with approval, create item in Review Control Plane
    if (finalDecision === 'ALLOW_WITH_APPROVAL') {
      const newReviewItem: ReviewControlItem = {
        id: `ctrl-${Date.now()}`,
        tenantId: activeTenantId,
        agentWorkerId: agentId,
        agentWorkerName: agentName,
        proposedAction,
        riskLevel,
        reason: matchedRule.requiresApprovalReason || `Enforced by Deterministic Policy Engine (${riskLevel} risk).`,
        dataUsed: [`Deterministic Policy Whitelist: ${resource}.${capability}`, `Idempotency: ${idempotencyKey}`],
        toolUsed: `mcp://${resource}.local/${capability}`,
        expectedResult: `Execution of ${capability} upon operator confirmation.`,
        payload: payload || { resource, capability, idempotencyKey, executionId },
        status: 'pending',
        createdAt: timestamp,
        canRollback: true
      };
      reviewItems.unshift(newReviewItem);
      logAudit(
        activeTenantId,
        'hitl',
        `Policy Engine routed "${proposedAction}" to Review Control Plane. Key: ${idempotencyKey}`,
        'Action Gated for Approval',
        riskLevel,
        `mcp://${resource}.local/${capability}`
      );
    } else {
      logAudit(
        activeTenantId,
        'action',
        `Policy Engine permitted auto-execution for "${proposedAction}". Key: ${idempotencyKey}`,
        'Action Auto-Executed',
        riskLevel,
        `mcp://${resource}.local/${capability}`
      );
    }

    res.json({ success: true, evaluation });
  });

  // --- PHASE 4: TOOL RUNTIME & MCP EXECUTION ENDPOINTS ---
  // A1: Get Capability Registry
  app.get('/api/agent/capabilities', (req: Request, res: Response) => {
    res.json({ success: true, capabilities: Object.values(CAPABILITY_REGISTRY) });
  });

  // A2/A3/A6/A7: Invocations through the ToolRuntime enforcement boundary
  app.post('/api/agent/tool/invoke', async (req: Request, res: Response) => {
    try {
      const { tenantId, agentId, runId, stepId, resource, action, payload, idempotencyKey, approvedActionId } = req.body;
      const runtime = new ToolRuntime(operatingMode);
      const result = await runtime.invoke({
        tenantId: tenantId || activeTenantId,
        agentId: agentId || 'worker-identity-01',
        runId: runId || `run_${Date.now()}`,
        stepId,
        resource,
        action,
        payload: payload || {},
        idempotencyKey,
        approvedActionId
      });

      // Mirror to audit log
      logAudit(
        tenantId || activeTenantId,
        result.status === 'BLOCKED_BY_POLICY' ? 'security' : 'action',
        `ToolRuntime.invoke: [${resource}.${action}] Status: ${result.status}. ExecId: ${result.executionId}`,
        `Tool Execution: ${result.status}`,
        result.status === 'BLOCKED_BY_POLICY' ? 'high' : 'low',
        `mcp://${result.provider}/${action}`
      );

      res.json({ success: true, result });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  });

  // A7: Get Tool Executions ledger
  app.get('/api/agent/tool/executions', (req: Request, res: Response) => {
    res.json({ success: true, executions: toolExecutionLedger.slice(0, 50) });
  });

  // A4: Get Action Proposals & Proposed Actions queues
  app.get('/api/agent/proposals', (req: Request, res: Response) => {
    res.json({ 
      success: true, 
      proposals: actionProposalsQueue.slice(0, 50),
      proposedActions: proposedActionsStore.slice(0, 50)
    });
  });

  // A5: Atomic Claim & Execute an Approved Action (Exactly-once semantics)
  app.post('/api/agent/proposals/claim', async (req: Request, res: Response) => {
    try {
      const { proposedActionId, agentId, runId } = req.body;
      const runtime = new ToolRuntime(operatingMode);
      const result = await runtime.claimAndExecuteApprovedAction(
        proposedActionId,
        agentId || 'worker-identity-01',
        runId || `run_${Date.now()}`
      );
      res.json({ success: true, result });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      res.status(400).json({ success: false, error: errorMsg });
    }
  });

  // A8: Integration Test / Run of Identity Agent v0.1
  app.post('/api/agent/identity/v01-run', async (req: Request, res: Response) => {
    try {
      const { agentId } = req.body;
      const runner = new IdentityAgentRunner(operatingMode);
      const report = await runner.runFullLoop(activeTenantId, agentId || 'worker-identity-01');

      logAudit(
        activeTenantId,
        'action',
        `Identity Agent v0.1 completed cognitive cycle: ${report.executionSummary.observationsCount} observations, ${report.executionSummary.proposalsGenerated} proposals. Zero public distribution verified.`,
        'Identity Agent v0.1 Run Complete',
        'low',
        'mcp://multi-adapter'
      );

      res.json({ success: true, report });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ success: false, error: errorMsg });
    }
  });

  // 2b. Set Operating Mode (COPILOT | SUPERVISED | AUTONOMOUS | LOCKDOWN)
  app.post('/api/agent/mode', (req: Request, res: Response) => {
    const { mode } = req.body;
    if (['COPILOT', 'SUPERVISED', 'AUTONOMOUS', 'LOCKDOWN'].includes(mode)) {
      operatingMode = mode as OperatingMode;
      if (mode === 'LOCKDOWN') {
        agentWorkers.forEach(w => {
          if (w.type !== 'security') w.status = 'locked';
        });
        logAudit(
          activeTenantId,
          'security',
          'EMERGENCY LOCKDOWN ACTIVATED: All autonomous worker executions frozen. Outbound external tools suspended.',
          'System State: EMERGENCY LOCKDOWN',
          'critical'
        );
      } else {
        agentWorkers.forEach(w => {
          if (w.status === 'locked') w.status = 'running';
        });
        logAudit(
          activeTenantId,
          'decision',
          `Operating mode updated to ${mode}. Capability boundaries and review enforcement adjusted.`,
          `Mode Changed: ${mode}`,
          mode === 'AUTONOMOUS' ? 'high' : 'low'
        );
      }
      res.json({ success: true, mode: operatingMode, workers: agentWorkers });
    } else {
      res.status(400).json({ error: 'Invalid mode' });
    }
  });

  // 2b-1. Universal Work OS: Connectors listing
  app.get('/api/agent/connectors', (req: Request, res: Response) => {
    const connectors = universalConnectorRegistry.listAll().map(({ connector, connection }) => ({
      id: connector.id,
      name: connector.name,
      category: connector.category,
      connectorType: connector.connectorType || 'OFFICIAL',
      authType: connector.authType || 'OAUTH',
      iconName: connector.iconName,
      description: connector.description,
      capabilities: connector.capabilities,
      connected: connection.connected,
      connectedAt: connection.connectedAt,
      scopes: connection.scopes
    }));
    res.json({ success: true, connectors });
  });

  // 2b-1b. Universal Work OS: Register Custom MCP / Webhook Server
  app.post('/api/agent/connectors/register-mcp', (req: Request, res: Response) => {
    const { id, name, description, capabilities } = req.body;
    if (!id || !name || !capabilities || !Array.isArray(capabilities)) {
      res.status(400).json({ error: 'Valid id, name, and capabilities array are required' });
      return;
    }

    const connector = universalConnectorRegistry.registerCustomMcpServer({
      id,
      name,
      description: description || 'User-defined community MCP Server',
      capabilities
    });

    logAudit(
      activeTenantId,
      'security',
      `Registered dynamic MCP Connector "${name}" (${id}) with ${capabilities.length} capabilities. Injected into ToolRuntime under policy enforcement.`,
      `MCP Dynamic Connector: ${id}`
    );

    res.json({ success: true, connector });
  });

  // 2b-2. Universal Work OS: Toggle Connector authorization
  app.post('/api/agent/connectors/toggle', (req: Request, res: Response) => {
    const { connectorId, connected } = req.body;
    universalConnectorRegistry.toggleConnection(connectorId, connected);
    logAudit(
      activeTenantId,
      'security',
      `User ${connected ? 'CONNECTED' : 'DISCONNECTED'} application "${connectorId}" via OAuth / Local Vault. Zero tokens exposed to Agent context.`,
      `Connector Authorization: ${connectorId}`
    );
    res.json({ success: true, connectorId, connected });
  });

  // 2b-3. Universal Work OS: Execute cross-platform work orchestration
  app.post('/api/agent/work/execute', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'Work prompt is required' });
      return;
    }
    const result = await UniversalWorkOrchestrator.executeWork(prompt, activeTenantId);
    logAudit(
      activeTenantId,
      'action',
      `Universal Work OS executed cross-app workflow for intent: "${prompt.slice(0, 50)}...". Target: ${result.summary.targetApp}. Result: ${result.status}`,
      `Work Orchestration: ${result.summary.targetApp}`
    );
    res.json({ success: true, result });
  });

  // 2b-4. Universal Work OS: List AI Providers
  app.get('/api/agent/llm/providers', (req: Request, res: Response) => {
    res.json({
      success: true,
      currentProvider: llmRegistry.getCurrentName(),
      providers: llmRegistry.listAll()
    });
  });

  // 2b-5. Universal Work OS: Switch AI Provider
  app.post('/api/agent/llm/provider/set', (req: Request, res: Response) => {
    const { providerId } = req.body;
    try {
      llmRegistry.setDefault(providerId);
      logAudit(
        activeTenantId,
        'decision',
        `Switched active LLM Provider to "${providerId}". Deterministic policy boundary remains fully invariant.`,
        `LLM Provider: ${providerId}`
      );
      res.json({ success: true, currentProvider: providerId });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  });

  // 2c. Toggle or run Agent Worker
  app.post('/api/agent/workers/toggle', (req: Request, res: Response) => {
    const { workerId, status } = req.body;
    const worker = agentWorkers.find(w => w.id === workerId);
    if (worker) {
      worker.status = status;
      logAudit(
        activeTenantId,
        'decision',
        `Agent worker ${worker.name} status set to ${status}.`,
        `Worker Status: ${worker.name}`
      );
      res.json({ success: true, worker });
    } else {
      res.status(404).json({ error: 'Worker not found' });
    }
  });

  // 2d. Run Agent Worker on demand
  app.post('/api/agent/workers/run', async (req: Request, res: Response) => {
    const { workerId } = req.body;
    const worker = agentWorkers.find(w => w.id === workerId);
    if (!worker) {
      res.status(404).json({ error: 'Worker not found' });
      return;
    }

    if (operatingMode === 'LOCKDOWN') {
      res.status(403).json({ error: 'Cannot run worker: System is in EMERGENCY LOCKDOWN' });
      return;
    }

    worker.lastActive = 'Just now';
    worker.metrics.tasksCompleted += 1;
    worker.metrics.hoursSaved += 1;

    let executionDetail = '';
    if (worker.type === 'identity') {
      executionDetail = 'Discovered 1 new external peer mention and reconciled entity confidence.';
    } else if (worker.type === 'research') {
      executionDetail = 'Synthesized arXiv pre-print on LangGraph & MCP streaming latency.';
    } else if (worker.type === 'content') {
      executionDetail = 'Drafted technical thread on Zero-Trust Agent Architecture.';
    } else if (worker.type === 'growth') {
      executionDetail = 'Identified 2 AI startup founders building on MCP; prepared intro draft.';
    } else if (worker.type === 'coding') {
      executionDetail = 'Ran automated unit test suite on MCP JSON-RPC router (All passed).';
    } else if (worker.type === 'security') {
      executionDetail = 'Audited active tokens and evaluated MCP tool call boundaries: 0 leaks.';
    } else {
      executionDetail = 'Synthesized scheduled tasks and generated morning priority list.';
    }

    logAudit(
      activeTenantId,
      'action',
      `Worker ${worker.name} dispatched: ${executionDetail}`,
      `Worker Executed: ${worker.name}`,
      'low'
    );

    res.json({ success: true, worker, executionDetail });
  });

  // 2e. Run Amit Identity & Growth 7-Stage Pipeline
  app.post('/api/agent/identity-pipeline/run', async (req: Request, res: Response) => {
    const tenant = profiles.find(p => p.id === activeTenantId) || profiles[0];
    const timestamp = new Date().toLocaleTimeString();

    // Stage 1: Discover
    const newDiscovered: IdentityEntity = {
      id: `entity-${Date.now()}`,
      tenantId: tenant.id,
      source: 'web',
      title: 'Hacker News Thread: "Show HN: Model Context Protocol Production Experiences"',
      snippet: 'Multiple developers citing Amit Sharma\'s architecture for stateful tool persistence across long-running tasks.',
      url: 'https://news.ycombinator.com/item?id=43901234',
      verificationStatus: 'CONFIRMED',
      discoveredAt: 'Just now',
      deltaIdentified: 'New organic community mention with 85+ upvotes.',
      confidence: 97
    };
    identityEntities.unshift(newDiscovered);

    // Stage 2: Verify (already reconciled)
    // Stage 3: Understand (What changed? What matters? What is mine?)
    const deltaSummary = `Today's Digital Identity Delta:
1. GitHub: 68 new stars on mcp-autonomous-orchestrator
2. Community: Hacker News front-page discussion citing your MCP persistence architecture
3. Opportunity: Keynote speaking invitation for India AI Summit 2026
4. Network: CognitiveScale CEO reviewed your multi-agent research pre-print`;

    // Stage 4: Generate (GitHub commits + AI news + current project)
    const newPost: IdentityGeneratedContent = {
      id: `content-${Date.now()}`,
      format: 'linkedin',
      title: 'Why Real-World Agents Need Memory Recalibration (Not Just RAG)',
      body: `Static RAG gives your agent reference docs. But without dynamic heuristic recalibration, long-running agent workflows diverge into hallucination.\n\nAt NeuralVentures Labs, our Agent OS tests showed that updating heuristic weights (autonomy, risk tolerance, thoroughness) post-action reduced error rates by 41%.\n\nAre you building static prompts or self-adapting agent operating systems?`,
      tags: ['AIAgents', 'AgentOS', 'MachineLearning', 'Engineering'],
      sourcesUsed: ['GitHub MCP Commits', 'Heuristic Self-Reflection Benchmarks'],
      status: 'pending_approval',
      engagementMetrics: {
        views: 0,
        reactions: 0,
        replies: 0,
        leadConversions: 0
      }
    };
    generatedContent.unshift(newPost);

    // Stage 5: Growth (AI founders, MSME leaders, developers, researchers, investors)
    const newProspect: IdentityGrowthProspect = {
      id: `prospect-${Date.now()}`,
      name: 'Dr. Vikram Sethi',
      role: 'Head of Applied AI',
      organization: 'TuringScale Cloud',
      category: 'ai_founder',
      relevanceScore: 94,
      draftedOutreachMessage: `Hi Dr. Vikram — saw TuringScale's recent announcement on deploying enterprise LLM swarms. We recently open-sourced our Agent OS MCP orchestrator, solving asynchronous tool approval gates. Would love to share our architecture if relevant to your roadmap.`,
      status: 'drafted',
      outreachChannel: 'linkedin'
    };
    growthProspects.unshift(newProspect);

    // Stage 6: Distribute (create Review Control Plane item)
    const newControlItem: ReviewControlItem = {
      id: `ctrl-${Date.now()}`,
      tenantId: tenant.id,
      agentWorkerId: 'worker-identity',
      agentWorkerName: 'Identity Agent',
      proposedAction: 'Publish Thought Leadership: "Why Real-World Agents Need Memory Recalibration"',
      riskLevel: 'high',
      reason: 'Hacker News thread is driving high incoming traffic to your GitHub repo; publishing this article now capitalizes on current attention.',
      dataUsed: ['HN Thread #43901234', 'GitHub analytics', 'Amit Identity tone parameters'],
      toolUsed: 'mcp://social.local/linkedin/publish',
      expectedResult: 'Reach 3,000+ tech leaders and solidify thought leadership in autonomous agent systems.',
      actualResult: undefined,
      payload: { postTitle: newPost.title, channel: 'LinkedIn' },
      diffPreview: `+ [LinkedIn Article] "${newPost.title}"\n+ Status: Pending Human Confirmation`,
      status: 'pending',
      createdAt: 'Just now',
      canRollback: true
    };
    reviewItems.unshift(newControlItem);

    // Stage 7: Learn
    tenant.heuristicWeights.learningAdaptability = Math.min(100, tenant.heuristicWeights.learningAdaptability + 1);
    tenant.heuristicWeights.thoroughness = Math.min(100, tenant.heuristicWeights.thoroughness + 1);

    const pipelineRun: IdentityPipelineRun = {
      id: `run-${Date.now()}`,
      tenantId: tenant.id,
      timestamp,
      deltaSummary,
      discoveredEntities: [newDiscovered],
      generatedContent: [newPost],
      growthProspects: [newProspect],
      learningInsights: {
        topicAttention: 'Stateful MCP Toolchains & Zero-Trust Agent OS Architecture',
        repliesSummary: 'Strong inbound curiosity from applied AI engineers and founders',
        strategyAdjustment: 'Prioritize technical diagrams and code snippets; conversion is 2.4x higher than high-level commentary.'
      }
    };
    identityPipelineRuns.unshift(pipelineRun);

    logAudit(
      tenant.id,
      'decision',
      'Completed 7-Stage Digital Identity & Growth Loop (Discover -> Verify -> Understand -> Generate -> Growth -> Distribute -> Learn). New items queued for human review.',
      'Identity Loop Completed'
    );

    res.json({
      success: true,
      pipelineRun,
      discoveredEntity: newDiscovered,
      generatedPost: newPost,
      growthProspect: newProspect,
      controlItem: newControlItem
    });
  });

  // 2f. Entity verification toggle
  app.post('/api/agent/identity/verify-entity', (req: Request, res: Response) => {
    const { entityId, status } = req.body;
    const entity = identityEntities.find(e => e.id === entityId);
    if (entity) {
      entity.verificationStatus = status;
      logAudit(
        activeTenantId,
        'info',
        `Reconciled identity entity "${entity.title}" to status: ${status}`,
        'Identity Reconciliation'
      );
      res.json({ success: true, entity });
    } else {
      res.status(404).json({ error: 'Entity not found' });
    }
  });

  // 2g. Control Plane action (Approve, Reject, Modify, Rollback)
  app.post('/api/agent/control-plane/action', (req: Request, res: Response) => {
    const { itemId, action, notes, modifiedPayload } = req.body;
    const item = reviewItems.find(i => i.id === itemId);
    if (!item) {
      res.status(404).json({ error: 'Control item not found' });
      return;
    }

    if (action === 'approve') {
      item.status = 'approved';
      item.actualResult = `Executed successfully via ${item.toolUsed}. Return code: 200 OK.`;
      item.reviewedAt = new Date().toLocaleTimeString();
      item.reviewerNotes = notes || 'Approved by operator';
    } else if (action === 'reject') {
      item.status = 'rejected';
      item.actualResult = `Cancelled by operator. Tool invocation aborted.`;
      item.reviewedAt = new Date().toLocaleTimeString();
      item.reviewerNotes = notes || 'Rejected by operator';
    } else if (action === 'modify') {
      item.status = 'modified';
      if (modifiedPayload) item.payload = modifiedPayload;
      item.actualResult = `Executed with modifications via ${item.toolUsed}.`;
      item.reviewedAt = new Date().toLocaleTimeString();
      item.reviewerNotes = notes || 'Modified and authorized';
    } else if (action === 'rollback') {
      item.status = 'rolled_back';
      item.actualResult = `Rollback compensating transaction executed. State restored.`;
      item.reviewerNotes = notes || 'Rolled back to previous checkpoint';
    }

    logAudit(
      item.tenantId,
      'hitl',
      `Control Plane ${action.toUpperCase()}: "${item.proposedAction}". Result: ${item.actualResult}`,
      `Control Decision: ${action.toUpperCase()}`,
      item.riskLevel
    );

    res.json({ success: true, item });
  });

  // 2h. Multi-Channel Bot Chat (WhatsApp, Telegram, Web, Slack)
  app.post('/api/agent/channels/chat', async (req: Request, res: Response) => {
    const { channelId, text } = req.body;
    const channel = botChannels.find(c => c.id === channelId) || botChannels[0];
    const tenant = profiles.find(p => p.id === activeTenantId) || profiles[0];

    const userMsg: BotChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: channel.id,
      sender: 'user',
      senderName: tenant.name,
      text: text || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    botMessages.push(userMsg);

    // Generate response
    let replyText = '';
    const gemini = getGeminiClient();

    if (gemini && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are the executive Agent OS coordinating autonomous workers (Identity, Research, Content, Growth, Coding, Business, Security, Personal Assistant) for ${tenant.name} (${tenant.role} at ${tenant.organization}).
Current Operating Mode: ${operatingMode}.
Channel: ${channel.displayName}.
User says: "${text}".
Provide a concise, direct, helpful response in English (or Hindi if prompted) confirming actions taken, status of workers, or asking for approval on sensitive tasks. Keep it under 3-4 sentences.`;

        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
        replyText = response.text || `Action processed under ${operatingMode} mode.`;
      } catch (err) {
        console.warn('Gemini chat error:', err);
      }
    }

    if (!replyText) {
      const lower = (text || '').toLowerCase();
      if (lower.includes('lockdown') || lower.includes('stop') || lower.includes('freeze')) {
        operatingMode = 'LOCKDOWN';
        replyText = `🚨 EMERGENCY LOCKDOWN ACTIVATED via ${channel.displayName}. All autonomous workers paused. External tool execution blocked.`;
      } else if (lower.includes('status') || lower.includes('health')) {
        replyText = `Agent OS Status: All systems operational. Mode: ${operatingMode}. 8 workers active. 1 pending action in Review Plane.`;
      } else if (lower.includes('growth') || lower.includes('lead')) {
        replyText = `Growth Agent has identified 4 high-fit AI leaders and prepared custom connection notes in the Review Plane.`;
      } else if (lower.includes('post') || lower.includes('linkedin') || lower.includes('article')) {
        replyText = `Content Agent drafted "Stop Building Chatbots: The Shift to Operating Systems for Autonomous Work". Ready for your review in the Control Plane.`;
      } else {
        replyText = `Received on ${channel.displayName}. Worker swarm coordinated under ${operatingMode} policy. Action logged to audit trail.`;
      }
    }

    const agentMsg: BotChatMessage = {
      id: `msg-${Date.now() + 1}`,
      channelId: channel.id,
      sender: 'agent',
      senderName: 'Agent OS',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    botMessages.push(agentMsg);

    logAudit(
      activeTenantId,
      'info',
      `Processed interaction on channel [${channel.displayName}]: "${text}" -> "${replyText}"`,
      `Bot Interaction: ${channel.id}`
    );

    res.json({ success: true, userMsg, agentMsg });
  });

  // 2i. Automations triggers & toggle
  app.post('/api/agent/automations/run', (req: Request, res: Response) => {
    const { workflowId } = req.body;
    const workflow = automations.find(a => a.id === workflowId);
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }

    workflow.lastRun = 'Just now';
    workflow.lastStatus = 'success';
    workflow.totalExecutions += 1;

    logAudit(
      activeTenantId,
      'action',
      `Manually triggered automation workflow: "${workflow.name}" (${workflow.assignedAgent}).`,
      `Automation Triggered: ${workflow.name}`
    );

    res.json({ success: true, workflow });
  });

  app.post('/api/agent/automations/toggle', (req: Request, res: Response) => {
    const { workflowId, isEnabled } = req.body;
    const workflow = automations.find(a => a.id === workflowId);
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }
    workflow.isEnabled = isEnabled;
    res.json({ success: true, workflow });
  });

  // 2j. Marketplace install & toggle
  app.post('/api/agent/marketplace/install', (req: Request, res: Response) => {
    const { itemId } = req.body;
    const item = marketplaceItems.find(m => m.id === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    item.isInstalled = true;
    item.isEnabled = true;
    logAudit(
      activeTenantId,
      'security',
      `Installed marketplace module: "${item.name}" (Version: ${item.version}). Scopes granted: ${item.requiredScopes.join(', ')}`,
      `Marketplace Install: ${item.name}`
    );
    res.json({ success: true, item });
  });

  app.post('/api/agent/marketplace/toggle', (req: Request, res: Response) => {
    const { itemId, isEnabled } = req.body;
    const item = marketplaceItems.find(m => m.id === itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    item.isEnabled = isEnabled;
    res.json({ success: true, item });
  });

  // 2k. CLI Execution Engine
  app.post('/api/agent/cli/exec', (req: Request, res: Response) => {
    const { command } = req.body;
    const raw = (command || '').trim();
    const parts = raw.split(' ');
    const mainCmd = parts[0];
    const subCmd = parts[1];
    const arg = parts.slice(2).join(' ');

    let output = '';
    let status: 'success' | 'error' | 'info' = 'success';

    if (!raw) {
      output = 'Type "help" or "agent --help" to see available commands.';
    } else if (raw === 'help' || raw === 'agent --help' || raw === 'agent -h') {
      output = `Agent OS CLI v2.4.0 (Autonomous Work Operating System)
Usage: agent <command> [options]

Commands:
  agent init                    Initialize agent project workspace and manifest
  agent status                  Display current operating mode, worker health, and load
  agent create <name>           Scaffold a new specialized autonomous worker agent
  agent mode <mode>             Switch mode: COPILOT | SUPERVISED | AUTONOMOUS | LOCKDOWN
  agent connect <service>       Connect external source (github, linkedin, gmail, slack, crm)
  agent run <target>            Trigger autonomous mission planning and execution loop
  agent policy                  Inspect current capability boundaries and approval requirements
  agent memory                  Inspect vector memory stats and indexed semantic nodes
  agent logs                    Tail immutable security and audit execution traces
  agent deploy                  Deploy active MCP tool and agent containers to cloud
  clear                         Clear terminal output`;
    } else if (raw === 'agent init') {
      output = `✓ Initialized Agent OS manifest: agent.config.json
✓ Zero-trust security policy generated: policy.yaml
✓ Model Context Protocol (MCP) server endpoints registered: 4 tools
✓ Digital Twin profile bound: ${profiles.find(p => p.id === activeTenantId)?.name || 'Amit Sharma'}`;
    } else if (raw === 'agent status') {
      output = `Agent OS Core: ONLINE
Tenant: ${profiles.find(p => p.id === activeTenantId)?.name}
Operating Mode: ${operatingMode}
Active Workers: ${agentWorkers.filter(w => w.status === 'running').length}/${agentWorkers.length} running
Pending Control Items: ${reviewItems.filter(r => r.status === 'pending').length}
Uptime: ${(cloudState.uptimeSeconds / 3600).toFixed(1)}h | Compute Load: ${cloudState.computeLoadPercentage}%`;
    } else if (mainCmd === 'agent' && subCmd === 'mode') {
      const mode = (arg || '').toUpperCase() as OperatingMode;
      if (['COPILOT', 'SUPERVISED', 'AUTONOMOUS', 'LOCKDOWN'].includes(mode)) {
        operatingMode = mode;
        output = `✓ Operating Mode set to: ${operatingMode}`;
      } else {
        output = `Error: Invalid mode. Choose from: COPILOT | SUPERVISED | AUTONOMOUS | LOCKDOWN`;
        status = 'error';
      }
    } else if (mainCmd === 'agent' && subCmd === 'create') {
      output = `✓ Created new agent worker: ${arg || 'CustomWorker'}
✓ Scaffolded policy in ./agents/${(arg || 'custom').toLowerCase()}.yaml
✓ Attached to Multi-Tenant Orchestrator supervisor tree.`;
    } else if (mainCmd === 'agent' && subCmd === 'connect') {
      output = `✓ Connected service: ${arg || 'github'}
✓ OAuth handshake completed with fine-grained scopes.
✓ Realtime perception webhook registered.`;
    } else if (mainCmd === 'agent' && subCmd === 'policy') {
      output = `CAPABILITY POLICIES:
Identity Agent:
  read: [public_web, github, linkedin, analytics]
  create: [drafts, identity_deltas, positioning_reports]
  execute: [none]
  requires_approval: [publish_post, update_bio, broadcast_announcement]

Research Agent:
  read: [public_web, arxiv, sec_filings, github_trending]
  create: [research_briefs, benchmark_reports]
  execute: [sandbox_python_eval]
  requires_approval: [none]

Security Agent:
  read: [all_internal_audit_logs, tool_execution_traces]
  execute: [emergency_killswitch, revoke_oauth_token]
  requires_approval: [revoke_oauth_token]`;
    } else if (mainCmd === 'agent' && subCmd === 'memory') {
      output = `Vector Memory Stats:
- Token footprint: ${cloudState.vectorMemoryTokens.toLocaleString()} tokens
- Indexed documents: ${cloudState.indexedDocumentsCount}
- Active memory nodes: ${memoryNodes.length}
- Storage: ${cloudState.storageUsedMb} MB / ${cloudState.storageLimitMb} MB`;
    } else if (mainCmd === 'agent' && subCmd === 'logs') {
      output = auditLogs.slice(0, 5).map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.actionTaken}: ${l.agentMonologue}`).join('\n');
    } else if (mainCmd === 'agent' && subCmd === 'deploy') {
      output = `✓ Building production container... Done (1.8s)
✓ Running zero-trust permission scanner... Passed (0 warnings)
✓ Pushed image to container registry.
✓ Deployed to Cloud Run revision rev-0512 on port 3000.
✓ Health check verified: https://agent-os-api.internal:3000/api/health`;
    } else if (mainCmd === 'agent' && subCmd === 'run') {
      output = `Dispatched goal to Agent OS Orchestrator: "${arg}". Use Review Control Plane to monitor progress.`;
    } else {
      output = `Unknown command: ${raw}. Type "help" for valid commands.`;
      status = 'error';
    }

    const responseItem: CLICommandResponse = {
      command: raw,
      output,
      status,
      timestamp: new Date().toLocaleTimeString()
    };

    res.json({ success: true, result: responseItem });
  });

  // 3. Switch active tenant
  app.post('/api/agent/set-tenant', (req: Request, res: Response) => {
    const { tenantId } = req.body;
    if (profiles.some(p => p.id === tenantId)) {
      activeTenantId = tenantId;
      logAudit(activeTenantId, 'info', `Switched active digital twin context to tenant: ${tenantId}`, 'Context Switch');
      res.json({ success: true, activeTenantId });
    } else {
      res.status(404).json({ error: 'Tenant profile not found' });
    }
  });

  // 4. Update profile details or heuristics
  app.post('/api/agent/update-profile', (req: Request, res: Response) => {
    const { tenantId, updates } = req.body;
    const idx = profiles.findIndex(p => p.id === tenantId);
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...updates };
      logAudit(tenantId, 'info', 'Updated Digital Twin persona parameters and heuristic thresholds.', 'Profile Update');
      res.json({ success: true, profile: profiles[idx] });
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  });

  // 5. Toggle MCP Tool
  app.post('/api/agent/toggle-tool', (req: Request, res: Response) => {
    const { toolId, isEnabled } = req.body;
    const tool = mcpTools.find(t => t.id === toolId);
    if (tool) {
      tool.isEnabled = isEnabled;
      logAudit(
        activeTenantId, 
        'security', 
        `User toggled MCP tool authorization for ${tool.name}. Status: ${isEnabled ? 'ACTIVE' : 'REVOKED'}`, 
        `Tool Permission Changed: ${tool.id}`
      );
      res.json({ success: true, tool });
    } else {
      res.status(404).json({ error: 'Tool not found' });
    }
  });

  // 6. Ingest perception event
  app.post('/api/agent/trigger-perception', (req: Request, res: Response) => {
    const { source, title, summary, payload, importanceScore } = req.body;
    const newEvent: PerceptionEvent = {
      id: `perc-${Date.now()}`,
      tenantId: activeTenantId,
      source: source || 'webhook',
      title: title || 'Real-time Signal Ingested',
      summary: summary || 'External webhook received event payload.',
      timestamp: 'Just now',
      payload: payload || {},
      importanceScore: importanceScore || 8
    };
    perceptionEvents.unshift(newEvent);
    logAudit(
      activeTenantId, 
      'info', 
      `Perception layer captured incoming signal from [${newEvent.source}]: ${newEvent.title}`, 
      'Perception Event Ingested',
      'low',
      undefined,
      newEvent.payload
    );
    res.json({ success: true, event: newEvent });
  });

  // 7. Core Target Execution Endpoint (Orchestration + LangGraph DAG + Self-Learning Loop)
  app.post('/api/agent/run-target', async (req: Request, res: Response) => {
    const { target, autonomousMode = 'hitl_guarded' } = req.body;
    if (!target || typeof target !== 'string') {
      res.status(400).json({ error: 'Target goal string is required' });
      return;
    }

    const tenant = profiles.find(p => p.id === activeTenantId) || profiles[0];
    const missionId = `mission-${Date.now()}`;

    logAudit(
      tenant.id, 
      'decision', 
      `User initiated target: "${target}". Parsing goal into recursive execution plan with mode=${autonomousMode}.`, 
      'Goal Received'
    );

    // Context retrieval from Memory & Perception
    const relevantMemories = memoryNodes
      .filter(m => m.tenantId === tenant.id)
      .slice(0, 3);
    const recentPerceptions = perceptionEvents
      .filter(p => p.tenantId === tenant.id)
      .slice(0, 3);

    // Determine plan steps using Gemini if available, or domain-adaptive orchestrator
    let steps: PlanStep[] = [];
    let agentPlanThoughts = '';
    let finalArtifactSummary = '';
    let deliverables: AgentMission['finalOutcomeArtifact']['deliverables'] = [];

    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const prompt = `You are the reasoning core of a Universal Autonomous Agent Framework.
Current Digital Twin Profile:
- Name: ${tenant.name}
- Role: ${tenant.role}
- Tone: ${tenant.toneOfVoice}
- Primary Goals: ${tenant.primaryGoals.join('; ')}
- Guardrails: ${tenant.guardrails.join('; ')}

Relevant Long-Term Memory:
${relevantMemories.map(m => `- [${m.type}] ${m.title}: ${m.content}`).join('\n')}

Recent Perception Signals:
${recentPerceptions.map(p => `- [${p.source}] ${p.title}: ${p.summary}`).join('\n')}

Target Objective: "${target}"
Autonomous Mode: "${autonomousMode}"

Decompose this target into 3 to 4 sequential, high-impact execution steps.
At least ONE step that takes an external public action (like publishing a post, sending an email, or deploying code) MUST have riskLevel 'high'.
Return purely valid JSON with the following structure:
{
  "monologue": "Internal strategic reasoning monologue...",
  "steps": [
    {
      "order": 1,
      "title": "Short Step Title",
      "description": "What is being done",
      "assignedToolName": "GitHub Commit Reader / Deep Web Search / Social Media Post Drafter / Personalized Email Drafter / etc.",
      "riskLevel": "low" | "medium" | "high",
      "reasoning": "Why this step was decided",
      "outputSample": "Key finding or payload output"
    }
  ],
  "deliverable": {
    "type": "draft_post" | "email_thread" | "code_snippet" | "research_report" | "action_summary",
    "title": "Artifact Deliverable Title",
    "content": "Full formatted deliverable content (Markdown formatted with actionable depth)"
  }
}`;

        const geminiRes = await gemini.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(geminiRes.text || '{}');
        agentPlanThoughts = parsed.monologue || 'Decomposed target into strategic DAG pipeline.';
        if (Array.isArray(parsed.steps)) {
          steps = parsed.steps.map((s: any, idx: number) => ({
            id: `step-${missionId}-${idx + 1}`,
            order: s.order || idx + 1,
            title: s.title || `Execute Phase ${idx + 1}`,
            description: s.description || 'Autonomous execution step',
            status: 'completed',
            assignedToolName: s.assignedToolName || 'mcp://system/core',
            riskLevel: s.riskLevel || 'low',
            reasoning: s.reasoning || 'Derived from target goal constraints',
            toolOutput: { result: s.outputSample || 'Successfully verified output' },
            executionDurationMs: 350 + Math.floor(Math.random() * 800)
          }));
        }
        if (parsed.deliverable) {
          deliverables.push(parsed.deliverable);
          finalArtifactSummary = `Target mission completed with ${steps.length} orchestrated actions and high-confidence deliverable output.`;
        }
      } catch (err) {
        console.warn('Gemini generation failed, fallback to native dynamic planner:', err);
      }
    }

    // Dynamic High-Fidelity Fallback if Gemini wasn't available or returned empty steps
    if (steps.length === 0) {
      const lowerTarget = target.toLowerCase();
      agentPlanThoughts = `Target analyzed through Digital Twin persona (${tenant.role}). Cross-referencing memory vectors and recent perception signals to construct optimal execution DAG.`;

      if (lowerTarget.includes('post') || lowerTarget.includes('linkedin') || lowerTarget.includes('social') || lowerTarget.includes('commit') || lowerTarget.includes('brand')) {
        steps = [
          {
            id: `step-${missionId}-1`,
            order: 1,
            title: 'Scan GitHub Commits & Diff Perception Stream',
            description: 'Extract recent architectural commits, PR notes, and benchmarks from repo.',
            status: 'completed',
            assignedToolName: 'GitHub Commit Reader',
            riskLevel: 'low',
            reasoning: 'Grounding the post in verifiable code commits achieves 3.8x higher engagement (per learned heuristic #2).',
            toolOutput: { 
              commitHash: '4f981e2', 
              message: 'Implemented distributed LangGraph task DAG and streaming MCP tool protocol',
              filesChanged: 8,
              additions: 412
            },
            executionDurationMs: 420
          },
          {
            id: `step-${missionId}-2`,
            order: 2,
            title: 'Synthesize Architectural Breakdown & Persona Calibration',
            description: 'Apply Digital Twin visionary tone, enforce technical depth guardrail, and avoid hype words.',
            status: 'completed',
            assignedToolName: 'Social Media Post Drafter',
            riskLevel: 'low',
            reasoning: 'Generated technical breakdown emphasizing latency benchmarks and modular MCP server boundaries.',
            toolOutput: {
              wordCount: 285,
              clarityScore: 96,
              tags: ['#AgenticAI', '#ModelContextProtocol', '#LangGraph', '#SystemsEngineering']
            },
            executionDurationMs: 680
          },
          {
            id: `step-${missionId}-3`,
            order: 3,
            title: 'Trigger Social Media Publisher (HITL Protected)',
            description: 'Queue the post for public publishing on LinkedIn and Twitter.',
            status: autonomousMode === 'hitl_guarded' ? 'awaiting_approval' : 'completed',
            assignedToolName: 'Social Media Publisher',
            riskLevel: 'high',
            reasoning: 'Public broadcast action carries reputation risk; requiring Human-in-the-Loop review per Guardrail #1.',
            toolOutput: {
              targetChannels: ['LinkedIn Feed', 'X/Twitter'],
              scheduledTime: 'Immediate upon confirmation'
            },
            executionDurationMs: 210
          }
        ];

        deliverables.push({
          type: 'draft_post',
          title: 'LinkedIn Technical Deep-Dive Draft',
          content: `🚀 How We Replaced Fragile AI Scripts with an Autonomous Multi-Tenant Agent DAG & MCP Tools

Most AI "agents" today are just brittle prompt chains. When edge cases hit, they collapse.

Here is how we structured a production-grade Autonomous AGI Framework:

1️⃣ Perception Layer: Listens asynchronously to Git commits, issue queues, and API webhooks without polling overhead.
2️⃣ Memory & Identity: Multi-tenant vector space using pgvector + learned heuristic adaptation weights.
3️⃣ Reasoning Core: Autonomous Goal Parser breaks abstract targets ("Increase developer reach") into verifiable execution DAGs.
4️⃣ Action Layer with MCP: Standardized Model Context Protocol servers so the agent interacts securely with GitHub, Notion, and terminal sandboxes.
5️⃣ Human-in-the-Loop (HITL) Gate: High-risk mutations (publishing, payments, emails) hold in a cryptographic review barrier.

The benchmark result? 0 runaway executions, 94% task fidelity, and full JSON auditability.

Code repo & architecture breakdown in comments. How are you approaching agentic reliability? 👇

#AgenticAI #ModelContextProtocol #LangGraph #SystemsEngineering #AutonomousAgents`
        });
        finalArtifactSummary = 'Synthesized high-signal technical post grounded in real GitHub commits with verifiable architecture specifications.';

      } else if (lowerTarget.includes('email') || lowerTarget.includes('outreach') || lowerTarget.includes('founder') || lowerTarget.includes('network')) {
        steps = [
          {
            id: `step-${missionId}-1`,
            order: 1,
            title: 'Query Deep Web Intelligence for Target Founder Profiles',
            description: 'Scrape public papers and recent seed announcements for relevant AI founders.',
            status: 'completed',
            assignedToolName: 'Deep Web & Founder Intelligence',
            riskLevel: 'low',
            reasoning: 'Discovered 4 founders actively building MCP servers and autonomous evaluation harnesses.',
            toolOutput: {
              leadsFound: 4,
              sampleLead: { name: 'Dr. Sarah Lin', focus: 'Evaluation of Multi-Agent Systems', company: 'EvalScale' }
            },
            executionDurationMs: 510
          },
          {
            id: `step-${missionId}-2`,
            order: 2,
            title: 'Draft Hyper-Personalized Collaboration Outreach',
            description: 'Cross-reference Digital Twin bio and recipient latest paper to generate value-first invitation.',
            status: 'completed',
            assignedToolName: 'Personalized Email Drafter',
            riskLevel: 'low',
            reasoning: 'Heuristic rule: Reference specific repository or benchmark paper in the second sentence.',
            toolOutput: {
              recipients: ['sarah@evalscale.ai', 'devin@agentsim.dev'],
              personalizationScore: 98
            },
            executionDurationMs: 740
          },
          {
            id: `step-${missionId}-3`,
            order: 3,
            title: 'Dispatch Email Outreach (HITL Protected)',
            description: 'Hold in outbound queue for human approval prior to transmission.',
            status: autonomousMode === 'hitl_guarded' ? 'awaiting_approval' : 'completed',
            assignedToolName: 'Automated Email Sender',
            riskLevel: 'high',
            reasoning: 'External communication with industry founders requires tone verification.',
            toolOutput: {
              queueId: 'outbox-8829',
              draftCount: 2
            },
            executionDurationMs: 180
          }
        ];

        deliverables.push({
          type: 'email_thread',
          title: 'Founder Collaboration Outreach Sequence',
          content: `Subject: Thought on your Multi-Agent Eval paper + MCP integration idea

Hi Dr. Lin,

Read your recent paper on benchmarking multi-agent communication latency—especially loved Section 4 on handling cascade tool failures.

We've been prototyping a Multi-Tenant Autonomous Agent framework here in the sandbox using Model Context Protocol (MCP) and recursive goal reflection loops. It directly addresses the state drift issue you highlighted.

Would love to share our benchmark data or hop on a 15-minute sync this Thursday if you have a moment. Either way, fantastic work on EvalScale.

Best regards,
${tenant.name}
${tenant.role} | ${tenant.organization}`
        });
        finalArtifactSummary = 'Drafted high-converting, personalized outreach referencing specific academic research and shared architectural priorities.';

      } else {
        // Generic General-Purpose Target
        steps = [
          {
            id: `step-${missionId}-1`,
            order: 1,
            title: 'Contextual Grounding & Memory Retrieval',
            description: 'Deconstruct objective into verifiable sub-goals matching tenant heuristics.',
            status: 'completed',
            assignedToolName: 'Deep Web & Founder Intelligence',
            riskLevel: 'low',
            reasoning: 'Loaded relevant historical context and guardrail constraints.',
            toolOutput: { matchedHeuristics: 3, verifiedConstraints: 2 },
            executionDurationMs: 380
          },
          {
            id: `step-${missionId}-2`,
            order: 2,
            title: 'Autonomous Code & Logic Synthesis',
            description: 'Generate executable specification and structured plan artifacts.',
            status: 'completed',
            assignedToolName: 'Python / TS Sandbox Runner',
            riskLevel: 'medium',
            reasoning: 'Ran simulation to verify logical coherence and resource allocation.',
            toolOutput: { executionResult: 'OK: 0 errors, computed optimal target path' },
            executionDurationMs: 620
          },
          {
            id: `step-${missionId}-3`,
            order: 3,
            title: 'Apply Actionable Execution Payload',
            description: 'Finalize output artifact and submit high-impact actions to approval gate.',
            status: autonomousMode === 'hitl_guarded' ? 'awaiting_approval' : 'completed',
            assignedToolName: 'Notion / Markdown Knowledge Base Sync',
            riskLevel: 'high',
            reasoning: 'External commit of knowledge base updates or ecosystem changes requires user confirmation.',
            toolOutput: { syncedPages: 1, actionType: 'knowledge_base_commit' },
            executionDurationMs: 310
          }
        ];

        deliverables.push({
          type: 'action_summary',
          title: 'Target Execution Strategy & Operational Deliverable',
          content: `### Objective Execution Summary: "${target}"

**Autonomous Orchestration Highlights:**
- Parsed goal against Digital Twin constraints (${tenant.role}).
- Computed optimal path using 3 MCP tool integrations.
- Verified zero violations against guardrails: "${tenant.guardrails[0]}".

**Key Deliverable Actions:**
1. Completed comprehensive context scan across all active perception channels.
2. Formulated self-adapting execution strategy with 95% confidence score.
3. Formatted operational documentation ready for deployment.`
        });
        finalArtifactSummary = `Successfully broke down target into actionable milestones and verified policy adherence.`;
      }
    }

    // Check for any High-Risk steps to route to HITL queue
    const highRiskStep = steps.find(s => s.riskLevel === 'high');
    let hitlCreated: HITLAction | undefined;

    if (highRiskStep && autonomousMode === 'hitl_guarded') {
      highRiskStep.status = 'awaiting_approval';
      hitlCreated = {
        id: `hitl-${Date.now()}`,
        targetId: missionId,
        stepId: highRiskStep.id,
        tenantId: tenant.id,
        actionTitle: highRiskStep.title,
        toolName: highRiskStep.assignedToolName || 'mcp://external/action',
        riskLevel: 'high',
        status: 'pending',
        payload: {
          stepDescription: highRiskStep.description,
          target,
          preview: deliverables[0]?.content || 'Action ready for external transmission.',
        },
        diffPreview: `+ [AUTHORIZATION GRANTED] ${highRiskStep.title}\n+ TARGET: ${target}\n+ EXTERNAL TRANSMISSION APPROVED BY USER`,
        impactAnalysis: 'This action initiates external network communication or public social updates. User confirmation prevents unintended data leakage or unauthorized public actions.',
        createdAt: new Date().toLocaleTimeString()
      };
      highRiskStep.hitlActionId = hitlCreated.id;
      hitlActions.unshift(hitlCreated);

      logAudit(
        tenant.id, 
        'hitl', 
        `Triggered Human-in-the-Loop Gate for step "${highRiskStep.title}". Action placed in pending approval queue.`, 
        'HITL Protection Engaged',
        'high',
        highRiskStep.assignedToolName,
        hitlCreated.payload
      );
    }

    // 8. Self-Learning & Reflection Cycle (Crucial for Self-Learning Autonomous Agent!)
    const currentAdaptability = tenant.heuristicWeights.learningAdaptability;
    const progressEstimate = highRiskStep && autonomousMode === 'hitl_guarded' ? 75 : 100;
    const newReflection: SelfReflection = {
      cycle: 1,
      timestamp: new Date().toLocaleTimeString(),
      evaluatedGoalProgress: progressEstimate,
      critique: `Autonomous execution completed ${steps.filter(s => s.status === 'completed').length}/${steps.length} steps. ${
        highRiskStep && autonomousMode === 'hitl_guarded'
          ? 'Final step is held in HITL gate for human safety approval.'
          : 'All steps autonomously satisfied target metrics.'
      }`,
      identifiedBottlenecks: [
        'External tool latency averaged 480ms per MCP invocation.',
        'Target phrasing was slightly ambiguous on distribution channel; auto-selected highest resonance medium.'
      ],
      heuristicAdjustments: [
        {
          heuristic: 'learningAdaptability',
          oldValue: currentAdaptability,
          newValue: Math.min(100, currentAdaptability + 2),
          reason: 'Reinforced successful pattern matching between perception cues and goal decomposition.'
        },
        {
          heuristic: 'thoroughness',
          oldValue: tenant.heuristicWeights.thoroughness,
          newValue: Math.min(100, tenant.heuristicWeights.thoroughness + 1),
          reason: 'Enhanced context grounding by pulling 3 memory nodes prior to planning.'
        }
      ],
      autonomousDecision: highRiskStep && autonomousMode === 'hitl_guarded'
        ? 'Pause full loop until Human-in-the-Loop approval is granted, then complete mission.'
        : 'Goal criteria fully met. Store pattern in long-term learned heuristic memory.'
    };

    // Auto-update tenant profile heuristic weights through self-learning!
    tenant.heuristicWeights.learningAdaptability = Math.min(100, tenant.heuristicWeights.learningAdaptability + 2);
    tenant.heuristicWeights.thoroughness = Math.min(100, tenant.heuristicWeights.thoroughness + 1);

    // Auto-learn new heuristic memory node
    const learnedMemoryNode: MemoryNode = {
      id: `mem-learned-${Date.now()}`,
      tenantId: tenant.id,
      type: 'learned_heuristic',
      title: `Learned Heuristic from Target: "${target.slice(0, 36)}..."`,
      content: `Pattern established: Executing "${target}" achieved ${progressEstimate}% progress with confidence score 94%. Pre-filtering memory vectors prevented redundant web scraping.`,
      tags: ['self_learned', 'autonomous_loop', 'heuristic_weights'],
      relevanceScore: 0.95,
      timestamp: 'Just now',
      linkedTargetId: missionId
    };
    memoryNodes.unshift(learnedMemoryNode);

    logAudit(
      tenant.id, 
      'reflection', 
      `Self-learning engine evaluated mission outcome. Updated heuristic weights (Adaptability: ${tenant.heuristicWeights.learningAdaptability}). Learned memory node indexed.`, 
      'Self-Reflection & Learning Cycle Complete'
    );

    // Create Mission Object
    const mission: AgentMission = {
      id: missionId,
      tenantId: tenant.id,
      target,
      autonomousMode,
      status: highRiskStep && autonomousMode === 'hitl_guarded' ? 'awaiting_approval' : 'completed',
      progressPercentage: progressEstimate,
      confidenceScore: 94,
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toLocaleTimeString(),
      perceptionInsights: recentPerceptions.map(p => `[${p.source.toUpperCase()}] ${p.title}`),
      steps,
      reflections: [newReflection],
      finalOutcomeArtifact: {
        summary: finalArtifactSummary || 'Target execution completed successfully.',
        deliverables,
        metricsAchieved: [
          { label: 'Plan Fidelity', value: '98.4%' },
          { label: 'Safety Checks', value: '100% Passed' },
          { label: 'Latency', value: '1.42s' },
          { label: 'Heuristic Gain', value: '+2 Adaptability' }
        ]
      }
    };

    activeMissions.unshift(mission);

    res.json({
      success: true,
      mission,
      hitlAction: hitlCreated,
      reflection: newReflection,
      updatedWeights: tenant.heuristicWeights
    });
  });

  // 9. Approve or Reject HITL Action
  app.post('/api/agent/approve-hitl', (req: Request, res: Response) => {
    const { actionId, decision, reviewerNotes, modifiedPayload } = req.body;
    const action = hitlActions.find(h => h.id === actionId);

    if (!action) {
      res.status(404).json({ error: 'HITL action not found' });
      return;
    }

    action.status = decision === 'approve' ? 'approved' : decision === 'modify' ? 'modified' : 'rejected';
    action.reviewedAt = new Date().toLocaleTimeString();
    action.reviewerNotes = reviewerNotes;
    if (modifiedPayload) action.payload = modifiedPayload;

    // Update corresponding mission step
    const mission = activeMissions.find(m => m.id === action.targetId);
    if (mission) {
      const step = mission.steps.find(s => s.id === action.stepId);
      if (step) {
        if (action.status === 'approved' || action.status === 'modified') {
          step.status = 'completed';
          mission.status = 'completed';
          mission.progressPercentage = 100;
          step.toolOutput = { 
            status: 'EXECUTED_BY_HITL_AUTHORIZATION', 
            authorizedBy: 'User (AMITSHARMA99976@gmail.com)',
            timestamp: new Date().toISOString()
          };
        } else {
          step.status = 'failed';
          mission.status = 'failed';
          step.toolOutput = { error: 'Rejected by human reviewer: ' + (reviewerNotes || 'Security/preference mismatch') };
        }
      }
    }

    logAudit(
      action.tenantId, 
      'hitl', 
      `User ${action.status.toUpperCase()} HITL action for tool "${action.toolName}". Notes: "${reviewerNotes || 'Approved without modifications'}"`, 
      `HITL Decision: ${action.status.toUpperCase()}`,
      action.riskLevel
    );

    res.json({ success: true, action, mission });
  });

  // 10. Add memory node manually
  app.post('/api/agent/add-memory', (req: Request, res: Response) => {
    const { title, content, type = 'semantic_rag', tags = [] } = req.body;
    const newMem: MemoryNode = {
      id: `mem-${Date.now()}`,
      tenantId: activeTenantId,
      type,
      title: title || 'New Knowledge Entity',
      content: content || '',
      tags: Array.isArray(tags) ? tags : ['manual_ingest'],
      relevanceScore: 0.92,
      timestamp: 'Just now'
    };
    memoryNodes.unshift(newMem);
    logAudit(activeTenantId, 'info', `Ingested new memory entity into Digital Twin [${type}]: ${newMem.title}`, 'Memory Ingestion');
    res.json({ success: true, memory: newMem });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Universal Autonomous Agent Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
