export type Language = 'hi' | 'en';

export type BrandName = 'Aura' | 'Synapse';

export interface Connector {
  id: string;
  name: string;
  symbol: string;
  category: 'database' | 'storage' | 'crm' | 'communication' | 'commerce' | 'dev' | 'finance' | 'cloud' | 'productivity';
  complexity: 'निम्न (Low)' | 'मध्यम (Medium)' | 'उच्च (High)';
  complexityEn: 'Low' | 'Medium' | 'High';
  priority: 'अत्यधिक उच्च' | 'उच्च';
  priorityEn: 'Critical' | 'High';
  descriptionHi: string;
  descriptionEn: string;
  protocol: string;
  samplePayload: Record<string, unknown>;
}

export interface PhaseTask {
  id: string;
  textHi: string;
  textEn: string;
  completed: boolean;
  priority: 'high' | 'critical' | 'medium';
  techStack?: string;
}

export interface Phase {
  id: string;
  num: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  tasks: PhaseTask[];
  badgeHi: string;
  badgeEn: string;
  targetMetricHi: string;
  targetMetricEn: string;
}

export interface ExecutionOption {
  id: '1' | '2' | '3';
  num: string;
  tagHi: string;
  tagEn: string;
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  tasksHi: string[];
  tasksEn: string[];
  longDescHi: string;
  longDescEn: string;
  deliverablesHi: string[];
  deliverablesEn: string[];
}

export interface RevenueTier {
  id: string;
  symbol: string;
  nameHi: string;
  nameEn: string;
  price: string;
  targetHi: string;
  targetEn: string;
  descHi: string;
  descEn: string;
  highlightsHi: string[];
  highlightsEn: string[];
}
