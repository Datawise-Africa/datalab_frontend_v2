import { scopedKey } from '~/lib/utils/query-key-scope';

export const productKeys = {
  all: () => scopedKey('products'),
  lists: () => [...productKeys.all(), 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all(), 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
