import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Paginated } from '~/lib/types';
import type { IDatasetCategory } from '~/lib/types/dataset';
import { scopedKey } from '~/lib/utils/query-key-scope';

export const downloadKeys = {
  all: () => scopedKey('downloads'),
  history: (params?: Record<string, unknown>) =>
    [...downloadKeys.all(), 'history', params] as const,
  detail: (id: string) => [...downloadKeys.all(), 'detail', id] as const,
};

export interface DownloadDatasetSummary {
  id: string;
  name: string;
  description: string;
  dataset_type: string;
  dataset_image: string | null;
  category: IDatasetCategory | null;
  is_premium: boolean;
  price: string | number | null;
  tags: string[];
}

export interface DownloadRecord {
  id: string;
  dataset: DownloadDatasetSummary;
  download_date: string;
}

/** GET /my-dataset-downloads/ — paginated list of the current user's downloads. */
export const useDownloadHistory = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: downloadKeys.history(params),
    queryFn: async (): Promise<Paginated<DownloadRecord>> => {
      const { data } = await apiClient.get('/my-dataset-downloads/', {
        params,
      });
      return data;
    },
  });
};

/** GET /my-dataset-downloads/{id}/ — single download record. */
export const useDownload = (id: string | undefined) => {
  return useQuery({
    queryKey: downloadKeys.detail(id ?? ''),
    queryFn: async (): Promise<DownloadRecord> => {
      const { data } = await apiClient.get(`/my-dataset-downloads/${id}/`);
      return data;
    },
    enabled: !!id,
  });
};
