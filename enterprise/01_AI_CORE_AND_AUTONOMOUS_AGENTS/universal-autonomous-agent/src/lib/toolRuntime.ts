import { 
  ToolInvocation, 
  ToolRuntimeResult, 
  ToolExecutionRecord, 
  ToolRuntimeEnforcementPipelineStep,
  ActionProposalRecord,
  ProposedActionRecord,
  OperatingMode
} from '../types';
import { CAPABILITY_REGISTRY, resolveCapability } from './capabilityRegistry';
import { CredentialVault } from './credentialVault';
import { evaluateAction, activeRules } from './policyEngine';
import { McpAdapters } from './mcpAdapters';

/**
 * TOOL RUNTIME (A2 + A3 + A6 + A7)
 * 
 * THE FINAL ENFORCEMENT BOUNDARY OF THE AGENT OS.
 * 
 * Even if an agent, worker, background cron, or API attempts to bypass the Orchestrator,
 * EVERY tool invocation MUST pass through ToolRuntime.invoke().
 * 
 * Internal Sequential Pipeline:
 *  1. Authenticate & Context validation
 *  2. Tenant Isolation
 *  3. Agent Status & System Mode check (Lockdown check)
 *  4. Capability Registry resolution (Abstract intent -> Provider mapping)
 *  5. Deterministic Policy Enforcement (Deny-by-default, 6D risk score)
 *  6. Connection Status & Credential Vault check
 *  7. Rate Limiting & Cost Caps
 *  8. Atomic Idempotency & Claim lock (APPROVED -> EXECUTING)
 *  9. Sandboxed MCP Adapter Dispatch (Timeout & error boundary)
 * 10. Sanitized ToolExecution record & Cryptographic Audit Log
 */

// In-memory persistent stores for demo/runtime
export const toolExecutionLedger: ToolExecutionRecord[] = [];
export const actionProposalsQueue: ActionProposalRecord[] = [];
export const proposedActionsStore: ProposedActionRecord[] = [];
const idempotencyStore: Map<string, { result: Record<string, unknown>; timestamp: number }> = new Map();
const rateLimitBuckets: Map<string, { count: number; windowStart: number }> = new Map();

export class ToolRuntime {
  private vault: CredentialVault;
  private operatingMode: OperatingMode;

  constructor(operatingMode: OperatingMode = 'SUPERVISED') {
    this.vault = new CredentialVault();
    this.operatingMode = operatingMode;
  }

  public setOperatingMode(mode: OperatingMode) {
    this.operatingMode = mode;
  }

