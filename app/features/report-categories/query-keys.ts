import { scopedKey } from '~/lib/utils/query-key-scope';

export const reportCategoryKeys = {
  all: () => scopedKey('report-categories'),
  lists: () => [...reportCategoryKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...reportCategoryKeys.lists(), params] as const,
  detail: (id: string) => [...reportCategoryKeys.all(), 'detail', id] as const,
};
