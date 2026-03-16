import { scopedKey } from '~/lib/utils/query-key-scope';

export const datasetCreatorKeys = {
  all: () => scopedKey('dataset-creator'),
  application: () => [...datasetCreatorKeys.all(), 'application'] as const,
  applications: () => [...datasetCreatorKeys.all(), 'applications'] as const,
  myDatasets: (status?: string) =>
    [...datasetCreatorKeys.all(), 'my-datasets', status] as const,
  analytics: (range?: string) =>
    [...datasetCreatorKeys.all(), 'analytics', range] as const,
  reports: () => [...datasetCreatorKeys.all(), 'reports'] as const,
};
