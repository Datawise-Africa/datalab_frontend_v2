import { scopedKey } from '~/lib/utils/query-key-scope';

export const bookmarkKeys = {
  all: () => scopedKey('bookmarks'),
  list: () => [...bookmarkKeys.all(), 'list'] as const,
};
