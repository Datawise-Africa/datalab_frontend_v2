import type {
  QueueItem,
  AddQueuePayload,
  AuthQueueStatus,
  QueueSummary,
} from '@/lib/types/auth-context';
import { useState, useMemo } from 'react';

export function useAuthQueue() {
  const [authQueue] = useState(new Map<string, QueueItem>());

  const addToQueue = (item: AddQueuePayload | AddQueuePayload[]) => {
    // Remove  items from queue before adding new ones

    if (Array.isArray(item)) {
      item.forEach((i) => addToQueue(i));
      return;
    }
    const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    authQueue.set(id, { ...item, id, status: 'pending' });
  };

  const removeFromQueue = (id: string) => {
    authQueue.delete(id);
  };

  const updateQueueItemStatus = (id: string, status: AuthQueueStatus) => {
    const item = authQueue.get(id);
    if (item) {
      authQueue.set(id, { ...item, status });
    }
  };

  const processQueue = async () => {
    for (const queueItem of authQueue.values()) {
      if (queueItem.status !== 'pending') continue;

      const { id, function: func, args } = queueItem;

      if (typeof func !== 'function') continue;

      try {
        // console.log(`Processing queue item ${id} with args:`, args);
        updateQueueItemStatus(id, 'active');
        queueItem.status = 'active';
        const result = func(...args);
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        console.error(`Error processing queue item ${id}`, err);
        updateQueueItemStatus(id, 'error');
      }
    }
  };

  const watchedQueue = useMemo(() => {
    return Array.from(authQueue.values()).reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as QueueSummary);
  }, [authQueue]);

  return {
    queue: authQueue,
    addToQueue,
    removeFromQueue,
    updateQueueItemStatus,
    processQueue,
    watchedQueue,
  };
}
