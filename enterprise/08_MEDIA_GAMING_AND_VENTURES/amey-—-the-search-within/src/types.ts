export type Language = 'en' | 'hi';

export interface Pillar {
  id: string;
  number: string;
  titleEn: string;
  titleHi: string;
  coreQuestionEn: string;
  coreQuestionHi: string;
  descriptionEn: string;
  descriptionHi: string;
  themesEn: string[];
  themesHi: string[];
  epistemicTensionEn: string;
  epistemicTensionHi: string;
}

export interface ResearchSeriesItem {
  id: string;
  code: string; // e.g. "001"
  titleEn: string;
  titleHi: string;
  questionEn: string;
  questionHi: string;
  thesisEn: string;
  thesisHi: string;
  readingTime: string;
  category: string;
  evidenceEn: string[];
  evidenceHi: string[];
  counterEvidenceEn: string[];
  counterEvidenceHi: string[];
  unknownsEn: string[];
  unknownsHi: string[];
  fullEssayExcerptEn: string;
  fullEssayExcerptHi: string;
  suggestedExperimentEn: string;
  suggestedExperimentHi: string;
}

export interface BookChapter {
  number: number;
  titleEn: string;
  titleHi: string;
  thesisEn: string;
  thesisHi: string;
  abstractEn: string;
  abstractHi: string;
  keyQuestionEn: string;
  keyQuestionHi: string;
  draftNotesEn: string;
  draftNotesHi: string;
}

export interface PlaybookAnalysis {
  step1_question: string;
  step2_claim: string;
  step3_evidence: string[];
  step4_counter_evidence: string[];
  step5_experiment: string;
  step6_result: string;
  step7_unknown: string;
  step8_revision: string;
}

export interface FunnelData {
  core_question: string;
  x_post: string;
  x_thread_points: string[];
  linkedin_post: string;
  youtube_episode: {
    title: string;
    hook: string;
    act1_the_paradox: string;
    act2_the_evidence: string;
    act3_the_unknown: string;
  };
  instagram_frame: {
    visual_direction: string;
    quote: string;
  };
  whitepaper_abstract: string;
}

export interface AgencyAuditQuestion {
  id: string;
  dimension: 'attention' | 'decision' | 'discovery' | 'creativity' | 'memory';
  questionEn: string;
  questionHi: string;
  options: {
    labelEn: string;
    labelHi: string;
    score: number; // 1 to 4
    implicationEn: string;
    implicationHi: string;
  }[];
}

export interface StudioWing {
  id: 'research' | 'labs' | 'products' | 'media' | 'publications';
  number: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  subTracksEn: string[];
  subTracksHi: string[];
}

export interface LabExperiment {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'Agents' | 'Explainability' | 'Safety' | 'Human-AI';
  status: 'Live Sandbox' | 'Active Benchmark' | 'Research Prototype';
  descriptionEn: string;
  descriptionHi: string;
  objectiveEn: string;
  objectiveHi: string;
  runnableConfig: {
    defaultInput: string;
    metrics: string[];
  };
}

export interface StudioProduct {
  id: string;
  name: string;
  categoryEn: string;
  categoryHi: string;
  taglineEn: string;
  taglineHi: string;
  descriptionEn: string;
  descriptionHi: string;
  status: 'Live Tool' | 'Alpha Sandbox' | 'Research API';
  featuresEn: string[];
  featuresHi: string[];
}

export interface AgentSimulationStep {
  stepNumber: number;
  thought: string;
  action: string;
  observation: string;
  explainability: string;
  safetyVerdict: 'pass' | 'intervened';
}

export interface AgentSimulationResult {
  goal: string;
  autonomyLevel: string;
  steps: AgentSimulationStep[];
  agencyEntropyScore: number; // 0 to 100
  epistemicConfidence: number; // 0 to 100
  summary: string;
}

export type ConnectorPlatform = 'x' | 'linkedin' | 'youtube' | 'substack' | 'github' | 'webhook';

export interface SocialConnector {
  id: ConnectorPlatform;
  name: string;
  description: string;
  platform: string;
  status: 'connected' | 'ready' | 'simulated';
  targetHandle: string;
  webhookUrl?: string;
  autoSyndicate: boolean;
  formatsSupported: string[];
  lastSyndicatedAt?: string;
  totalDispatches: number;
  estimatedReach: number;
}

export interface SyndicationPayload {
  platform: ConnectorPlatform;
  title: string;
  formattedText: string;
  metadata?: Record<string, any>;
  status: 'delivered' | 'simulated' | 'queued' | 'failed';
  externalUrl?: string;
}

export interface SyndicationDispatch {
  id: string;
  timestamp: string;
  title: string;
  source: 'funnel' | 'playbook' | 'publication' | 'custom';
  platforms: ConnectorPlatform[];
  status: 'published' | 'queued' | 'simulated';
  receiptHash: string;
  summary: string;
  payloads: Record<string, SyndicationPayload>;
  metrics: {
    estimatedImpressions: number;
    epistemicQualityScore: number;
    humanAgencyPreserved: boolean;
  };
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface MCPPromptDefinition {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

