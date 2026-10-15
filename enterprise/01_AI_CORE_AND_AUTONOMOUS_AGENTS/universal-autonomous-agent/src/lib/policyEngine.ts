import { 
  PermissionDecision, 
  MultiDimensionalRiskMatrix, 
  AgentPermissionRule, 
  PolicyEvaluationResult,
  OperatingMode,
  RiskLevel
} from '../types';
import { INITIAL_PERMISSION_RULES } from '../data/mockData';

// In-memory policy rules and usage trackers
export const activeRules: AgentPermissionRule[] = [...INITIAL_PERMISSION_RULES];

interface RateLimitTracker {
  [key: string]: { count: number; windowStart: number };
}
const rateLimits: RateLimitTracker = {};

/**
 * Multi-Dimensional Risk Matrix Calculator
 * Evaluates 6 distinct operational vectors to prevent single-dimensional bias.
 */
export function calculateRiskMatrix(
  resource: string, 
  capability: string, 
  payload?: Record<string, unknown>
): MultiDimensionalRiskMatrix {
  let dataSensitivity: 0 | 1 | 2 | 3 = 0;
  let externalCommunication: 0 | 1 | 2 | 3 = 0;
  let financialImpact: 0 | 1 | 2 | 3 = 0;
  let reputationImpact: 0 | 1 | 2 | 3 = 0;
  let destructiveness: 0 | 1 | 2 | 3 = 0;
  let reversibility: 0 | 1 | 2 | 3 = 0;

  // 1. Data Sensitivity Vector
  if (resource === 'vault' || capability.includes('secret') || resource === 'credentials') {
    dataSensitivity = 3; // Restricted/Secret
  } else if (resource === 'database' || resource === 'email') {
    dataSensitivity = 2; // Confidential
  } else if (resource === 'github' || resource === 'internal_docs') {
    dataSensitivity = 1; // Internal
  } else {
    dataSensitivity = 0; // Public
  }

  // 2. External Communication Vector
  if (capability.includes('publish') || capability.includes('broadcast') || capability.includes('outreach')) {
    externalCommunication = 3; // Direct Outbound Public
  } else if (capability.includes('draft') || capability.includes('email_draft')) {
    externalCommunication = 2; // Drafted External
  } else if (capability.includes('team_notify') || capability.includes('log')) {
    externalCommunication = 1; // Internal Team
  } else {
    externalCommunication = 0; // None
  }

  // 3. Financial Impact Vector
  if (capability.includes('uncapped') || capability.includes('invest') || capability.includes('financial_execute')) {
    financialImpact = 3; // Uncapped
  } else if (capability.includes('transfer') || capability.includes('spend') || capability.includes('subscribe')) {
    financialImpact = 2; // Transactional
  } else if (capability.includes('api_call_billed')) {
    financialImpact = 1; // Micro
  } else {
    financialImpact = 0; // Zero
  }

  // 4. Reputation Impact Vector
  if (capability.includes('publish_post') || capability.includes('broadcast')) {
    reputationImpact = 2; // Public Branding
  } else if (capability.includes('send_outreach')) {
    reputationImpact = 2; // Direct stakeholder contact
  } else if (capability.includes('delete') || capability.includes('drop')) {
    reputationImpact = 3; // Severe
  } else if (capability.includes('draft')) {
    reputationImpact = 1; // Low
  } else {
    reputationImpact = 0; // None
  }

  // 5. Destructiveness Vector
  if (capability.includes('drop') || capability.includes('delete') || capability.includes('destroy')) {
    destructiveness = 3; // Destructive
  } else if (capability.includes('modify') || capability.includes('update') || capability.includes('patch')) {
    destructiveness = 2; // Modify
  } else if (capability.includes('create') || capability.includes('insert') || capability.includes('append')) {
    destructiveness = 1; // Append-only
  } else {
    destructiveness = 0; // Non-destructive Read
  }

  // 6. Reversibility Vector
  if (destructiveness === 3 || externalCommunication === 3) {
    reversibility = 3; // Irreversible once published/dropped
  } else if (capability.includes('send_outreach')) {
    reversibility = 2; // Difficult (message already delivered)
  } else if (destructiveness === 2) {
    reversibility = 1; // Compensating action exists (state rollback)
  } else {
    reversibility = 0; // Fully reversible
  }

  // Composite Score formula (weighted aggregate out of 100)
  const rawScore = 
    (dataSensitivity * 15) +
    (externalCommunication * 25) +
    (financialImpact * 15) +
    (reputationImpact * 20) +
    (destructiveness * 15) +
    (reversibility * 10);
  
  const compositeScore = Math.min(100, Math.round((rawScore / (3 * 100)) * 100));

  let riskLevel: RiskLevel = 'low';
  if (compositeScore >= 75 || destructiveness === 3 || financialImpact === 3) {
    riskLevel = 'critical';
  } else if (compositeScore >= 50 || externalCommunication === 3) {
    riskLevel = 'high';
  } else if (compositeScore >= 25 || destructiveness >= 1) {
    riskLevel = 'medium';
  }

  return {
    dataSensitivity,
    externalCommunication,
    financialImpact,
    reputationImpact,
    destructiveness,
    reversibility,
    compositeScore,
    riskLevel
  };
}

