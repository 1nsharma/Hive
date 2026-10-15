export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'modified' | 'rolled_back';

export type OperatingMode = 'COPILOT' | 'SUPERVISED' | 'AUTONOMOUS' | 'LOCKDOWN';

export type MissionStatus = 
  | 'idle' 
  | 'planning' 
  | 'perceiving' 
  | 'executing' 
  | 'awaiting_approval' 
  | 'self_reflecting' 
  | 'completed' 
  | 'failed';

export interface AgentCapabilityPolicy {
  read: string[];
  create: string[];
  execute: string[];
  requires_approval: string[];
}

export interface AgentWorker {
  id: string;
  name: string;
  role: string;
  type: 'identity' | 'research' | 'content' | 'growth' | 'coding' | 'business' | 'security' | 'assistant';
  avatarIcon: string;
  description: string;
  status: 'idle' | 'running' | 'paused' | 'locked';
  policy: AgentCapabilityPolicy;
  activeWorkload?: string;
  metrics: {
    tasksCompleted: number;
    accuracyScore: number;
    hoursSaved: number;
  };
  lastActive: string;
}

export type IdentityVerificationStatus = 'CONFIRMED' | 'POSSIBLE' | 'UNKNOWN' | 'NOT_YOU';

export interface IdentityEntity {
  id: string;
  tenantId: string;
  source: 'github' | 'x' | 'linkedin' | 'google_scholar' | 'news' | 'company_registry' | 'web';
  title: string;
  snippet: string;
  url: string;
  verificationStatus: IdentityVerificationStatus;
  discoveredAt: string;
  deltaIdentified: string;
  confidence: number; // 0 - 100
}

export interface IdentityGrowthProspect {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: 'ai_founder' | 'msme_tech_leader' | 'developer' | 'researcher' | 'potential_customer' | 'investor';
  relevanceScore: number;
  draftedOutreachMessage: string;
  status: 'drafted' | 'approved' | 'sent' | 'replied';
  outreachChannel: 'linkedin' | 'email' | 'x';
}

export interface IdentityGeneratedContent {
  id: string;
  format: 'linkedin' | 'dev_to' | 'x_post' | 'project_update';
  title: string;
  body: string;
  tags: string[];
  sourcesUsed: string[];
  status: 'draft' | 'pending_approval' | 'published';
  engagementMetrics?: {
    views: number;
    reactions: number;
    replies: number;
    leadConversions: number;
  };
}

export interface IdentityPipelineRun {
  id: string;
  tenantId: string;
  timestamp: string;
  deltaSummary: string;
  discoveredEntities: IdentityEntity[];
  generatedContent: IdentityGeneratedContent[];
  growthProspects: IdentityGrowthProspect[];
  learningInsights: {
    topicAttention: string;
    repliesSummary: string;
    strategyAdjustment: string;
  };
}

export interface DigitalTwinProfile {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatarSeed: string;
  bio: string;
  toneOfVoice: 'visionary' | 'analytical' | 'assertive' | 'diplomatic' | 'creative';
  primaryGoals: string[];
  guardrails: string[];
  connectedSources: {
    github: boolean;
    linkedin: boolean;
    gmail: boolean;
    calendar: boolean;
    crm: boolean;
    customWebhook: boolean;
  };
  heuristicWeights: {
    autonomyThreshold: number; // 0-100 (high = acts without asking, low = asks often)
    riskTolerance: number; // 0-100
    thoroughness: number; // 0-100
    learningAdaptability: number; // 0-100
  };
}

export interface PerceptionEvent {
  id: string;
  tenantId: string;
  source: 'github' | 'linkedin' | 'gmail' | 'calendar' | 'web_scraper' | 'webhook';
  title: string;
  summary: string;
  timestamp: string;
  payload: Record<string, unknown>;
  importanceScore: number; // 1-10
}

export interface MemoryNode {
  id: string;
  tenantId: string;
  type: 'short_term' | 'episodic' | 'semantic_rag' | 'learned_heuristic';
  title: string;
  content: string;
  tags: string[];
  relevanceScore: number;
  timestamp: string;
  linkedTargetId?: string;
}

export interface MCPTool {
  id: string;
  name: string;
  serverUri: string;
  category: 'perception' | 'reasoning' | 'action' | 'synthesis';
  description: string;
  riskLevel: RiskLevel;
  requiredScopes: string[];
  isEnabled: boolean;
  parametersSchema: Record<string, string>;
}

