import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { metadataKeys } from './query-keys';
import type {
  IDatasetCategory,
  IDatasetLicense,
  IDatasetTermsAndConditions,
  IDatasetTypeOption,
  ITopCategory,
} from '~/lib/types/dataset';
import type { Paginated } from '~/lib/types';

/** Fetch all dataset categories. */
export const useDatasetCategories = () => {
  return useQuery({
    queryKey: metadataKeys.categories(),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<IDatasetCategory>>(
        '/dataset-categories/'
      );
      // API may return paginated { data: [...] } or a plain array
      return data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/** Fetch top categories (with dataset counts) for the catalog filter sidebar. */
export const useTopCategories = () => {
  return useQuery({
    queryKey: metadataKeys.topCategories(),
    queryFn: async (): Promise<ITopCategory[]> => {
      const { data } = await apiClient.get<ITopCategory[]>(
        '/dataset-discovery/top-categories/'
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/** Fetch the supported dataset_type filter options. */
export const useDatasetTypes = () => {
  return useQuery({
    queryKey: metadataKeys.datasetTypes(),
    queryFn: async (): Promise<IDatasetTypeOption[]> => {
      const { data } = await apiClient.get<IDatasetTypeOption[]>(
        '/dataset-discovery/dataset-types/'
      );
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

/** Fetch all available licenses. */
export const useLicenses = () => {
  return useQuery({
    queryKey: metadataKeys.licenses(),
    queryFn: async () => {
      const { data } =
        await apiClient.get<Paginated<IDatasetLicense>>('/dataset-licenses/');
      // API may return paginated { data: [...] } or a plain array
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
    queryFn: async () => {
      const { data } = await apiClient.get('/data/dataset-authors/');
      // API may return paginated { data: [...] } or a plain array
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
  });
};

export interface Country {
  name: string;
  states: string[];
}

/** Get countries, optionally filtered by search string. */
export const useCountries = (search?: string) => {
  return useQuery({
    queryKey: metadataKeys.countries(search),
    queryFn: async (): Promise<Country[]> => {
      const { countries } = await import('~/lib/constants/countries');
      if (!search) return countries;
      const q = search.toLowerCase();
      return countries.filter((c) => c.name.toLowerCase().includes(q));
    },
    staleTime: Infinity,
  });
};

/** Get states for a given country name, optionally filtered by search string. */
export const useCountryStates = (countryName?: string, search?: string) => {
  return useQuery({
    queryKey: metadataKeys.states(countryName, search),
    queryFn: async (): Promise<string[]> => {
      if (!countryName) return [];
      const { countries } = await import('~/lib/constants/countries');
      const country = countries.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
      );
      if (!country) return [];
      if (!search) return country.states;
      const q = search.toLowerCase();
      return country.states.filter((s) => s.toLowerCase().includes(q));
    },
    enabled: !!countryName,
    staleTime: Infinity,
  });
};

/** Fetch terms and conditions. */
export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: metadataKeys.termsAndConditions(),
    queryFn: async (): Promise<IDatasetTermsAndConditions[]> => {
      const { data } = await apiClient.get('/data/terms-and-conditions/');
      // API may return paginated { data: [...] } or a plain array
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    staleTime: 30 * 60 * 1000,
  });
};
