
export enum ResourceCategory {
  LLM = 'LLM',
  API = 'API',
  MCP = 'MCP',
  DATASET = 'Dataset',
  TOOL = 'Tool',
  FRAMEWORK = 'Framework'
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  url: string;
  license: string;
  tags: string[];
  region: string;
  useCase: string;
  howToConnect: string;
  comparison: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
