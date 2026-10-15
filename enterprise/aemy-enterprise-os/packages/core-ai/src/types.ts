export type AIModelTier = 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.0-flash';

export interface AIClientConfig {
  apiKey?: string;
  defaultModel?: AIModelTier;
  maxRetries?: number;
  timeoutMs?: number;
  temperature?: number;
}

export interface PromptCompletionOptions {
  model?: AIModelTier;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  jsonSchema?: Record<string, unknown>;
}

export interface AICompletionResult<T = string> {
  success: boolean;
  data: T;
  modelUsed: string;
  latencyMs: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ParsedCommerceOrder {
  success: boolean;
  customerName: string;
  isUdhar: boolean;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  notes?: string;
}

export interface CircuitBreakerState {
  status: 'healthy' | 'steer' | 'constrain' | 'tripped';
  errorCount: number;
  lastErrorTime?: number;
  tokensUsed: number;
  tokenBudget: number;
}
