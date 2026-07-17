import { scopedKey } from '~/lib/utils/query-key-scope';

export const reportKeys = {
  all: () => scopedKey('reports'),
  lists: () => [...reportKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...reportKeys.lists(), params] as const,
  detail: (id: string) => [...reportKeys.all(), 'detail', id] as const,
  versions: (id: string) => [...reportKeys.all(), 'versions', id] as const,
  bookmarks: () => [...reportKeys.all(), 'bookmarks'] as const,
};
