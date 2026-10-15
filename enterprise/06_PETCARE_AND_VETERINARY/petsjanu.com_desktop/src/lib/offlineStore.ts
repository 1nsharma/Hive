/**
 * Resilient Offline Storage & Sync Engine (LocalForage / Dexie / Store.js pattern)
 * Handles client-side caching, mutation queues for offline scans & sightings,
 * and automatic replay when online connection is restored.
 */

export interface QueuedMutation {
  id: string;
  type: 'sighting' | 'sos_toggle' | 'tag_scan' | 'feedback';
  payload: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
}

class OfflineStore {
  private queueKey = 'petjanu_offline_sync_queue';
  private listeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnlineStatus(true));
      window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }
  }

  public isOnline(): boolean {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  }

  public subscribeToNetwork(cb: (isOnline: boolean) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private handleOnlineStatus(online: boolean): void {
    this.listeners.forEach(cb => cb(online));
    if (online) {
      this.flushQueue().catch(() => {});
    }
  }

  // Generic key-value store with expiry
  public setItem<T>(key: string, value: T, ttlMinutes?: number): void {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        value,
        expiry: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : null
      };
      localStorage.setItem(`petjanu_${key}`, JSON.stringify(data));
    } catch {
      // Handle storage quota exceeded gracefully
    }
  }

  public getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`petjanu_${key}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(`petjanu_${key}`);
        return null;
      }
      return data.value as T;
    } catch {
      return null;
    }
  }

  public removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`petjanu_${key}`);
  }

  // Mutation Queue for Offline-First actions
  public enqueueMutation(type: QueuedMutation['type'], payload: Record<string, unknown>): QueuedMutation {
    const queue = this.getQueue();
    const mutation: QueuedMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type,
      payload,
      createdAt: Date.now(),
      retryCount: 0
    };
    queue.push(mutation);
    this.saveQueue(queue);

    if (this.isOnline()) {
      this.flushQueue().catch(() => {});
    }

    return mutation;
  }

  public getQueue(): QueuedMutation[] {
    return this.getItem<QueuedMutation[]>(this.queueKey) || [];
  }

  private saveQueue(queue: QueuedMutation[]): void {
    this.setItem(this.queueKey, queue);
  }

  public async flushQueue(): Promise<number> {
    const queue = this.getQueue();
    if (queue.length === 0 || !this.isOnline()) return 0;

    let processedCount = 0;
    const remaining: QueuedMutation[] = [];

    for (const item of queue) {
      try {
        // Send to backend API
        const res = await fetch('/api/sync-offline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });

        if (res.ok || res.status === 404) {
          // If handled or demo backend, mark as processed
          processedCount++;
        } else {
          item.retryCount++;
          if (item.retryCount < 5) remaining.push(item);
        }
      } catch {
        item.retryCount++;
        if (item.retryCount < 5) remaining.push(item);
      }
    }

    this.saveQueue(remaining);
    return processedCount;
  }
}

export const offlineStore = new OfflineStore();
