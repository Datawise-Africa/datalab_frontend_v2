import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetKeys } from './query-keys';
import type { IDataset, DatasetListResponse } from '~/lib/types/dataset';

interface DatasetListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  [key: string]: unknown;
}

interface DatasetFilterParams extends DatasetListParams {
  category?: string;
  accessLevel?: string;
  region?: string;
  timeframe?: string;
}

/**
 * Fetch paginated datasets. Uses /data/datasets/ for unfiltered
 * and /data/filter/ when filter params are present.
 */
export const useDatasets = (params?: DatasetFilterParams) => {
  const hasFilters =
    params &&
    (params.category ||
      params.accessLevel ||
      params.region ||
      params.timeframe);

  return useQuery({
    queryKey: datasetKeys.list(params),
    queryFn: async (): Promise<DatasetListResponse> => {
      const endpoint = hasFilters ? '/data/filter/' : '/data/datasets/';
      const { data } = await apiClient.get('/datasets/', { params });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/** Fetch a single dataset by ID. */
export const useDataset = (id: string) => {
  return useQuery({
    queryKey: datasetKeys.detail(id),
    queryFn: async (): Promise<IDataset> => {
      const { data } = await apiClient.get(`/data/datasets/${id}/`);
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
    queryFn: async (): Promise<DatasetListResponse> => {
      const { data } = await apiClient.get('/data/search/', {
        params: { query },
      });
      return data;
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
