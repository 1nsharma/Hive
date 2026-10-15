import crypto from 'crypto';

export class IdempotencyEngine {
  private cache: Map<string, number> = new Map();

  generateKey(tenantId: string, commandType: string, payload: any): string {
    const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    return `${tenantId}_${commandType}_${hash}`;
  }

  checkAndSet(key: string, ttlMs: number = 60000): boolean {
    const now = Date.now();
    const existing = this.cache.get(key);
    
    // Clean up expired
    if (existing && now > existing) {
      this.cache.delete(key);
    }
    
    if (this.cache.has(key)) {
      return false; // Already exists, duplicate
    }
    
    this.cache.set(key, now + ttlMs);
    return true;
  }
}
export const globalIdempotencyEngine = new IdempotencyEngine();
