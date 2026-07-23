import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { reportKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

/** POST /reports/{id}/bookmarks/ — add. DELETE the same path removes. */
export function useToggleReportBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      bookmarked,
    }: {
      id: string;
      bookmarked: boolean;
    }): Promise<void> => {
      if (bookmarked) {
        await apiClient.delete(`/reports/${id}/bookmarks/`);
      } else {
        await apiClient.post(`/reports/${id}/bookmarks/`);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.bookmarks() });
      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(variables.id),
      });
      // `bookmarked` is the state *before* the toggle, so it tells us which
      // way the request went.
      if (variables.bookmarked) {
        toastUtils.success('Removed', 'Report removed from your bookmarks.');
      } else {
        toastUtils.success('Saved', 'Report added to your bookmarks.');
      }
    },
    onError: (error) => {
      toastUtils.error('Bookmark failed', extractError(error));
    },
  });
}

/**
 * POST /reports/{id}/request-download/ — returns a download URL for the report's
 * files. Mirrors the datasets request-download flow.
 */
export function useRequestReportDownload() {
  return useMutation({
    mutationFn: async (id: string): Promise<unknown> => {
      const { data } = await apiClient.post(`/reports/${id}/request-download/`);
      return data;
    },
    onError: (error) => {
      toastUtils.error('Download failed', extractError(error));
    },
  });
}
