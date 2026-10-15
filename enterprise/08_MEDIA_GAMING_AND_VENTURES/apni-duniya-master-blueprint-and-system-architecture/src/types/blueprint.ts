export type ViewMode = 
  | 'overview'
  | 'constitution'
  | 'organism'
  | 'blueprint'
  | 'context-injector'
  | 'lens-studio'
  | 'governance'
  | 'death-valley'
  | 'flywheels'
  | 'memory-isolation'
  | 'compliance-checker';

export interface VolumeChapter {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  volumeId: number;
  volumeName: string;
  summary: string;
  keyAxiom: string;
  content: string;
  architecturalRule: string;
  tags: string[];
}

export interface BlueprintVolume {
  id: number;
  number: string;
  title: string;
  tagline: string;
  color: string;
  iconName: string;
  chapters: VolumeChapter[];
}

export interface ConstitutionalArticle {
  id: string;
  number: string;
  title: string;
  category: 'core-axiom' | 'human-rights' | 'ai-relationship' | 'economic-fairness' | 'privacy-memory' | 'prohibition' | 'governance-decentralization';
  clauses: {
    clauseNumber: string;
    text: string;
    architecturalInvariant: string;
    codeVerificationHook: string;
    enforcementMechanism: string;
  }[];
}

export interface RefusalPrinciple {
  id: string;
  title: string;
  banReason: string;
  industryPractice: string;
  apniDuniyaAlternative: string;
  architecturalGuardrail: string;
}

export interface OrganNode {
  id: string;
  name: string;
  hindiName: string;
  type: 'soul' | 'brain' | 'body' | 'nervous' | 'citizens' | 'heart' | 'immune' | 'infrastructure' | 'culture';
  description: string;
  techManifestation: string;
  inputs: string[];
  outputs: string[];
  metrics: { label: string; value: string }[];
  failSafeRule: string;
}

export interface ContextLens {
  id: string;
  name: string;
  version: string;
  author: string;
  authorType: 'community' | 'official' | 'researcher';
  description: string;
  category: 'economics' | 'fact-check' | 'education' | 'tech-bias' | 'cultural-linguistic';
  triggers: {
    platforms: ('youtube' | 'x' | 'reddit' | 'news' | 'web' | 'podcasts')[];
    keywords: string[];
    contentTypes: string[];
    confidenceThreshold: number;
  };
  dataSources: {
    name: string;
    type: 'verified-db' | 'public-api' | 'academic-papers' | 'community-consensus';
    provenanceUrl: string;
    trustScore: number;
  }[];
  logicCode: string;
  permissions: string[];
  uiOutput: {
    pillLabel: string;
    pillColor: string;
    cardTitle: string;
    insights: string[];
    counterMetrics?: { label: string; value: string; diff?: string }[];
    verdict?: 'supported' | 'misleading' | 'context-needed' | 'deep-dive';
  };
  economicDistribution: {
    creatorShare: number;
    infraReserveShare: number;
    curatorShare: number;
    auditFundShare: number;
  };
}

export interface SimulatedContent {
  id: string;
  platform: 'youtube' | 'x' | 'news' | 'reddit';
  title: string;
  creator: string;
  date: string;
  bodySnippet: string;
  url: string;
  matchingKeywords: string[];
  applicableLenses: string[];
}

export type DeathValleyStage = 'A' | 'B' | 'C' | 'D';

export interface DeathValleyStageConfig {
  stage: DeathValleyStage;
  name: string;
  tagline: string;
  status: string;
  triggerConditions: string[];
  allowedComponents: string[];
  frozenComponents: string[];
  survivalPriority: string[];
  killSwitchPolicy: string;
  runwayMonths: string;
}
