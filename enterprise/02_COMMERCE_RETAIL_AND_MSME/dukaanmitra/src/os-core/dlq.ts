import { DomainEvent } from './domain-events';

export interface FailedEvent {
  id: string;
  event: DomainEvent;
  error: string;
  retryCount: number;
  lastAttemptAt: number;
  status: 'PENDING_RETRY' | 'POISON';
}

export class DeadLetterQueue {
  private queue: FailedEvent[] = [];
  private readonly MAX_RETRIES = 3;

  add(event: DomainEvent, error: string) {
    this.queue.push({
      id: `dlq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event,
      error,
      retryCount: 0,
      lastAttemptAt: Date.now(),
      status: 'PENDING_RETRY'
    });
  }

  async processRetries(retryHandler: (event: DomainEvent) => Promise<void>) {
    const pending = this.queue.filter(q => q.status === 'PENDING_RETRY');
    for (const item of pending) {
      try {
        item.retryCount++;
        item.lastAttemptAt = Date.now();
        await retryHandler(item.event);
        // Success -> remove from queue
        this.queue = this.queue.filter(q => q.id !== item.id);
      } catch (err: any) {
        if (item.retryCount >= this.MAX_RETRIES) {
          item.status = 'POISON';
        }
        item.error = err.message;
      }
    }
  }

  getPoisonQueue(): FailedEvent[] {
    return this.queue.filter(q => q.status === 'POISON');
  }
}
export const globalDLQ = new DeadLetterQueue();
