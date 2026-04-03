import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetKeys } from './query-keys';
import type { Paginated } from '~/lib/types';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import type { DatasetVersion } from '~/lib/types/dataset-version';

interface DatasetListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
  category?: string;
  accessLevel?: string;
  region?: string;
  timeframe?: string;
  [key: string]: unknown;
}

/** Fetch paginated datasets with optional filters. */
export const useDatasets = (params?: DatasetListParams) => {
  return useQuery({
    queryKey: datasetKeys.list(params),
    queryFn: async (): Promise<Paginated<MyDatasetInterface>> => {
      const { data } = await apiClient.get<Paginated<MyDatasetInterface>>(
        '/datasets/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/** Fetch a single dataset by ID or slug. */
export const useDataset = (id: string) => {
  return useQuery({
    queryKey: datasetKeys.detail(id),
    queryFn: async (): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.get<MyDatasetInterface>(
        `/datasets/${id}/`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/** Search datasets by query string. */
export const useSearchDatasets = (query: string) => {
  return useQuery({
    queryKey: datasetKeys.search(query),
    queryFn: async (): Promise<Paginated<MyDatasetInterface>> => {
      const { data } = await apiClient.get<Paginated<MyDatasetInterface>>(
        '/datasets/',
        { params: { search: query } }
      );
      return data;
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/** Fetch versions for a public dataset. */
export const useDatasetVersions = (datasetId: string) => {
  return useQuery({
    queryKey: datasetKeys.versions(datasetId),
    queryFn: async () => {
      const { data } = await apiClient.get<DatasetVersion[]>(
        `/datasets/${datasetId}/versions/`
      );
      return Array.isArray(data)
        ? data
        : ((data as { data?: DatasetVersion[] }).data ?? []);
    },
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000,
  });
};
