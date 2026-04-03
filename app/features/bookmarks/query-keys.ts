import { scopedKey } from '~/lib/utils/query-key-scope';

export const bookmarkKeys = {
  all: () => scopedKey('bookmarks'),
  lists: () => [...bookmarkKeys.all(), 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...bookmarkKeys.lists(), filters] as const,
};
