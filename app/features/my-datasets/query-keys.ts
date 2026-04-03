import { scopedKey } from '~/lib/utils/query-key-scope';

export const myDatasetKeys = {
  all: () => scopedKey('my-datasets'),
  lists: () => [...myDatasetKeys.all(), 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...myDatasetKeys.lists(), filters] as const,
  details: () => [...myDatasetKeys.all(), 'detail'] as const,
  detail: (id: string) => [...myDatasetKeys.details(), id] as const,
  versions: (datasetId: string) =>
    [...myDatasetKeys.detail(datasetId), 'versions'] as const,
};
