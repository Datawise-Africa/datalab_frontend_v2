import { scopedKey } from '~/lib/utils/query-key-scope';

export const reviewKeys = {
  all: () => scopedKey('reviews'),
  list: (datasetId?: string) =>
    [...reviewKeys.all(), 'list', datasetId] as const,
};
