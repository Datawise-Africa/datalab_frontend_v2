import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { myDatasetKeys } from './query-keys';
import type { DatasetStatus } from '~/lib/types/dataset';
import type { Paginated } from '~/lib/types';
import type { DatasetVersion } from '~/lib/types/dataset-version';
import type { MyDatasetInterface } from './types';

interface MyDatasetsParams {
  status?: DatasetStatus;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
  workspace?: string;
}

/**
 * Fetch the current creator's datasets from /my-datasets/.
 * Status is sent as a query param filter.
 */
export const useMyDatasets = (params?: MyDatasetsParams) => {
  const apiParams: Record<string, unknown> = { ...params };
  // Remove status if 'all' or undefined so the API returns everything
  if (!apiParams.status || apiParams.status === 'all') {
    delete apiParams.status;
  }

  return useQuery({
    queryKey: myDatasetKeys.list(apiParams),
    queryFn: async (): Promise<Paginated<MyDatasetInterface>> => {
      const { data } = await apiClient.get<Paginated<MyDatasetInterface>>(
        '/my-datasets/',
        { params: apiParams }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/** Fetch a single dataset by ID. */
export const useMyDataset = (id: string) => {
  return useQuery({
    queryKey: myDatasetKeys.detail(id),
    queryFn: async (): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.get(`/my-datasets/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/** Fetch versions for a dataset. */
export const useMyDatasetVersions = (datasetId: string) => {
  return useQuery({
    queryKey: myDatasetKeys.versions(datasetId),
    queryFn: async (): Promise<DatasetVersion[]> => {
      const { data } = await apiClient.get(
        `/my-datasets/${datasetId}/versions/`
      );
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
    enabled: !!datasetId,
    staleTime: 5 * 60 * 1000,
  });
};
