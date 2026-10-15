import { describe, it, expect } from 'vitest';
import { offlineStore } from '../offlineStore';

describe('Resilient Offline Store Engine (Store.js / Dexie pattern)', () => {
  it('stores and retrieves items correctly', () => {
    offlineStore.setItem('test_pet', { name: 'Bruno', breed: 'Indie' });
    const item = offlineStore.getItem<{ name: string; breed: string }>('test_pet');

    expect(item).not.toBeNull();
    expect(item?.name).toBe('Bruno');
    expect(item?.breed).toBe('Indie');
  });

  it('enqueues mutations for offline sync', () => {
    const initialQueueLength = offlineStore.getQueue().length;
    const mutation = offlineStore.enqueueMutation('sighting', {
      petId: 'pet-1',
      location: 'Andheri West'
    });

    expect(mutation.id).toBeDefined();
    expect(mutation.type).toBe('sighting');

    const updatedQueue = offlineStore.getQueue();
    expect(updatedQueue.length).toBe(initialQueueLength + 1);
  });
});
