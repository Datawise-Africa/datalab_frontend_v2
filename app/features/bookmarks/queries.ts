import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { bookmarkKeys } from './query-keys';
import type { DatasetSummary } from '~/features/my-datasets/types';

interface BookmarkListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: unknown;
}

export interface BookmarkedDataset {
  id: string;
  dataset: DatasetSummary;
  created_at: string;
}

export const useBookmarkedDatasets = (
  params?: BookmarkListParams,
  isAuthenticated: boolean = false
) => {
  const requestParams = { ...params, summary: true };
  return useQuery({
    queryKey: bookmarkKeys.list(requestParams),
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get<BookmarkedDataset[]>(
        '/datasets/my-bookmarks/',
        { params: requestParams, signal }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    enabled: !!isAuthenticated, // Only fetch if the user is authenticated
  });
};
