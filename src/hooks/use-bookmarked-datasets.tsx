import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';
import useApi from './use-api';
import { FancyToast } from '@/lib/utils/toaster';
import { extractCorrectErrorMessage } from '@/lib/error';
import {
  datasetBookmarksKeys,
  datasetsKeys,
} from '@/lib/features/dataset-keys';
import type { IDataset } from '@/lib/types/data-set';

interface IBookMarkedDataset {
  id: number;
  dataset: IDataset;
  user: string;
}

interface UseBookmarksOptions {
  enableAutoRefresh?: boolean;
}

class BookmarkError extends Error {
  public status?: number;
  public code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'BookmarkError';
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, BookmarkError.prototype);
  }
}

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const { enableAutoRefresh = true } = options;
  const auth = useAuth();
  const { privateApi } = useApi();
  const queryClient = useQueryClient();

  // Fetch bookmarked datasets
  const fetchBookmarkedDatasets = useCallback(async () => {
    try {
      const response = await privateApi.get<IBookMarkedDataset[]>(
        '/data/saved-datasets/',
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bookmarked datasets:', error);
      throw error;
    }
  }, [privateApi]);

  // Query for bookmarked datasets
  const {
    data: bookmarkedDatasetsResponse = [],
    isLoading: isBookmarkedDatasetsLoading,
    error: bookmarkedDatasetsError,
    isFetching,
    refetch: refetchBookmarks,
  } = useQuery({
    queryKey: datasetBookmarksKeys.all,
    queryFn: fetchBookmarkedDatasets,
    enabled: auth.isAuthenticated,
    staleTime: enableAutoRefresh ? 30_000 : 120_000,
    gcTime: 600_000,
    retry: (failureCount, error) => {
      const err = error as BookmarkError;
      if ([401, 403, 404].includes(err?.status || 0)) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Derived data
  const bookmarkedDatasets = bookmarkedDatasetsResponse;
  const bookmarkedDatasetsList = (bookmarkedDatasets || []).filter(
    (d) => d?.['dataset'] && d.dataset.id,
  ) as IBookMarkedDataset[];
  const bookmarkedDatasetIds = useMemo(
    () => new Set(bookmarkedDatasetsList.map((d) => d.dataset.id.toString())),
    [bookmarkedDatasetsList],
  );

  // Add bookmark mutation with optimistic update
  const addBookmarkMutation = useMutation({
    mutationFn: async (datasetId: string) => {
      if (!auth.isAuthenticated) {
        throw new BookmarkError('Please log in to save datasets.');
      }
      if (bookmarkedDatasetIds.has(datasetId)) {
        throw new BookmarkError('This dataset is already saved.');
      }
      await privateApi.post('/data/saved-datasets/', { dataset: datasetId });
    },
    onMutate: async (_datasetId) => {
      await queryClient.cancelQueries({ queryKey: datasetBookmarksKeys.all });

      const previousBookmarks =
        queryClient.getQueryData<IBookMarkedDataset[]>(
          datasetBookmarksKeys.all,
        ) || [];
      await queryClient.refetchQueries({
        queryKey: datasetsKeys.all,
        exact: true,
      });
      // Optimistically add to bookmarks
      // queryClient.setQueryData(datasetBookmarksKeys.all, [
      //   ...previousBookmarks,
      //   {
      //     id: Math.random(), // Temporary ID
      //     dataset: { id: datasetId } as IDataset,
      //     user: auth.state?.userId || 'random-user-id', // Temporary user ID
      //   } as IBookMarkedDataset,
      // ]);

      return { previousBookmarks };
    },
    onSuccess: () => {
      FancyToast.success('Dataset saved successfully!', {
        theme: 'light',
        duration: 3000,
      });
    },
    onError: (error, _datasetId, context) => {
      // Revert optimistic update
      if (context?.previousBookmarks) {
        queryClient.setQueryData(
          datasetBookmarksKeys.all,
          context.previousBookmarks,
        );
      }

      FancyToast.error(
        extractCorrectErrorMessage(
          error,
          'Failed to save dataset. Please try again.',
        ),
        { theme: 'light', duration: 5000 },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: datasetBookmarksKeys.all });
    },
  });

  // Remove bookmark mutation with optimistic update
  const removeBookmarkMutation = useMutation({
    mutationFn: async (datasetId: string) => {
      if (!auth.isAuthenticated) {
        throw new BookmarkError('Please log in to manage bookmarks.');
      }

      const bookmarkToRemove = bookmarkedDatasets.find(
        (d) => d.dataset.id.toString() === datasetId,
      );

      if (!bookmarkToRemove) {
        throw new BookmarkError('This dataset is not saved.');
      }

      await privateApi.delete(`/data/saved-datasets/${bookmarkToRemove.id}/`);
    },
    onMutate: async (_datasetId) => {
      await queryClient.cancelQueries({ queryKey: datasetBookmarksKeys.all });

      const previousBookmarks =
        queryClient.getQueryData<IBookMarkedDataset[]>(
          datasetBookmarksKeys.all,
        ) || [];
      await queryClient.refetchQueries({
        queryKey: datasetsKeys.all,
        exact: true,
      });
      // Optimistically remove from bookmarks
      // queryClient.setQueryData(
      //   datasetBookmarksKeys.all,
      //   previousBookmarks.filter((b) => b.dataset.id.toString() !== datasetId),
      // );

      return { previousBookmarks };
    },
    onSuccess: () => {
      FancyToast.success('Dataset removed from saved items!', {
        theme: 'light',
        duration: 3000,
      });
    },
    onError: (error, _datasetId, context) => {
      // Revert optimistic update
      if (context?.previousBookmarks) {
        queryClient.setQueryData(
          datasetBookmarksKeys.all,
          context.previousBookmarks,
        );
      }

      FancyToast.error(
        extractCorrectErrorMessage(
          error,
          'Failed to remove bookmark. Please try again.',
        ),
        { theme: 'light', duration: 5000 },
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: datasetBookmarksKeys.all,
      });
    },
  });

  // Helper functions
  const isDatasetBookmarked = useCallback(
    (datasetId: string) => bookmarkedDatasetIds.has(datasetId),
    [bookmarkedDatasetIds],
  );

  return {
    // Data
    bookmarkedDatasets,
    bookmarkedDatasetIds: Array.from(bookmarkedDatasetIds),

    // Loading states
    isLoading: isBookmarkedDatasetsLoading,
    isFetching,

    // Error handling
    error: bookmarkedDatasetsError,

    // Actions
    isDatasetBookmarked,
    refetchBookmarks,

    // Mutations
    addBookmarkMutation,
    removeBookmarkMutation,

    // Mutation states
    isAddingBookmark: addBookmarkMutation.isPending,
    isRemovingBookmark: removeBookmarkMutation.isPending,
  };
}

// Enhanced dataset mapper
export function useDatasetMapper(
  datasets: IDataset[],
  options?: { skipBookmarkCheck?: boolean },
) {
  const { skipBookmarkCheck = false } = options || {};
  const { bookmarkedDatasetIds } = useBookmarks();

  return useMemo(() => {
    return datasets.map((dataset) => ({
      ...dataset,
      is_bookmarked: skipBookmarkCheck
        ? false
        : bookmarkedDatasetIds.includes(dataset.id.toString()),
    }));
  }, [datasets, bookmarkedDatasetIds, skipBookmarkCheck]);
}

// Bookmark statistics hook
export function useBookmarkStats() {
  const { bookmarkedDatasets, isLoading, error } = useBookmarks();

  return useMemo(
    () => ({
      totalBookmarks: bookmarkedDatasets.length,
      isLoading,
      error,
      hasBookmarks: bookmarkedDatasets.length > 0,
    }),
    [bookmarkedDatasets, isLoading, error],
  );
}
