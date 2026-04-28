import { useMemo } from 'react';
import { useAppSelector } from '~/store';
import { useBookmarkedDatasets } from './queries';
import { useAddBookmark, useRemoveBookmark } from './mutations';

/**
 * Whether the current user has bookmarked the dataset. Returns `false` for
 * unauthenticated users (they can't have bookmarks). Reads from the cached
 * `/datasets/my-bookmarks/` query — no extra request.
 */
export function useIsBookmarked(datasetId: string | undefined): boolean {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data } = useBookmarkedDatasets({}, isAuthenticated);
  return useMemo(() => {
    if (!datasetId || !data) return false;
    return data.some((b) => b.dataset.id === datasetId);
  }, [datasetId, data]);
}

interface ToggleBookmarkResult {
  isBookmarked: boolean;
  isPending: boolean;
  toggle: () => void;
}

/**
 * Combined add/remove bookmark for a dataset. The returned `toggle` flips the
 * current state — caller doesn't need to know which mutation to call.
 */
export function useToggleBookmark(
  datasetId: string | undefined
): ToggleBookmarkResult {
  const isBookmarked = useIsBookmarked(datasetId);
  const add = useAddBookmark();
  const remove = useRemoveBookmark();

  const toggle = () => {
    if (!datasetId) return;
    if (isBookmarked) {
      remove.mutate(datasetId);
    } else {
      add.mutate(datasetId);
    }
  };

  return {
    isBookmarked,
    isPending: add.isPending || remove.isPending,
    toggle,
  };
}
