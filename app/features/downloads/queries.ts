import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Paginated } from '~/lib/types';
import { scopedKey } from '~/lib/utils/query-key-scope';

export const downloadKeys = {
  all: () => scopedKey('downloads'),
  history: (params?: Record<string, unknown>) =>
    [...downloadKeys.all(), 'history', params] as const,
};

export interface DownloadRecord {
  id: number;
  dataset: {
    id: string;
    title: string;
  };
  created_at: string;
  format: string;
}

// TODO: GET /data/dataset_downloads/ is not in the OpenAPI spec. Pending backend confirmation.
export const useDownloadHistory = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: downloadKeys.history(params),
    queryFn: async (): Promise<Paginated<DownloadRecord>> => {
      const { data } = await apiClient.get('/data/dataset_downloads/', {
        params,
      });
      return data;
    },
  });
};
