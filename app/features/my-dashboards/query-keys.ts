import { scopedKey } from '~/lib/utils/query-key-scope';

export const myDashboardKeys = {
  all: () => scopedKey('my-dashboards'),
  lists: () => [...myDashboardKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...myDashboardKeys.lists(), params] as const,
  detail: (id: string) => [...myDashboardKeys.all(), 'detail', id] as const,
};
