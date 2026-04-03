import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { bookmarkKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datasetId: string): Promise<void> => {
      await apiClient.post('/datasets/my-bookmarks/', {
        dataset: datasetId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Bookmark failed', extractError(error));
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmarkId: string): Promise<void> => {
      await apiClient.delete(`/datasets/my-bookmarks/${bookmarkId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Remove failed', extractError(error));
    },
  });
};
