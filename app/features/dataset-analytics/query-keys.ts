import { scopedKey } from '~/lib/utils/query-key-scope';

export const datasetAnalyticsKeys = {
  all: () => scopedKey('dataset-analytics'),
  topPerforming: (params?: Record<string, unknown>) =>
    [...datasetAnalyticsKeys.all(), 'top-performing', params ?? {}] as const,
  overview: (id: string) =>
    [...datasetAnalyticsKeys.all(), 'overview', id] as const,
  geography: (id: string) =>
    [...datasetAnalyticsKeys.all(), 'geography', id] as const,
  intendedUse: (id: string) =>
    [...datasetAnalyticsKeys.all(), 'intended-use', id] as const,
  trends: (id: string) =>
    [...datasetAnalyticsKeys.all(), 'trends', id] as const,
};
