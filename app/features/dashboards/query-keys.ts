import { scopedKey } from '~/lib/utils/query-key-scope';

export const dashboardQueryKeys = {
  all: () => scopedKey('dashboards'),
  eduken: () => [...dashboardQueryKeys.all(), 'eduken'] as const,
  lists: () => [...dashboardQueryKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...dashboardQueryKeys.lists(), params] as const,
  detail: (id: string) => [...dashboardQueryKeys.all(), 'detail', id] as const,
};
