import { scopedKey } from '~/lib/utils/query-key-scope';

export const dashboardQueryKeys = {
  all: () => scopedKey('dashboards'),
  eduken: () => [...dashboardQueryKeys.all(), 'eduken'] as const,
};
