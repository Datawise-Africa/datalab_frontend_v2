import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { bookmarkKeys } from './query-keys';

export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datasetId: string): Promise<void> => {
      await apiClient.post('/data/saved-datasets/', {
        dataset: datasetId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: number): Promise<void> => {
      await apiClient.delete(`/data/saved-datasets/${bookmarkId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
    },
  });
};
