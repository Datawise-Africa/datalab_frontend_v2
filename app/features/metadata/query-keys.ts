import { scopedKey } from '~/lib/utils/query-key-scope';

export const metadataKeys = {
  all: () => scopedKey('metadata'),
  categories: () => [...metadataKeys.all(), 'categories'] as const,
  licenses: () => [...metadataKeys.all(), 'licenses'] as const,
  authors: () => [...metadataKeys.all(), 'authors'] as const,
  termsAndConditions: () =>
    [...metadataKeys.all(), 'terms-and-conditions'] as const,
  countryLists: () => [...metadataKeys.all(), 'countries'] as const,
  countries: (search?: string) =>
    [...metadataKeys.countryLists(), search] as const,
  states: (countryName?: string, search?: string) =>
    [...metadataKeys.countryLists(), 'states', countryName, search] as const,
};
