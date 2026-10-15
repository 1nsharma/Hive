import { GoogleGenAI } from '@google/genai';
import { AIClientConfig, PromptCompletionOptions, AICompletionResult } from './types';
import { CircuitBreaker } from './circuitBreaker';

export class ResilientAIClient {
  private ai?: GoogleGenAI;
  private readonly config: Required<AIClientConfig>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(config: AIClientConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.API_KEY || process.env.GEMINI_API_KEY || '',
      defaultModel: config.defaultModel || 'gemini-2.5-flash',
      maxRetries: config.maxRetries ?? 3,
      timeoutMs: config.timeoutMs ?? 15_000,
      temperature: config.temperature ?? 0.7
    };

    this.circuitBreaker = new CircuitBreaker();

    if (this.config.apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: this.config.apiKey });
      } catch (err) {
        console.warn('Failed to initialize GoogleGenAI client with provided key:', err);
      }
    }
  }

  public async complete(prompt: string, options: PromptCompletionOptions = {}): Promise<AICompletionResult> {
    const startTime = Date.now();
    const modelToUse = options.model || this.config.defaultModel;

    if (!this.circuitBreaker.canProceed()) {
      return {
        success: false,
        data: '',
        modelUsed: modelToUse,
        latencyMs: Date.now() - startTime,
        error: 'Circuit breaker tripped due to excessive errors or token budget exhaustion.'
      };
    }

    if (!this.ai) {
      return {
        success: false,
        data: `[MOCK AI RESPONSE]: Prompt received (${prompt.slice(0, 50)}...). Configure API_KEY for live completions.`,
        modelUsed: 'mock-engine',
        latencyMs: Date.now() - startTime,
        error: 'Missing API key. Resilient mock response returned.'
      };
    }

    let attempts = 0;
    while (attempts < this.config.maxRetries) {
      attempts++;
      try {
        const response = await this.ai.models.generateContent({
          model: modelToUse,
          contents: prompt,
          config: {
            temperature: options.temperature ?? this.config.temperature,
            maxOutputTokens: options.maxTokens,
            systemInstruction: options.systemPrompt
          }
        });

        const text = response.text || '';
        this.circuitBreaker.recordSuccess(100);

        return {
          success: true,
          data: text,
          modelUsed: modelToUse,
          latencyMs: Date.now() - startTime
        };
      } catch (error: unknown) {
        this.circuitBreaker.recordFailure();
        if (attempts >= this.config.maxRetries) {
          const errMsg = error instanceof Error ? error.message : String(error);
          return {
            success: false,
            data: '',
            modelUsed: modelToUse,
            latencyMs: Date.now() - startTime,
            error: errMsg
          };
        }
        await new Promise(res => setTimeout(res, 1000 * attempts));
      }
    }

    return {
      success: false,
      data: '',
      modelUsed: modelToUse,
      latencyMs: Date.now() - startTime,
      error: 'Max retries exceeded'
    };
  }

  public getBreakerState() {
    return this.circuitBreaker.getState();
  }
}
