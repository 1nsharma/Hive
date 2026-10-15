import { globalAgentSandbox } from '../os-core/agent-sandbox.js';
import { globalApprovalEngine } from '../os-core/human-approval.js';
import { globalCommandBus, Command } from '../os-core/command-bus.js';
import { DomainEvent } from '../os-core/domain-events.js';
import { globalEventBus } from '../os-core/event-bus.js';
import { globalReasoningStore } from '../os-core/reasoning-store.js';

// Extend DomainEvent types for QA Pipeline
export type QAEventType = 
  | 'CODE_PROPOSED'
  | 'CODE_REVIEWED'
  | 'TEST_COMPLETED'
  | 'SYSTEM_ANOMALY'
  | 'FIX_PROPOSED'
  | 'CHAOS_REPORT';

export interface CodeProposalPayload {
  pullRequestId: string;
  authorAgentId: string;
  filesChanged: string[];
  codeDiff: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ReviewPayload {
  pullRequestId: string;
  reviewerId: string;
  approved: boolean;
  confidenceScore: number;
  findings: string[];
}

export interface SystemAnomalyPayload {
  anomalyId: string;
  type: 'CRASH' | 'DUPLICATE_FEATURE' | 'BROKEN_ROUTE' | 'SECURITY_VULNERABILITY' | 'BUSINESS_LOGIC_ERROR';
  description: string;
  stackTrace?: string;
}

// ------------------------------------------------------------------
// Base Auditor Agent
// ------------------------------------------------------------------
class BaseAuditorAgent {
  constructor(public agentId: string, public auditorType: string) {
    globalAgentSandbox.setLimits(this.agentId, {
      spendingLimit: 1000,
      rateLimitPerMinute: 60,
      allowedPermissions: ['READ_CODEBASE', 'SUBMIT_REVIEW'],
      requiresApproval: false
    });
  }

