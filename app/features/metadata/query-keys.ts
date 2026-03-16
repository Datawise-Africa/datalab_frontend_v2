import { scopedKey } from '~/lib/utils/query-key-scope';

export const metadataKeys = {
  all: () => scopedKey('metadata'),
  categories: () => [...metadataKeys.all(), 'categories'] as const,
  licenses: () => [...metadataKeys.all(), 'licenses'] as const,
  authors: () => [...metadataKeys.all(), 'authors'] as const,
  termsAndConditions: () =>
    [...metadataKeys.all(), 'terms-and-conditions'] as const,
};
