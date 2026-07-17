import { scopedKey } from '~/lib/utils/query-key-scope';

export const myReportKeys = {
  all: () => scopedKey('my-reports'),
  lists: () => [...myReportKeys.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...myReportKeys.lists(), params] as const,
  detail: (id: string) => [...myReportKeys.all(), 'detail', id] as const,
  versions: (reportId: string) =>
    [...myReportKeys.all(), 'versions', reportId] as const,
  downloads: (params?: Record<string, unknown>) =>
    [...myReportKeys.all(), 'downloads', params] as const,
};
