import { scopedKey } from '~/lib/utils/query-key-scope';

export const dashboardCategoryKeys = {
  all: () => scopedKey('dashboard-categories'),
  lists: () => [...dashboardCategoryKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...dashboardCategoryKeys.lists(), params] as const,
  detail: (id: string) =>
    [...dashboardCategoryKeys.all(), 'detail', id] as const,
};
