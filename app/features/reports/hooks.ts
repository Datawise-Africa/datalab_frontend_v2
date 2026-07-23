import { useMemo } from 'react';
import { useAppSelector } from '~/store';
import { useBookmarkedReports } from './queries';
import { useToggleReportBookmark } from './mutations';

/**
 * Whether the current user has bookmarked the report. Returns `false` for
 * unauthenticated users (they can't have bookmarks). Reads from the cached
 * `/reports/my-bookmarks/` query — no extra request.
 */
export function useIsReportBookmarked(reportId: string | undefined): boolean {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data } = useBookmarkedReports({}, isAuthenticated);
  return useMemo(() => {
    if (!reportId) return false;
    return (data ?? []).some((bookmark) => bookmark.report.id === reportId);
  }, [reportId, data]);
}

interface ReportBookmarkResult {
  isBookmarked: boolean;
  isPending: boolean;
  toggle: () => void;
}

/**
 * Combined add/remove bookmark for a report. The returned `toggle` flips the
 * current state — caller doesn't need to know which direction to send.
 *
 * Mirrors `useToggleBookmark` in `~/features/bookmarks` for datasets.
 */
export function useReportBookmark(
  reportId: string | undefined
): ReportBookmarkResult {
  const isBookmarked = useIsReportBookmarked(reportId);
  const mutation = useToggleReportBookmark();

  const toggle = () => {
    if (!reportId) return;
    mutation.mutate({ id: reportId, bookmarked: isBookmarked });
  };

  return {
    isBookmarked,
    isPending: mutation.isPending,
    toggle,
  };
}