/**
 * Deterministic Policy Engine Evaluator
 * 
 * Guarantees:
 * 1. Strict Deny-By-Default: If no rule matches, action is immediately blocked.
 * 2. LLM reasoning does NOT grant permission. Policy is evaluated deterministically.
 * 3. Checks rate limits, operational mode, and multi-dimensional risk.
 * 4. Yields idempotency key and execution ID.
 */
export function evaluatePolicy(
  agentId: string,
  agentName: string,
  resource: string,
  capability: string,
  proposedActionTitle: string,
  operatingMode: OperatingMode,
  payload?: Record<string, unknown>
): PolicyEvaluationResult {
  const timestamp = new Date().toLocaleTimeString();
  const idempotencyKey = `idemp_${agentId}_${resource}_${capability}_${Date.now()}`;
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const riskMatrix = calculateRiskMatrix(resource, capability, payload);

  // 1. Emergency Lockdown Check
  if (operatingMode === 'LOCKDOWN') {
    return {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction: proposedActionTitle,
      resource,
      capability,
      decision: 'DENY',
      reasonCode: 'EMERGENCY_LOCKDOWN_ACTIVE',
      detailedAnalysis: 'All autonomous capabilities are frozen by emergency operator override.',
      riskMatrix,
      rateLimitStatus: { callsThisHour: 0, hourlyLimit: 0, withinLimit: false },
      budgetStatus: { costUsd: 0, dailyCapUsd: 0, withinBudget: false },
      idempotencyKey,
      executionId
    };
  }

  // 2. Lookup Rule in Whitelist (STRICT DENY-BY-DEFAULT)
  const matchedRule = activeRules.find(
    r => r.agentId === agentId && r.resource === resource && r.capability === capability
  );

  if (!matchedRule) {
    return {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction: proposedActionTitle,
      resource,
      capability,
      decision: 'DENY',
      reasonCode: 'UNAUTHORIZED_CAPABILITY_NOT_FOUND',
      detailedAnalysis: `Policy Violation: Agent "${agentName}" has NO explicitly granted capability for "${resource}.${capability}". Strict Deny-by-default enforced.`,
      riskMatrix,
      rateLimitStatus: { callsThisHour: 0, hourlyLimit: 0, withinLimit: false },
      budgetStatus: { costUsd: 0, dailyCapUsd: 0, withinBudget: true },
      idempotencyKey,
      executionId
    };
  }

  // 3. Explicit Rule Denial
  if (matchedRule.decision === 'DENY') {
    return {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction: proposedActionTitle,
      resource,
      capability,
      decision: 'DENY',
      reasonCode: 'EXPLICIT_POLICY_DENY',
      detailedAnalysis: matchedRule.requiresApprovalReason || `Resource capability "${resource}.${capability}" is permanently blocked by organization security policy.`,
      riskMatrix,
      rateLimitStatus: { callsThisHour: 0, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: false },
      budgetStatus: { costUsd: 0, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
      idempotencyKey,
      executionId
    };
  }

  // 4. Rate-limit & Budget Tracking
  const trackerKey = `${agentId}:${resource}:${capability}`;
  const now = Date.now();
  if (!rateLimits[trackerKey] || now - rateLimits[trackerKey].windowStart > 3600000) {
    rateLimits[trackerKey] = { count: 0, windowStart: now };
  }
  rateLimits[trackerKey].count += 1;
  const currentCalls = rateLimits[trackerKey].count;
  const withinRateLimit = currentCalls <= matchedRule.rateLimitPerHour;

  if (!withinRateLimit) {
    return {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction: proposedActionTitle,
      resource,
      capability,
      decision: 'DENY',
      reasonCode: 'RATE_LIMIT_EXCEEDED',
      detailedAnalysis: `Rate limit breach: ${currentCalls} calls made in current hour. Maximum allowed: ${matchedRule.rateLimitPerHour}/hr.`,
      riskMatrix,
      rateLimitStatus: { callsThisHour: currentCalls, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: false },
      budgetStatus: { costUsd: 0.1, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
      idempotencyKey,
      executionId
    };
  }

  // 5. Autonomy Mode & HITL Gate Evaluation
  // COPILOT: Every action requires human approval
  if (operatingMode === 'COPILOT') {
    return {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction: proposedActionTitle,
      resource,
      capability,
      decision: 'ALLOW_WITH_APPROVAL',
      reasonCode: 'COPILOT_MODE_ENFORCED',
      detailedAnalysis: 'Operating mode is set to COPILOT. All actions require explicit confirmation.',
      riskMatrix,
      rateLimitStatus: { callsThisHour: currentCalls, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: true },
      budgetStatus: { costUsd: 0.05, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
      idempotencyKey,
      executionId
    };
  }

  // SUPERVISED: If rule is ALLOW_WITH_APPROVAL OR composite risk is medium/high -> Gate to Review
  if (matchedRule.decision === 'ALLOW_WITH_APPROVAL' || riskMatrix.compositeScore >= 40) {
    return {
      id: `eval-${Date.now()}`,
      timestamp,
      agentId,
      agentName,
      proposedAction: proposedActionTitle,
      resource,
      capability,
      decision: 'ALLOW_WITH_APPROVAL',
      reasonCode: 'RISK_GATE_APPROVAL_REQUIRED',
      detailedAnalysis: matchedRule.requiresApprovalReason || `Risk score (${riskMatrix.compositeScore}/100) mandates human confirmation in Control Plane before execution.`,
      riskMatrix,
      rateLimitStatus: { callsThisHour: currentCalls, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: true },
      budgetStatus: { costUsd: 0.05, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
      idempotencyKey,
      executionId
    };
  }

  // AUTONOMOUS mode or Low-Risk Whitelisted
  return {
    id: `eval-${Date.now()}`,
    timestamp,
    agentId,
    agentName,
    proposedAction: proposedActionTitle,
    resource,
    capability,
    decision: 'ALLOW',
    reasonCode: 'POLICY_PERMITTED_AUTONOMOUS',
    detailedAnalysis: `Authorized: Whitelisted capability within rate limit and risk boundaries (${riskMatrix.compositeScore}/100). Auto-executing.`,
    riskMatrix,
    rateLimitStatus: { callsThisHour: currentCalls, hourlyLimit: matchedRule.rateLimitPerHour, withinLimit: true },
    budgetStatus: { costUsd: 0.02, dailyCapUsd: matchedRule.costCapUsdPerDay, withinBudget: true },
    idempotencyKey,
    executionId
  };
}

export const evaluateAction = (
  agentId: string,
  agentName: string,
  resource: string,
  capability: string,
  proposedActionTitle: string,
  payload: Record<string, unknown> | undefined,
  operatingMode: OperatingMode
): PolicyEvaluationResult => {
  return evaluatePolicy(
    agentId,
    agentName,
    resource,
    capability,
    proposedActionTitle,
    operatingMode,
    payload
  );
};