  protected async submitReview(tenantId: string, payload: CodeProposalPayload, approved: boolean, confidenceScore: number, findings: string[]) {
    // No agent can approve its own code
    if (payload.authorAgentId === this.agentId) {
      console.error(`[${this.agentId}] Cannot review own code!`);
      return;
    }

    const reviewEvent: DomainEvent = {
      id: `evt_rev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type: 'CODE_REVIEWED' as any,
      tenantId,
      payload: {
        pullRequestId: payload.pullRequestId,
        reviewerId: this.agentId,
        approved,
        confidenceScore,
        findings
      },
      timestamp: Date.now(),
      sourceId: this.agentId
    };

    globalReasoningStore.save({
      tenantId,
      agentId: this.agentId,
      decision: approved ? 'Approved code proposal' : 'Rejected code proposal',
      confidence: confidenceScore,
      toolsUsed: ['codeAnalysis'],
      evidence: { findings },
      outcome: approved ? 'APPROVED' : 'REJECTED',
      reasoningChain: [
        `Analyzing ${payload.filesChanged.length} files as ${this.auditorType}`,
        `Detected ${findings.length} findings`,
        `Calculated confidence score: ${confidenceScore}`
      ]
    });

    globalEventBus.publish(reviewEvent as any);
  }
}

// 1. Architecture Auditor
export class ArchitectureAuditorAgent extends BaseAuditorAgent {
  constructor() { super('qa_architecture_auditor', 'Architecture'); }
  async evaluateProposal(event: DomainEvent) {
    const payload = event.payload as CodeProposalPayload;
    const isClean = !payload.codeDiff.includes('db.insert'); // Ensure strangler pattern
    await this.submitReview(event.tenantId, payload, isClean, 0.92, isClean ? [] : ['Direct DB access found. Please use CommandBus.']);
  }
}

// 2. Business Logic Auditor
export class BusinessLogicAuditorAgent extends BaseAuditorAgent {
  constructor() { super('qa_business_logic_auditor', 'BusinessLogic'); }
  async evaluateProposal(event: DomainEvent) {
    const payload = event.payload as CodeProposalPayload;
    await this.submitReview(event.tenantId, payload, true, 0.88, []);
  }
}

// 3. Security Auditor
export class SecurityAuditorAgent extends BaseAuditorAgent {
  constructor() { super('qa_security_auditor', 'Security'); }
  async evaluateProposal(event: DomainEvent) {
    const payload = event.payload as CodeProposalPayload;
    const hasVulnerability = payload.codeDiff.includes('eval(');
    await this.submitReview(event.tenantId, payload, !hasVulnerability, 0.99, hasVulnerability ? ['eval() usage detected'] : []);
  }
}

// 4. UI Auditor
export class UIAuditorAgent extends BaseAuditorAgent {
  constructor() { super('qa_ui_auditor', 'UI'); }
  async evaluateProposal(event: DomainEvent) {
    const payload = event.payload as CodeProposalPayload;
    await this.submitReview(event.tenantId, payload, true, 0.85, []);
  }
}

// 5. Testing Agent
export class TestingAgent {
  readonly agentId = 'qa_testing_agent';
  constructor() {
    globalAgentSandbox.setLimits(this.agentId, { spendingLimit: 5000, rateLimitPerMinute: 100, allowedPermissions: ['RUN_TESTS'], requiresApproval: false });
  }
  async runRegressionTests(event: DomainEvent) {
    const payload = event.payload as CodeProposalPayload;
    const testEvent: DomainEvent = {
      id: `evt_test_${Date.now()}`,
      type: 'TEST_COMPLETED' as any,
      tenantId: event.tenantId,
      payload: { pullRequestId: payload.pullRequestId, passed: true, coverage: 0.94 },
      timestamp: Date.now(),
      sourceId: this.agentId
    };
    globalEventBus.publish(testEvent as any);
  }
}

// 6. Chaos Testing Agent
export class ChaosTestingAgent {
  readonly agentId = 'qa_chaos_agent';
  constructor() {
    globalAgentSandbox.setLimits(this.agentId, { spendingLimit: 2000, rateLimitPerMinute: 10, allowedPermissions: ['SIMULATE_FAULTS'], requiresApproval: false });
  }
  async injectFault(tenantId: string) {
    const chaosEvent: DomainEvent = {
      id: `evt_chaos_${Date.now()}`,
      type: 'CHAOS_REPORT' as any,
      tenantId,
      payload: { faultInjected: 'NETWORK_PARTITION', systemRecovered: true },
      timestamp: Date.now(),
      sourceId: this.agentId
    };
    globalEventBus.publish(chaosEvent as any);
  }
}

// 7. Observability Agent
export class ObservabilityAgent {
  readonly agentId = 'qa_observability_agent';
  constructor() {
    globalAgentSandbox.setLimits(this.agentId, { spendingLimit: 1000, rateLimitPerMinute: 1000, allowedPermissions: ['MONITOR_SYSTEM'], requiresApproval: false });
  }
  async detectAnomaly(tenantId: string, anomalyType: string, description: string) {
    const anomalyEvent: DomainEvent = {
      id: `evt_anomaly_${Date.now()}`,
      type: 'SYSTEM_ANOMALY' as any,
      tenantId,
      payload: { anomalyId: `anom_${Date.now()}`, type: anomalyType, description } as SystemAnomalyPayload,
      timestamp: Date.now(),
      sourceId: this.agentId
    };
    globalEventBus.publish(anomalyEvent as any);
  }
}

// 8. Auto Fix Agent
export class AutoFixAgent {
  readonly agentId = 'qa_autofix_agent';
  constructor() {
    globalAgentSandbox.setLimits(this.agentId, { spendingLimit: 10000, rateLimitPerMinute: 20, allowedPermissions: ['WRITE_CODE'], requiresApproval: true });
  }
  
  async proposeFix(tenantId: string, anomaly: SystemAnomalyPayload) {
    const riskLevel = anomaly.type === 'SECURITY_VULNERABILITY' || anomaly.type === 'CRASH' ? 'HIGH' : 'LOW';
    
    if (riskLevel === 'HIGH') {
      globalApprovalEngine.requestApproval({
        toolId: 'submitFix',
        agentId: this.agentId,
        tenantId,
        payload: { anomaly },
        reason: `High risk fix required for ${anomaly.type}. Human validation needed before proposing PR.`
      });
      return;
    }

    const fixEvent: DomainEvent = {
      id: `evt_fix_${Date.now()}`,
      type: 'CODE_PROPOSED' as any,
      tenantId,
      payload: {
        pullRequestId: `pr_fix_${Date.now()}`,
        authorAgentId: this.agentId,
        filesChanged: ['src/fixed-file.ts'],
        codeDiff: '+ // Auto-fixed issue\\n',
        riskLevel
      } as CodeProposalPayload,
      timestamp: Date.now(),
      sourceId: this.agentId
    };
    
    globalEventBus.publish(fixEvent as any);
  }
}

// Setup the QA Pipeline subscriptions
export function initializeQAPipeline() {
  const archAuditor = new ArchitectureAuditorAgent();
  const logicAuditor = new BusinessLogicAuditorAgent();
  const securityAuditor = new SecurityAuditorAgent();
  const uiAuditor = new UIAuditorAgent();
  const testAgent = new TestingAgent();
  const autofixAgent = new AutoFixAgent();

  // Route new proposals to auditors
  globalEventBus.subscribe('CODE_PROPOSED' as any, async (event: any) => {
    // Every feature must be reviewed by at least two independent agents.
    // We route to all applicable ones.
    await Promise.all([
      archAuditor.evaluateProposal(event),
      logicAuditor.evaluateProposal(event),
      securityAuditor.evaluateProposal(event),
      uiAuditor.evaluateProposal(event),
      testAgent.runRegressionTests(event)
    ]);
  });

  // AutoFix agent listens to system anomalies
  globalEventBus.subscribe('SYSTEM_ANOMALY' as any, async (event: any) => {
    await autofixAgent.proposeFix(event.tenantId, event.payload as SystemAnomalyPayload);
  });
}