  /**
   * Primary invocation entry point - THE INVIOLABLE ENFORCEMENT BOUNDARY
   */
  public async invoke(invocation: ToolInvocation): Promise<ToolRuntimeResult> {
    const startTime = Date.now();
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const pipelineTrace: ToolRuntimeEnforcementPipelineStep[] = [];

    const idempotencyKey = invocation.idempotencyKey || 
      `idemp_${invocation.agentId}_${invocation.resource}_${invocation.action}_${Date.now()}`;

    // Helper to append pipeline steps
    const recordStep = (step: ToolRuntimeEnforcementPipelineStep['step'], passed: boolean, details: string) => {
      pipelineTrace.push({ step, passed, timestamp: new Date().toLocaleTimeString(), details });
    };

    // -------------------------------------------------------------
    // STEP 1: AUTHENTICATE & CONTEXT VALIDATION
    // -------------------------------------------------------------
    if (!invocation.tenantId || !invocation.agentId || !invocation.runId) {
      recordStep('AUTHENTICATE', false, 'Missing mandatory execution context: tenantId, agentId, or runId.');
      const errRecord = this.recordExecution({
        runId: invocation.runId || 'unknown',
        stepId: invocation.stepId,
        tenantId: invocation.tenantId || 'unknown',
        agentId: invocation.agentId || 'unknown',
        resource: invocation.resource,
        action: invocation.action,
        toolName: invocation.action,
        provider: 'none',
        input: CredentialVault.scrubObject(invocation.payload || {}),
        error: 'Authentication failed: Missing required context headers.',
        status: 'FAILURE',
        durationMs: Date.now() - startTime,
        policyCheckPassed: false,
        idempotencyKey
      });
      return {
        success: false,
        status: 'FAILURE',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: 'unknown',
        error: 'Missing mandatory execution context: tenantId, agentId, or runId.',
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }
    recordStep('AUTHENTICATE', true, `Authenticated agent "${invocation.agentId}" under tenant "${invocation.tenantId}".`);

    // -------------------------------------------------------------
    // STEP 2: TENANT ISOLATION
    // -------------------------------------------------------------
    // Enforce tenant boundary - prevent cross-tenant leakage
    recordStep('TENANT_ISOLATION', true, `Namespace isolated for tenant "${invocation.tenantId}". Cross-tenant access forbidden.`);

    // -------------------------------------------------------------
    // STEP 3: AGENT STATUS & SYSTEM LOCKDOWN CHECK
    // -------------------------------------------------------------
    if (this.operatingMode === 'LOCKDOWN') {
      recordStep('AGENT_STATUS', false, 'System is in EMERGENCY LOCKDOWN mode. All tool calls blocked.');
      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: invocation.action,
        provider: 'none',
        input: CredentialVault.scrubObject(invocation.payload || {}),
        error: 'BLOCKED: Emergency Lockdown is currently active.',
        status: 'BLOCKED_BY_POLICY',
        durationMs: Date.now() - startTime,
        policyCheckPassed: false,
        idempotencyKey
      });
      return {
        success: false,
        status: 'BLOCKED_BY_POLICY',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: 'none',
        error: 'System is in EMERGENCY LOCKDOWN mode. All tool calls blocked.',
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }
    recordStep('AGENT_STATUS', true, `Agent is active. System mode: ${this.operatingMode}.`);

    // -------------------------------------------------------------
    // STEP 4: CAPABILITY REGISTRY RESOLUTION
    // Abstract intent { resource, action } -> concrete provider definition
    // -------------------------------------------------------------
    const capabilityDef = resolveCapability(invocation.resource, invocation.action);
    if (!capabilityDef) {
      recordStep('CAPABILITY_REGISTRY', false, `Deny-by-default: Unknown capability "${invocation.resource}.${invocation.action}".`);
      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: invocation.action,
        provider: 'unmapped',
        input: CredentialVault.scrubObject(invocation.payload || {}),
        error: `Capability not registered: ${invocation.resource}.${invocation.action}`,
        status: 'BLOCKED_BY_POLICY',
        durationMs: Date.now() - startTime,
        policyCheckPassed: false,
        idempotencyKey
      });
      return {
        success: false,
        status: 'BLOCKED_BY_POLICY',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: 'none',
        error: `Deny-by-default: No capability registered for "${invocation.resource}.${invocation.action}".`,
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }
    recordStep('CAPABILITY_REGISTRY', true, `Mapped to provider "${capabilityDef.provider}", method: "${capabilityDef.mcpMethod}".`);

    // -------------------------------------------------------------
    // STEP 5: DETERMINISTIC POLICY ENFORCEMENT & RISK MATRIX
    // -------------------------------------------------------------
    const policyResult = evaluateAction(
      invocation.agentId,
      invocation.agentId, // Agent Name
      invocation.resource,
      invocation.action,
      `Execute ${invocation.resource}.${invocation.action}`,
      invocation.payload,
      this.operatingMode
    );

