
export interface CodeSnippet {
  language: string;
  code: string;
}

export interface DeploymentSnippet {
  platform: string;
  steps: string;
}

export interface GeneratedCode {
  backend: CodeSnippet;
  frontend: CodeSnippet;
  aiIntegration: CodeSnippet;
  deployment: DeploymentSnippet;
}

export interface Service {
  name: string;
  category: 'AI/ML' | 'Hosting';
  description: string;
  bestFor: string;
}
