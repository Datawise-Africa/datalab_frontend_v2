import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { bookmarkKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datasetId: string): Promise<void> => {
      await apiClient.post(`/datasets/${datasetId}/bookmarks/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      toastUtils.success('Saved', 'Dataset added to your bookmarks.');
    },
    onError: (error) => {
      toastUtils.error('Bookmark failed', extractError(error));
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datasetId: string): Promise<void> => {
      await apiClient.delete(`/datasets/${datasetId}/bookmarks/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() });
      toastUtils.success('Removed', 'Dataset removed from your bookmarks.');
    },
    onError: (error) => {
      toastUtils.error('Remove failed', extractError(error));
    },
  });
};
