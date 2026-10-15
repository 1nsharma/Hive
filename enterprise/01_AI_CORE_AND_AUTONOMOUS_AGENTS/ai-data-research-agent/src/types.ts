export interface ResearchPlan {
  queries: string[];
  explanation: string;
}

export interface Citation {
  title: string;
  url: string;
}

export interface ValidationReport {
  totalFound: number;
  duplicatesRemoved: number;
  qualityReport: string;
  completenessPercentage: number;
}

export interface ResearchReport {
  id: string;
  timestamp: string;
  query: string;
  purpose: string;
  format: "json" | "csv" | "markdown";
  fields: string[];
  plan: ResearchPlan;
  citations: Citation[];
  validation: ValidationReport;
  records: Array<Record<string, any>>;
  formattedRawData: string;
  engine?: string;
}

export type AgentStage = "idle" | "planning" | "searching" | "scraping" | "validating" | "formatting" | "completed" | "error";

export interface AgentStepProgress {
  stage: AgentStage;
  message: string;
  timestamp: string;
}