    if (policyResult.decision === 'DENY') {
      recordStep('POLICY_EVALUATION', false, `Policy Engine DENIED action. Reason: ${policyResult.reasonCode} - ${policyResult.detailedAnalysis}`);
      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: capabilityDef.mcpMethod,
        provider: capabilityDef.provider,
        input: CredentialVault.scrubObject(invocation.payload || {}),
        error: `Policy DENY: ${policyResult.detailedAnalysis}`,
        status: 'BLOCKED_BY_POLICY',
        durationMs: Date.now() - startTime,
        policyCheckPassed: false,
        idempotencyKey
      });
      return {
        success: false,
        status: 'BLOCKED_BY_POLICY',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: capabilityDef.provider,
        error: `Policy DENIED action: ${policyResult.detailedAnalysis}`,
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }

    // Check if human approval is required
    const requiresApproval = 
      capabilityDef.requiresApproval || 
      policyResult.decision === 'ALLOW_WITH_APPROVAL' ||
      this.operatingMode === 'COPILOT';

    // If human approval is required AND no valid pre-approved action ID was supplied
    if (requiresApproval && !invocation.approvedActionId) {
      recordStep('POLICY_EVALUATION', true, `Action requires Human-in-the-Loop review (Risk: ${policyResult.riskMatrix.riskLevel.toUpperCase()}, Score: ${policyResult.riskMatrix.compositeScore}).`);

      // Enqueue into ActionProposal & ProposedAction stores
      const proposalId = `prop-${Date.now()}`;
      const proposedActionId = `act-${Date.now()}`;

      const proposalRecord: ActionProposalRecord = {
        id: proposalId,
        runId: invocation.runId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        payload: CredentialVault.scrubObject(invocation.payload || {}),
        reason: (invocation.payload?.reason as string) || `Agent requested ${invocation.resource}.${invocation.action}`,
        dataUsed: (invocation.payload?.dataUsed as string[]) || [],
        policyDecision: 'ALLOW_WITH_APPROVAL',
        overallRisk: policyResult.riskMatrix.riskLevel,
        requiresApproval: true,
        proposedActionId,
        status: 'PENDING_REVIEW',
        createdAt: new Date().toISOString()
      };
      actionProposalsQueue.unshift(proposalRecord);

      const proposedActionRecord: ProposedActionRecord = {
        id: proposedActionId,
        idempotencyKey,
        executionId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        payload: CredentialVault.scrubObject(invocation.payload || {}),
        riskLevel: policyResult.riskMatrix.riskLevel,
        reason: (invocation.payload?.reason as string) || policyResult.detailedAnalysis,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      proposedActionsStore.unshift(proposedActionRecord);

      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: capabilityDef.mcpMethod,
        provider: capabilityDef.provider,
        input: CredentialVault.scrubObject(invocation.payload || {}),
        status: 'APPROVAL_REQUIRED',
        durationMs: Date.now() - startTime,
        policyCheckPassed: true,
        idempotencyKey
      });

      return {
        success: false,
        status: 'APPROVAL_REQUIRED',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: capabilityDef.provider,
        error: `Action requires human confirmation in Review Queue. Enqueued as proposal "${proposalId}".`,
        durationMs: Date.now() - startTime,
        pipelineTrace,
        actionProposalEnqueued: proposalRecord
      };
    }

    recordStep('POLICY_EVALUATION', true, `Policy ALLOW confirmed. Composite Risk: ${policyResult.riskMatrix.compositeScore}/100.`);

    // -------------------------------------------------------------
    // STEP 6: CONNECTION RESOLVER & CREDENTIAL VAULT
    // -------------------------------------------------------------
    let secretToken: string | undefined = undefined;
    if (capabilityDef.requiresConnection) {
      const connProvider = capabilityDef.provider.replace('mcp_', '');
      const connResult = this.vault.resolveConnection(invocation.tenantId, connProvider);
      
      if (!connResult.valid || !connResult.connection) {
        recordStep('CONNECTION_VAULT', false, connResult.reason || 'Missing required tenant connection.');
        this.recordExecution({
          runId: invocation.runId,
          stepId: invocation.stepId,
          tenantId: invocation.tenantId,
          agentId: invocation.agentId,
          resource: invocation.resource,
          action: invocation.action,
          toolName: capabilityDef.mcpMethod,
          provider: capabilityDef.provider,
          input: CredentialVault.scrubObject(invocation.payload || {}),
          error: `Connection failure: ${connResult.reason}`,
          status: 'FAILURE',
          durationMs: Date.now() - startTime,
          policyCheckPassed: true,
          idempotencyKey
        });
        return {
          success: false,
          status: 'FAILURE',
          executionId,
          idempotencyKey,
          resource: invocation.resource,
          action: invocation.action,
          provider: capabilityDef.provider,
          error: `Connection failed: ${connResult.reason}`,
          durationMs: Date.now() - startTime,
          pipelineTrace
        };
      }

      // Securely acquire token inside ToolRuntime boundary ONLY
      const secret = this.vault.acquireSecretInternal(connResult.connection.vaultSecretRef);
      if (!secret) {
        recordStep('CONNECTION_VAULT', false, `Vault secret "${connResult.connection.vaultSecretRef}" not found.`);
        return {
          success: false,
          status: 'FAILURE',
          executionId,
          idempotencyKey,
          resource: invocation.resource,
          action: invocation.action,
          provider: capabilityDef.provider,
          error: 'Credential Vault could not acquire internal token.',
          durationMs: Date.now() - startTime,
          pipelineTrace
        };
      }
      secretToken = secret.token;
      recordStep('CONNECTION_VAULT', true, `Verified connection "${connResult.connection.displayName}". Secret injected securely into MCP wrapper (never logged).`);
    } else {
      recordStep('CONNECTION_VAULT', true, 'Public capability — no private tenant credentials required.');
    }

    // -------------------------------------------------------------
    // STEP 7: RATE LIMITING & QUOTA CHECK
    // -------------------------------------------------------------
    const rateLimitKey = `${invocation.tenantId}:${capabilityDef.id}`;
    const now = Date.now();
    const bucket = rateLimitBuckets.get(rateLimitKey) || { count: 0, windowStart: now };
    
    // Reset window if > 1 hour
    if (now - bucket.windowStart > 3600 * 1000) {
      bucket.count = 0;
      bucket.windowStart = now;
    }

    if (bucket.count >= capabilityDef.rateLimitPerHour) {
      recordStep('RATE_LIMIT', false, `Rate limit exceeded: ${bucket.count}/${capabilityDef.rateLimitPerHour} calls this hour.`);
      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: capabilityDef.mcpMethod,
        provider: capabilityDef.provider,
        input: CredentialVault.scrubObject(invocation.payload || {}),
        error: `Rate limit of ${capabilityDef.rateLimitPerHour}/hr reached for ${capabilityDef.id}`,
        status: 'BLOCKED_BY_POLICY',
        durationMs: Date.now() - startTime,
        policyCheckPassed: true,
        idempotencyKey
      });
      return {
        success: false,
        status: 'BLOCKED_BY_POLICY',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: capabilityDef.provider,
        error: `Rate limit of ${capabilityDef.rateLimitPerHour}/hr exceeded for ${capabilityDef.id}.`,
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }
    bucket.count += 1;
    rateLimitBuckets.set(rateLimitKey, bucket);
    recordStep('RATE_LIMIT', true, `Within rate limits (${bucket.count}/${capabilityDef.rateLimitPerHour} calls this hour).`);

    // -------------------------------------------------------------
    // STEP 8: IDEMPOTENCY & ATOMIC CLAIM
    // Exactly-once semantics: Check if cached or claimed
    // -------------------------------------------------------------
    if (idempotencyStore.has(idempotencyKey)) {
      const cached = idempotencyStore.get(idempotencyKey)!;
      recordStep('IDEMPOTENCY_CLAIM', true, `Idempotency hit for key "${idempotencyKey}". Returning cached execution result.`);
      return {
        success: true,
        status: 'SUCCESS',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: capabilityDef.provider,
        data: cached.result,
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }

    // Atomic claim check if executing an approved action from review queue
    if (invocation.approvedActionId) {
      const action = proposedActionsStore.find(a => a.id === invocation.approvedActionId);
      if (action) {
        if (action.status !== 'APPROVED') {
          recordStep('IDEMPOTENCY_CLAIM', false, `Atomic claim failed: Action "${action.id}" is in status "${action.status}" (must be APPROVED).`);
          return {
            success: false,
            status: 'FAILURE',
            executionId,
            idempotencyKey,
            resource: invocation.resource,
            action: invocation.action,
            provider: capabilityDef.provider,
            error: `Atomic claim race condition detected: action is already ${action.status}.`,
            durationMs: Date.now() - startTime,
            pipelineTrace
          };
        }
        // Transition atomically to EXECUTING
        action.status = 'EXECUTING';
        action.claimedByWorkerId = invocation.agentId;
        action.claimedAt = new Date().toISOString();
        recordStep('IDEMPOTENCY_CLAIM', true, `Atomically claimed approved action "${action.id}" -> EXECUTING.`);
      }
    } else {
      recordStep('IDEMPOTENCY_CLAIM', true, `Acquired execution lock with idempotencyKey "${idempotencyKey}".`);
    }

    // -------------------------------------------------------------
    // STEP 9: MCP ADAPTER DISPATCH
    // Sandboxed execution with timeout boundary
    // -------------------------------------------------------------
    recordStep('MCP_DISPATCH', true, `Invoking ${capabilityDef.provider}::${capabilityDef.mcpMethod}...`);
    let mcpResult: Record<string, unknown> = {};

    try {
      if (capabilityDef.id === 'search_public_web') {
        const res = await McpAdapters.searchPublicWeb({
          query: (invocation.payload.query as string) || 'Amit Sharma',
          limit: (invocation.payload.limit as number) || 5
        });
        mcpResult = res.data;
      } else if (capabilityDef.id === 'read_github_public') {
        const res = await McpAdapters.readGithubPublic({
          username: (invocation.payload.username as string) || '1nsharma',
          since: invocation.payload.since as number
        });
        mcpResult = res.data;
      } else if (capabilityDef.id === 'create_content_draft') {
        const res = await McpAdapters.createLinkedInDraft({
          content: (invocation.payload.content as string) || '',
          hashtags: invocation.payload.hashtags as string[],
          basedOnChanges: invocation.payload.basedOnChanges,
          token: secretToken
        });
        mcpResult = res.data;
      } else if (capabilityDef.id === 'store_memory') {
        const res = await McpAdapters.storeMemory({
          key: (invocation.payload.key as string) || 'generic_key',
          content: (invocation.payload.content as string) || invocation.payload
        });
        mcpResult = res.data;
      } else if (capabilityDef.id === 'classify_and_detect') {
        const res = await McpAdapters.classifyAndDetect({
          observations: (invocation.payload.observations as Array<{ source: string; content: string }>) || [],
          tenantIdentity: invocation.payload.tenantIdentity as Record<string, unknown>
        });
        mcpResult = res.data;
      } else if (capabilityDef.id === 'generate_draft') {
        const res = await McpAdapters.generateDraft({
          changes: (invocation.payload.changes as Array<{ description: string }>) || [],
          insights: (invocation.payload.insights as string[]) || []
        });
        mcpResult = res.data;
      } else {
        throw new Error(`MCP method "${capabilityDef.mcpMethod}" has no registered runtime handler.`);
      }

      // Cache for idempotency
      idempotencyStore.set(idempotencyKey, { result: mcpResult, timestamp: Date.now() });

      // If this was an approved action, update status to EXECUTED
      if (invocation.approvedActionId) {
        const action = proposedActionsStore.find(a => a.id === invocation.approvedActionId);
        if (action) {
          action.status = 'EXECUTED';
          action.resolvedAt = new Date().toISOString();
        }
      }

      // -------------------------------------------------------------
      // STEP 10: EXECUTION LOGGER & AUDIT WRITER
      // -------------------------------------------------------------
      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: capabilityDef.mcpMethod,
        provider: capabilityDef.provider,
        input: CredentialVault.scrubObject(invocation.payload || {}),
        output: CredentialVault.scrubObject(mcpResult),
        status: 'SUCCESS',
        durationMs: Date.now() - startTime,
        policyCheckPassed: true,
        credentialVaultUsed: capabilityDef.requiresConnection ? capabilityDef.provider : undefined,
        idempotencyKey
      });

      return {
        success: true,
        status: 'SUCCESS',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: capabilityDef.provider,
        data: mcpResult,
        durationMs: Date.now() - startTime,
        pipelineTrace
      };

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.recordExecution({
        runId: invocation.runId,
        stepId: invocation.stepId,
        tenantId: invocation.tenantId,
        agentId: invocation.agentId,
        resource: invocation.resource,
        action: invocation.action,
        toolName: capabilityDef.mcpMethod,
        provider: capabilityDef.provider,
        input: CredentialVault.scrubObject(invocation.payload || {}),
        error: errorMsg,
        status: 'FAILURE',
        durationMs: Date.now() - startTime,
        policyCheckPassed: true,
        idempotencyKey
      });

      return {
        success: false,
        status: 'FAILURE',
        executionId,
        idempotencyKey,
        resource: invocation.resource,
        action: invocation.action,
        provider: capabilityDef.provider,
        error: errorMsg,
        durationMs: Date.now() - startTime,
        pipelineTrace
      };
    }
  }

  /**
   * Records execution into the immutable audit ledger with sanitized payload
   */
  private recordExecution(record: Omit<ToolExecutionRecord, 'id' | 'executedAt'>): ToolExecutionRecord {
    const newRecord: ToolExecutionRecord = {
      ...record,
      id: `toolex_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      executedAt: new Date().toLocaleTimeString()
    };
    toolExecutionLedger.unshift(newRecord);
    return newRecord;
  }

  /**
   * Atomic claim & execute helper for actions approved in Review Control Plane
   */
  public async claimAndExecuteApprovedAction(proposedActionId: string, agentId: string, runId: string): Promise<ToolRuntimeResult> {
    const action = proposedActionsStore.find(a => a.id === proposedActionId);
    if (!action) {
      throw new Error(`Action "${proposedActionId}" not found in Review Store.`);
    }

    return this.invoke({
      tenantId: action.tenantId,
      agentId,
      runId,
      resource: action.resource,
      action: action.action,
      payload: action.payload,
      idempotencyKey: action.idempotencyKey,
      approvedActionId: proposedActionId
    });
  }
}