export interface PlanStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'awaiting_approval' | 'completed' | 'failed';
  assignedToolId?: string;
  assignedToolName?: string;
  riskLevel: RiskLevel;
  reasoning: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: Record<string, unknown>;
  executionDurationMs?: number;
  hitlActionId?: string;
}

export interface HITLAction {
  id: string;
  targetId: string;
  stepId: string;
  tenantId: string;
  actionTitle: string;
  toolName: string;
  riskLevel: RiskLevel;
  status: ActionStatus;
  payload: Record<string, unknown>;
  diffPreview?: string;
  impactAnalysis: string;
  createdAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface SelfReflection {
  cycle: number;
  timestamp: string;
  evaluatedGoalProgress: number; // 0-100%
  critique: string;
  identifiedBottlenecks: string[];
  heuristicAdjustments: {
    heuristic: string;
    oldValue: number;
    newValue: number;
    reason: string;
  }[];
  autonomousDecision: string;
}

export interface AgentMission {
  id: string;
  tenantId: string;
  target: string;
  autonomousMode: 'full_auto' | 'hitl_guarded';
  status: MissionStatus;
  progressPercentage: number;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
  perceptionInsights: string[];
  steps: PlanStep[];
  reflections: SelfReflection[];
  finalOutcomeArtifact?: {
    summary: string;
    deliverables: {
      type: 'draft_post' | 'email_thread' | 'code_snippet' | 'research_report' | 'action_summary';
      title: string;
      content: string;
    }[];
    metricsAchieved: { label: string; value: string }[];
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  targetId?: string;
  level: 'info' | 'decision' | 'action' | 'hitl' | 'security' | 'reflection';
  agentMonologue: string;
  actionTaken: string;
  toolUsed?: string;
  riskLevel: RiskLevel;
  executionPayload?: string;
}

export interface RoadmapPhase {
  phase: number;
  name: string;
  timeline: string;
  status: 'current_live' | 'next_phase' | 'planned' | 'agi_horizon';
  tagline: string;
  corePillars: string[];
  technicalSpecs: string[];
}

export interface ReviewControlItem {
  id: string;
  tenantId: string;
  agentWorkerId: string;
  agentWorkerName: string;
  proposedAction: string;
  riskLevel: RiskLevel;
  reason: string;
  dataUsed: string[];
  toolUsed: string;
  expectedResult: string;
  actualResult?: string;
  payload: Record<string, unknown>;
  diffPreview?: string;
  status: ActionStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  canRollback: boolean;
}

export interface BotChannel {
  id: string;
  name: 'whatsapp' | 'telegram' | 'web' | 'slack';
  displayName: string;
  icon: string;
  status: 'connected' | 'standby' | 'disconnected';
  webhookUrl: string;
  botHandle: string;
  unreadCount: number;
  allowedModes: OperatingMode[];
}

export interface BotChatMessage {
  id: string;
  channelId: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  actionCard?: {
    actionId: string;
    title: string;
    risk: RiskLevel;
    status: ActionStatus;
  };
}

export interface AutomationWorkflow {
  id: string;
  tenantId: string;
  name: string;
  triggerType: 'cron' | 'webhook' | 'event';
  triggerSchedule: string; // e.g., "0 8 * * *" (Every day at 8 AM)
  description: string;
  assignedAgent: string;
  actions: string[];
  isEnabled: boolean;
  lastRun?: string;
  lastStatus?: 'success' | 'failed' | 'running';
  totalExecutions: number;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'Agents' | 'Tools' | 'MCP Servers' | 'Workflows' | 'Skills' | 'Templates' | 'Integrations';
  description: string;
  author: string;
  version: string;
  icon: string;
  tags: string[];
  stars: number;
  isInstalled: boolean;
  isEnabled: boolean;
  riskLevel: RiskLevel;
  requiredScopes: string[];
  installCommand?: string;
}

export interface CloudSystemState {
  vectorMemoryTokens: number;
  indexedDocumentsCount: number;
  activeWorkloadsCount: number;
  credentialsVaultCount: number;
  uptimeSeconds: number;
  computeLoadPercentage: number;
  storageUsedMb: number;
  storageLimitMb: number;
  credentials: {
    id: string;
    name: string;
    type: 'oauth2' | 'api_key' | 'token' | 'ssh_key';
    service: string;
    status: 'valid' | 'expiring_soon' | 'revoked';
    lastUsed: string;
    scope: string;
  }[];
  workloads: {
    id: string;
    name: string;
    assignedAgent: string;
    status: 'running' | 'queued' | 'completed' | 'idle';
    duration: string;
    cpu: string;
    memory: string;
  }[];
}

export interface CLICommandResponse {
  command: string;
  output: string;
  status: 'success' | 'error' | 'info';
  timestamp: string;
}

// --- OPTION A & B: AGENT OS CORE ENGINEERING ARCHITECTURE TYPES ---

export type PermissionDecision = 'DENY' | 'ALLOW' | 'ALLOW_WITH_APPROVAL';

export interface MultiDimensionalRiskMatrix {
  dataSensitivity: 0 | 1 | 2 | 3; // 0=Public, 1=Internal, 2=Confidential, 3=Restricted/Secret
  externalCommunication: 0 | 1 | 2 | 3; // 0=None, 1=Internal Team, 2=Drafted External, 3=Direct Outbound Public
  financialImpact: 0 | 1 | 2 | 3; // 0=Zero, 1=Micro (<$1), 2=Transactional, 3=Uncapped
  reputationImpact: 0 | 1 | 2 | 3; // 0=None, 1=Low, 2=Public Branding, 3=High-Profile/Irreversible
  destructiveness: 0 | 1 | 2 | 3; // 0=Non-destructive Read, 1=Append-only, 2=Modify, 3=Delete/Drop
  reversibility: 0 | 1 | 2 | 3; // 0=Fully Reversible, 1=Compensating Action Exists, 2=Difficult, 3=Irreversible
  compositeScore: number; // 0 - 100
  riskLevel: RiskLevel;
}

export interface AgentPermissionRule {
  id: string;
  agentId: string;
  agentName: string;
  resource: string; // e.g. "public_web", "github", "linkedin", "email", "whatsapp", "database", "terminal"
  capability: string; // e.g. "read", "create_draft", "publish", "delete", "execute"
  decision: PermissionDecision;
  rateLimitPerHour: number;
  costCapUsdPerDay: number;
  requiresApprovalReason?: string;
  description: string;
}

export interface TenantConnection {
  id: string;
  tenantId: string;
  provider: 'github' | 'linkedin' | 'google_workspace' | 'whatsapp_cloud' | 'postgres' | 'redis';
  displayName: string;
  accountIdentifier: string;
  status: 'connected' | 'expiring' | 'disconnected';
  capabilitiesGranted: string[];
  vaultSecretRef: string; // Token resides in vault, NEVER leaked to Agent
  lastRotated: string;
  rateLimitRemaining: number;
}

export interface IdempotentActionExecution {
  idempotencyKey: string;
  executionId: string;
  attempt: number;
  externalActionId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'EXECUTED' | 'FAILED' | 'RETRYING' | 'BLOCKED';
  timestamp: string;
  hash: string;
}

export interface PolicyEvaluationResult {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  proposedAction: string;
  resource: string;
  capability: string;
  decision: PermissionDecision;
  reasonCode: string;
  detailedAnalysis: string;
  riskMatrix: MultiDimensionalRiskMatrix;
  rateLimitStatus: {
    callsThisHour: number;
    hourlyLimit: number;
    withinLimit: boolean;
  };
  budgetStatus: {
    costUsd: number;
    dailyCapUsd: number;
    withinBudget: boolean;
  };
  idempotencyKey: string;
  executionId: string;
}

export type OrchestratorStage = 
  | 'OBSERVE' 
  | 'UNDERSTAND' 
  | 'PLAN' 
  | 'POLICY_CHECK' 
  | 'ACT' 
  | 'VERIFY' 
  | 'LEARN';

export interface OrchestratorRunTrace {
  id: string;
  tenantId: string;
  agentId: string;
  timestamp: string;
  currentStage: OrchestratorStage;
  stagesCompleted: OrchestratorStage[];
  stageLogs: {
    stage: OrchestratorStage;
    status: 'success' | 'running' | 'blocked' | 'hitl_pending';
    summary: string;
    durationMs: number;
    details: Record<string, unknown>;
  }[];
  policyDecision?: PolicyEvaluationResult;
  executionState?: IdempotentActionExecution;
  status: 'running' | 'completed' | 'blocked' | 'awaiting_human_approval';
}

// --- PHASE 4: TOOL RUNTIME, CAPABILITY REGISTRY & NORMALIZED EXECUTION LAYER ---

export interface ToolInvocation {
  tenantId: string;
  agentId: string;
  runId: string;
  stepId?: string;
  resource: string; // e.g. "public_web", "github", "linkedin", "memory", "database"
  action: string; // e.g. "read", "create_draft", "publish", "store"
  payload: Record<string, unknown>;
  idempotencyKey?: string;
  approvedActionId?: string; // Set when executing an approved action from Review Queue
}

export interface CapabilityDefinition {
  id: string; // e.g. "search_public_web", "read_github_public", "create_content_draft"
  resource: string; // e.g. "public_web", "github", "linkedin"
  action: string; // e.g. "read", "create_draft", "publish"
  provider: 'mcp_web' | 'mcp_github' | 'mcp_linkedin' | 'mcp_memory' | 'mcp_llm' | 'mcp_database';
  mcpMethod: string; // e.g. "search_public_web", "read_github_public", "create_draft"
  risk: MultiDimensionalRiskMatrix;
  requiresConnection: boolean;
  requiresApproval: boolean;
  rateLimitPerHour: number;
  costEstimateUsd: number;
  description: string;
}

export type ToolExecutionStatus = 
  | 'PENDING' 
  | 'EXECUTING' 
  | 'SUCCESS' 
  | 'FAILURE' 
  | 'BLOCKED_BY_POLICY' 
  | 'APPROVAL_REQUIRED' 
  | 'TIMEOUT';

export interface ToolExecutionRecord {
  id: string;
  runId: string;
  stepId?: string;
  tenantId: string;
  agentId: string;
  resource: string;
  action: string;
  toolName: string;
  provider: string;
  input: Record<string, unknown>; // Guaranteed clean of credentials/tokens
  output?: Record<string, unknown>;
  error?: string;
  status: ToolExecutionStatus;
  durationMs: number;
  tokensUsed?: number;
  executedAt: string;
  policyCheckPassed: boolean;
  credentialVaultUsed?: string;
  idempotencyKey?: string;
}

export interface ActionProposalRecord {
  id: string;
  runId: string;
  tenantId: string;
  agentId: string;
  idempotencyKey: string;
  resource: string;
  action: string;
  payload: Record<string, unknown>;
  reason: string; // LLM's structured reasoning (NOT permission)
  dataUsed: string[]; // Observation or memory IDs
  policyDecision?: PermissionDecision;
  overallRisk?: RiskLevel;
  requiresApproval: boolean;
  proposedActionId?: string;
  status: 'PENDING_REVIEW' | 'POLICY_EVALUATED' | 'APPROVED' | 'CLAIMED_EXECUTING' | 'EXECUTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
}

export interface ProposedActionRecord {
  id: string;
  idempotencyKey: string;
  executionId: string;
  tenantId: string;
  agentId: string;
  resource: string;
  action: string;
  payload: Record<string, unknown>;
  riskLevel: RiskLevel;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'EXECUTING' | 'EXECUTED' | 'REJECTED' | 'BLOCKED';
  claimedByWorkerId?: string;
  claimedAt?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface NormalizedAgentStep {
  id: string;
  runId: string;
  sequence: number;
  phase: 'OBSERVE' | 'UNDERSTAND' | 'PLAN' | 'POLICY_CHECK' | 'EXECUTE' | 'VERIFY' | 'LEARN';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  durationMs: number;
  startedAt: string;
  completedAt?: string;
}

export interface NormalizedAgentRun {
  id: string;
  tenantId: string;
  agentId: string;
  trigger: 'CRON' | 'WEBHOOK' | 'MANUAL' | 'EVENT';
  goal: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED';
  startedAt: string;
  finishedAt?: string;
  error?: string;
  steps: NormalizedAgentStep[];
  proposals: ActionProposalRecord[];
  toolExecutions: ToolExecutionRecord[];
}

export interface ToolRuntimeEnforcementPipelineStep {
  step: 'AUTHENTICATE' | 'TENANT_ISOLATION' | 'AGENT_STATUS' | 'CAPABILITY_REGISTRY' | 'POLICY_EVALUATION' | 'CONNECTION_VAULT' | 'RATE_LIMIT' | 'IDEMPOTENCY_CLAIM' | 'MCP_DISPATCH';
  passed: boolean;
  timestamp: string;
  details: string;
}

export interface ToolRuntimeResult {
  success: boolean;
  status: ToolExecutionStatus;
  executionId: string;
  idempotencyKey?: string;
  resource: string;
  action: string;
  provider: string;
  data?: Record<string, unknown>;
  error?: string;
  durationMs: number;
  pipelineTrace: ToolRuntimeEnforcementPipelineStep[];
  actionProposalEnqueued?: ActionProposalRecord;
}



