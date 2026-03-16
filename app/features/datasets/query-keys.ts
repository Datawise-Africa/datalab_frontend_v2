import { scopedKey } from '~/lib/utils/query-key-scope';

export const datasetKeys = {
  all: () => scopedKey('datasets'),
  lists: () => [...datasetKeys.all(), 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...datasetKeys.lists(), filters] as const,
  search: (query: string) => [...datasetKeys.all(), 'search', query] as const,
  details: () => [...datasetKeys.all(), 'detail'] as const,
  detail: (id: string) => [...datasetKeys.details(), id] as const,
};
