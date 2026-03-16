import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { metadataKeys } from './query-keys';
import type {
  IDatasetCategory,
  IDatasetLicense,
  IDatasetAuthor,
  IDatasetTermsAndConditions,
} from '~/lib/types/dataset';

/** Fetch all dataset categories. */
export const useDatasetCategories = () => {
  return useQuery({
    queryKey: metadataKeys.categories(),
    queryFn: async (): Promise<IDatasetCategory[]> => {
      const { data } = await apiClient.get('/data/dataset-categories/');
      return data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/** Fetch all available licenses. */
export const useLicenses = () => {
  return useQuery({
    queryKey: metadataKeys.licenses(),
    queryFn: async (): Promise<IDatasetLicense[]> => {
      const { data } = await apiClient.get('/data/license/');
      return data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/** Fetch all dataset authors. */
export const useAuthors = () => {
  return useQuery({
    queryKey: metadataKeys.authors(),
    queryFn: async (): Promise<IDatasetAuthor[]> => {
      const { data } = await apiClient.get('/data/dataset-authors/');
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

/** Fetch terms and conditions. */
export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: metadataKeys.termsAndConditions(),
    queryFn: async (): Promise<IDatasetTermsAndConditions[]> => {
      const { data } = await apiClient.get('/data/terms-and-conditions/');
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
};
