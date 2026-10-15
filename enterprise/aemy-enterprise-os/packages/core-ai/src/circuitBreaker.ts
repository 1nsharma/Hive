import { CircuitBreakerState } from './types';

export class CircuitBreaker {
  private state: CircuitBreakerState;
  private readonly maxErrors: number;
  private readonly cooldownMs: number;

  constructor(tokenBudget = 100_000, maxErrors = 5, cooldownMs = 60_000) {
    this.maxErrors = maxErrors;
    this.cooldownMs = cooldownMs;
    this.state = {
      status: 'healthy',
      errorCount: 0,
      tokensUsed: 0,
      tokenBudget
    };
  }

  public recordSuccess(tokens = 0): void {
    this.state.tokensUsed += tokens;
    if (this.state.errorCount > 0) {
      this.state.errorCount = Math.max(0, this.state.errorCount - 1);
    }
    this.evaluateStatus();
  }

  public recordFailure(): void {
    this.state.errorCount += 1;
    this.state.lastErrorTime = Date.now();
    this.evaluateStatus();
  }

  public canProceed(): boolean {
    if (this.state.status === 'tripped') {
      if (this.state.lastErrorTime && (Date.now() - this.state.lastErrorTime > this.cooldownMs)) {
        this.state.status = 'steer';
        return true;
      }
      return false;
    }
    return true;
  }

  public getState(): Readonly<CircuitBreakerState> {
    return { ...this.state };
  }

  private evaluateStatus(): void {
    if (this.state.tokensUsed >= this.state.tokenBudget) {
      this.state.status = 'tripped';
    } else if (this.state.errorCount >= this.maxErrors) {
      this.state.status = 'tripped';
    } else if (this.state.errorCount >= Math.floor(this.maxErrors / 2)) {
      this.state.status = 'constrain';
    } else if (this.state.tokensUsed >= this.state.tokenBudget * 0.8) {
      this.state.status = 'steer';
    } else {
      this.state.status = 'healthy';
    }
  }
}
