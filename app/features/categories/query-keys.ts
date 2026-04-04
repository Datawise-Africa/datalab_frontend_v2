import { scopedKey } from '~/lib/utils/query-key-scope';

export const categoryKeys = {
  all: () => scopedKey('categories'),
  lists: () => [...categoryKeys.all(), 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all(), 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};
