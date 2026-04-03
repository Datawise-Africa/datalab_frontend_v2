import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { bookmarkKeys } from './query-keys';
import type { Paginated } from '~/lib/types';
import type { MyDatasetInterface } from '~/features/my-datasets/types';

interface BookmarkListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: unknown;
}

export interface BookmarkedDataset {
  id: string;
  dataset: MyDatasetInterface;
  created_at: string;
}

export const useBookmarkedDatasets = (params?: BookmarkListParams) => {
  return useQuery({
    queryKey: bookmarkKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<BookmarkedDataset>>(
        '/datasets/my-bookmarks/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
};
