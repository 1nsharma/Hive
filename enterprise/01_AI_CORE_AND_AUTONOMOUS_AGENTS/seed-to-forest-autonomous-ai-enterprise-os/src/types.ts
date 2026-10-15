export type IntegrityStatus =
  | 'CONCEPT'
  | 'PROPOSED'
  | 'SIMULATED'
  | 'PROTOTYPE'
  | 'IMPLEMENTED'
  | 'TESTED'
  | 'HUMAN_VERIFIED'
  | 'PRODUCTION_READY';

export type StatePersistenceStatus =
  | 'PERSISTENT'
  | 'RESUMABLE'
  | 'RECOVERABLE'
  | 'EPHEMERAL';

export interface ProposedTreasuryAllocation {
  id: string;
  category: string;
  categoryHi: string;
  percentage: number;
  description: string;
  descriptionHi: string;
  status: IntegrityStatus;
  enforcement: string;
}

export interface FounderCompensationModel {
  role: string;
  allocationPercent: number; // 80% Day 1 Reserve
  vestingCliffMonths: number; // 6-month cliff
  vestingDurationMonths: number; // 24-month linear vesting
  governanceCap: string;
  hiddenFeeClause: string;
  status: IntegrityStatus;
}

export interface ConstitutionRule {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  type: 'spending' | 'tools' | 'self_modification' | 'audit';
  threshold?: string;
  enforcementMethod: string;
  enforcementMethodHi: string;
  codeSnippet: string;
  status: IntegrityStatus;
  enforcementType: 'AST_RUNTIME' | 'PROPOSED' | 'SIMULATED';
}

export interface TreasuryState {
  totalCapitalINR: number;
  reservedCapitalINR: number; // 80% (₹80,000)
  aiOpsBudgetINR: number; // 20% (₹20,000)
  currentSpentINR: number;
  totalRevenueINR: number;
  transactions: TreasuryTransaction[];
}

export interface TreasuryTransaction {
  id: string;
  timestamp: string;
  description: string;
  type: 'EXPENSE' | 'REVENUE' | 'MULTI_SIG_EXPENSE';
  amountINR: number;
  agent: string;
  category: 'API_CALL' | 'HOSTING' | 'DOMAIN' | 'SUBSCRIPTION_REVENUE' | 'AD_CAMPAIGN';
  auditHash: string;
  status: 'APPROVED' | 'AUTO_EXECUTED' | 'HUMAN_CONFIRMED' | 'BLOCKED';
  persistence: StatePersistenceStatus;
  integrityLabel: IntegrityStatus;
}

export interface ScoutedItem {
  id: string;
  source: string;
  complaintQuote: string;
  targetAudience: string;
  painPointSummary: string;
  suggestedMicroSolution: string;
  monetizationAngle: string;
  integrity: IntegrityStatus;
}

export interface AnalystScore {
  opportunityScore: number;
  marketSize: string;
  competition: string;
  technicalFeasibility: string;
  estimatedBuildHours: number;
  monthlyServerCostINR: number;
  recommendedPriceINR: number;
  breakEvenSignups: number;
  sevenDayKillMetric: string;
  verdict: 'GREEN_LIGHT_BUILD' | 'REQUIRES_REFINEMENT' | 'REJECT';
  strengths: string[];
  risks: string[];
}

export interface BuilderSpec {
  mvpName: string;
  tagline: string;
  architectureOverview: string;
  fileStructure: string[];
  coreCodeSnippet: string;
  dockerConfig: string;
  buildCostEstimateINR: number;
}

export interface CriticCheck {
  name: string;
  passed: boolean;
  details: string;
  status: IntegrityStatus;
}

export interface CriticResult {
  approved: boolean;
  score: number;
  checks: CriticCheck[];
  criticRemarks: string;
}

