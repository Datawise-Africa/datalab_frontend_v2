import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { bookmarkKeys } from './query-keys';
import type { IDataset } from '~/lib/types/dataset';

interface BookmarkedDataset {
  id: number;
  dataset: IDataset;
  created_at: string;
}

export const useBookmarkedDatasets = () => {
  return useQuery({
    queryKey: bookmarkKeys.list(),
    queryFn: async (): Promise<BookmarkedDataset[]> => {
      const { data } = await apiClient.get('/data/saved-datasets/');
      return data;
    },
  });
};
