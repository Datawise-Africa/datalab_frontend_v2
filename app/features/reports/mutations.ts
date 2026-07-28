import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { reportKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';
import type { ReportDownloadReadyResponse } from '~/lib/types/report';

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
 * POST /reports/{id}/request-download/ — returns presigned URLs for the files on
 * the report's LATEST version (the backend serializer filters `is_latest=True`,
 * so there is nothing to select and `files` can legitimately come back empty).
 *
 * Unlike datasets there is no payment branch: premium reports fail with 403
 * ("Premium report downloads are not enabled yet.") or 404, surfaced through
 * `onError`. The caller is expected to render the returned files — the server
 * records a download on every 200, so a discarded response inflates
 * `downloads_count` for nothing.
 */
export function useRequestReportDownload() {
  return useMutation({
    mutationFn: async (id: string): Promise<ReportDownloadReadyResponse> => {
      const { data } = await apiClient.post<ReportDownloadReadyResponse>(
        `/reports/${id}/request-download/`
      );
      return data;
    },
    onError: (error) => {
      toastUtils.error('Download failed', extractError(error));
    },
  });
}