export interface GrimReaperEvaluation {
  daysElapsed: number;
  totalTrials: number;
  paidUsers: number;
  revenueGeneratedINR: number;
  costIncurredINR: number;
  decision: 'SCALE_PROJECT' | 'KILL_AND_ARCHIVE';
  actionTaken: string;
  nextStepSummary: string;
  status: IntegrityStatus;
}

export interface MicroBusinessIdea {
  id: string;
  title: string;
  titleHi: string;
  tagline: string;
  problemQuote: string;
  targetMarket: string;
  buildTimeHours: number;
  monthlyHostingINR: number;
  pricePerMonthINR: number;
  breakEvenPaidUsers: number;
  keyFeatures: string[];
  growthChannel: string;
  killSwitchCriteria: string;
  scaleTriggerCriteria: string;
  codeSample: string;
  integrityStatus: IntegrityStatus;
}

export interface DeepDiveTopic {
  id: 'constitution' | 'tech_stack' | 'first_business';
  number: number;
  title: string;
  titleHi: string;
  subtitle: string;
  icon: string;
}

export interface IntegrityAuditQuestion {
  id: number;
  question: string;
  questionHi: string;
  category: 'REALITY' | 'SIMULATION' | 'GOVERNANCE' | 'BOUNDS' | 'ROADMAP';
  answer: string;
  answerHi: string;
  status: IntegrityStatus;
  currentEnforcement: string;
  futureTarget: string;
}

export interface LifecycleStage {
  id: 'genesis' | 'growth' | 'autonomy' | 'economy' | 'civilization';
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  status: IntegrityStatus;
  timeframe: string;
}

export interface AgentTopologyNode {
  agentId: string;
  name: string;
  role: string;
  roleHi: string;
  governanceBounds: string;
  humanOverrideRequired: boolean;
  status: IntegrityStatus;
}

export type HandsToolName =
  | 'write_file'
  | 'execute_terminal_command'
  | 'deploy_contract'
  | 'post_to_social'
  | 'read_api'
  | 'run_docker_sandbox';

export interface HandsToolCall {
  id: string;
  tool: HandsToolName | string;
  timestamp: string;
  args: Record<string, any>;
  output: string;
  exitCode: number;
  status: 'SUCCESS' | 'BLOCKED_BY_CONSTITUTION' | 'EXECUTION_ERROR';
  executionTimeMs: number;
  auditHash: string;
}

export interface MemoryPostMortem {
  id: string;
  timestamp: string;
  projectTitle: string;
  category: string;
  outcome: 'FAILED_ARCHIVED' | 'SCALED_PROFITABLE' | 'BLOCKED_BY_CRITIC';
  rootCause: string;
  rootCauseHi: string;
  learnedRule: string;
  learnedRuleHi: string;
  similarityScore?: number;
  tags: string[];
}

export interface EconomyProject {
  id: string;
  title: string;
  titleHi: string;
  type: 'SMART_CONTRACT_L2' | 'MICRO_SAAS_API' | 'TELEGRAM_BOT';
  problemObserved: string;
  contractCode?: string;
  backendCode: string;
  landingPageHtml?: string;
  paymentUrl: string;
  testnetAddress?: string;
  testTransactionsCount: number;
  revenueGeneratedINR: number;
  killStatus: 'ACTIVE' | 'SCALED' | 'ARCHIVED';
  auditHash: string;
}

export interface ConstitutionAttackTest {
  id: string;
  title: string;
  titleHi: string;
  category: 'SPENDING_BREACH' | 'ILLEGAL_TOOL' | 'SELF_MODIFICATION' | 'LEGITIMATE_ACTION';
  description: string;
  descriptionHi: string;
  simulatedPayload: {
    amountINR?: number;
    tool?: string;
    targetFile?: string;
    codePayload?: string;
    humanSignature?: string | null;
  };
  expectedResult: 'BLOCKED' | 'HUMAN_APPROVAL_REQUIRED' | 'ALLOWED';
}
