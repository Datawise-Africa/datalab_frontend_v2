import type { DatasetCreateorAnalyticsFilter } from '@/store/dataset-creator-analytics-store';

export const datasetCreatorAnalyticsKeys = {
  overview: 'dataset-creator-analytics-overview' as const,
  individual: (
    datasetId: string,
    filters: DatasetCreateorAnalyticsFilter = { range: '1m' },
  ) =>
    [`dataset-creator-analytics-individual-${datasetId}`, { filters }] as const,
  individualOverview: (
    datasetId: string,
    filters: DatasetCreateorAnalyticsFilter = { range: '1m' },
  ) =>
    [
      `dataset-creator-analytics-individual-overview-${datasetId}`,
      { filters },
    ] as const,
};
