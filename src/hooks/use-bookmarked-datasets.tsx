import {
  DEFAULT_PAGINATION,
  type PaginatedResponse,
  type PaginationParamsInterface,
} from '@/constants/pagination';
import { useAuth } from '@/context/AuthProvider';
import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import useApi from './use-api';
import { useCallback, useMemo, useState } from 'react';
import type { DatasetSortOptions } from './use-datasets';
import { datasetFiltersToSearchParams } from '@/lib/utils/dataset-filter-options-to-params';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  datasetBookmarksKeys,
  datasetsKeys,
} from '@/lib/features/dataset-keys';
import { FancyToast } from '@/lib/utils/toaster';
import { extractCorrectErrorMessage } from '@/lib/error';

interface IBookMarkedDataset {
  id: number;
  dataset: IDataset;
  user: string;
}

interface UseBookmarksOptions {
  initialFilters?: DatasetFilterOptions;
  initialSort?: DatasetSortOptions;
  initialPagination?: PaginationParamsInterface;
  enableAutoRefresh?: boolean;
}

interface BookmarkError extends Error {
  status?: number;
  code?: string;
}

class BookmarkError extends Error {
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'BookmarkError';
    this.status = status;
    this.code = code;
  }
}

const DEFAULT_FILTERS: DatasetFilterOptions = {
  accessLevel: [],
  dataType: [],
  region: [],
  timeframe: [],
};

// const DEFAULT_PAGINATION: PaginationParamsInterface = { page: 1, limit: 10 };
const DEFAULT_SORT: DatasetSortOptions = 'Most Recent';

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const {
    initialFilters = DEFAULT_FILTERS,
    initialSort = DEFAULT_SORT,
    initialPagination = DEFAULT_PAGINATION,
    enableAutoRefresh = false,
  } = options;

  const auth = useAuth();
  const { privateApi } = useApi();
  const queryClient = useQueryClient();

  // State management
  const [filters, setFilters] = useState<DatasetFilterOptions>(initialFilters);
  const [sort, setSort] = useState<DatasetSortOptions>(initialSort);
  const [pagination, setPagination] =
    useState<PaginationParamsInterface>(initialPagination);

  // Memoized values
  const activeFilters = useMemo(
    () => Object.values(filters).reduce((acc, val) => acc + val.length, 0),
    [filters],
  );

  const buildQueryParams = useCallback(
    (
      paginationParams: PaginationParamsInterface,
      sortParam: DatasetSortOptions,
    ): URLSearchParams => {
      const params = new URLSearchParams();

      // Pagination
      params.append('page', paginationParams.page.toString());
      params.append('limit', paginationParams.limit.toString());

      // Sorting
      const sortField =
        sortParam === 'Popular' ? 'download_count' : 'created_at';
      params.append('sort', sortField);
      params.append('order', 'desc');

      return params;
    },
    [],
  );

  // Fetch bookmarked datasets with enhanced error handling
  const fetchBookmarkedDatasets = useCallback(async (): Promise<
    PaginatedResponse<IBookMarkedDataset>
  > => {
    try {
      const params = new URLSearchParams();

      // Add filters if any are active
      if (activeFilters > 0) {
        const filtersParams = datasetFiltersToSearchParams(filters);
        filtersParams.forEach((value, key) => params.append(key, value));
      }

      // Add pagination and sorting
      const queryParams = buildQueryParams(pagination, sort);
      queryParams.forEach((value, key) => params.append(key, value));

      const response = await privateApi.get<
        PaginatedResponse<IBookMarkedDataset>
      >(`/data/saved-datasets/?${params.toString()}`);

      return response.data;
    } catch (error) {
      console.error('Failed to fetch bookmarked datasets:', error);
      throw error;
    }
  }, [filters, pagination, sort, activeFilters, privateApi, buildQueryParams]);

  // Enhanced query with better configuration
  const {
    data: bookmarkedDatasetsResponse,
    isLoading: isBookmarkedDatasetsLoading,
    error: bookmarkedDatasetsError,
    isPlaceholderData,
    refetch: refetchBookmarks,
    isFetching,
  } = useQuery({
    queryKey: datasetBookmarksKeys.filtered(filters, pagination, sort),
    queryFn: fetchBookmarkedDatasets,
    enabled: auth.isAuthenticated,
    placeholderData: (previousData) => previousData,
    staleTime: enableAutoRefresh ? 30 * 1000 : 2 * 60 * 1000, // 30s if auto-refresh, 2min otherwise
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      const err = error as BookmarkError;
      // Don't retry on 404 or auth errors
      if (err?.status === 404 || err?.status === 401 || err?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  // Derived data
  const bookmarkedDatasets = useMemo(
    () => bookmarkedDatasetsResponse?.data ?? [],
    [bookmarkedDatasetsResponse?.data],
  );

  const paginationMeta = useMemo(
    () => bookmarkedDatasetsResponse?.meta,
    [bookmarkedDatasetsResponse?.meta],
  );

  const bookmarkedDatasetIds = useMemo(
    () =>
      new Set(
        bookmarkedDatasets.map((dataset) => dataset.dataset.id.toString()),
      ),
    [bookmarkedDatasets],
  );

  // Enhanced bookmark operations with better error handling
  const addBookmark = useCallback(
    async (datasetId: string): Promise<void> => {
      try {
        if (!auth.isAuthenticated) {
          throw new BookmarkError('Please log in to save datasets.');
        }

        if (bookmarkedDatasetIds.has(datasetId)) {
          throw new BookmarkError('This dataset is already saved.');
        }
        await privateApi.post('/data/saved-datasets/', { dataset: datasetId });
        console.log(`✅ Bookmark added for dataset ${datasetId}`);
        FancyToast.success('Dataset saved successfully!', {
          theme: 'light',
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to add bookmark:', error);
        // throw new BookmarkError('Failed to save dataset. Please try again.');
        FancyToast.error(
          extractCorrectErrorMessage(
            error,
            'Failed to save dataset. Please try again.',
          ),
          { theme: 'light', duration: 5000 },
        );
      }
    },
    [auth.isAuthenticated, bookmarkedDatasetIds, privateApi],
  );

  const removeBookmark = useCallback(
    async (datasetId: string): Promise<void> => {
      if (!auth.isAuthenticated) {
        throw new BookmarkError('Please log in to manage bookmarks.');
      }

      try {
        await privateApi.delete(`/data/saved-datasets/${datasetId}/`);
        console.log(`❌ Bookmark removed for dataset ${datasetId}`);
        FancyToast.success('Dataset removed from saved items!', {
          theme: 'light',
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to remove bookmark:', error);
        // throw new BookmarkError('Failed to remove bookmark. Please try again.');
        FancyToast.error(
          extractCorrectErrorMessage(
            error,
            'Failed to remove bookmark. Please try again.',
          ),
          { theme: 'light', duration: 5000 },
        );
      }
    },
    [auth.isAuthenticated, privateApi],
  );

  // Optimized bookmark check using Set
  const isDatasetBookmarked = useCallback(
    (datasetId: string): boolean => bookmarkedDatasetIds.has(datasetId),
    [bookmarkedDatasetIds],
  );

  // Enhanced mutation with optimistic updates
  const addOrRemoveBookmarkMutation = useMutation({
    mutationFn: async (datasetId: string) => {
      const isBookmarked = isDatasetBookmarked(datasetId);

      if (isBookmarked) {
        await removeBookmark(datasetId);
        return { action: 'removed', datasetId };
      } else {
        await addBookmark(datasetId);
        return { action: 'added', datasetId };
      }
    },
    onMutate: async (datasetId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: datasetBookmarksKeys.all });

      // Snapshot previous value
      const previousBookmarks = queryClient.getQueryData(
        datasetBookmarksKeys.all,
      );
      // Invalidate the query to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: [...datasetBookmarksKeys.all, datasetsKeys.all],
      });

      // Optimistically update
      const isCurrentlyBookmarked = isDatasetBookmarked(datasetId);
      queryClient.setQueryData(
        datasetBookmarksKeys.filtered(filters, pagination, sort),
        (old: PaginatedResponse<IBookMarkedDataset> | undefined) => {
          if (!old) return old;

          if (isCurrentlyBookmarked) {
            // Remove from bookmarks
            return {
              ...old,
              data: old.data.filter(
                (item) => item.dataset.id.toString() !== datasetId,
              ),
              meta: old.meta
                ? { ...old.meta, total: old.meta.total_docs - 1 }
                : undefined,
            };
          }
          // Note: Adding is more complex as we need the full dataset object
          return old;
        },
      );

      return { previousBookmarks };
    },
    onError: (error, _datasetId, context) => {
      // Revert optimistic update on error
      if (context?.previousBookmarks) {
        queryClient.setQueryData(
          datasetBookmarksKeys.all,
          context.previousBookmarks,
        );
      }
      console.error('Bookmark operation failed:', error);
    },
    onSuccess: (result) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: datasetBookmarksKeys.all,
      });

      const { action, datasetId } = result;
      console.log(`Bookmark ${action} successfully for dataset ${datasetId}`);
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({
        queryKey: datasetBookmarksKeys.filtered(filters, pagination, sort),
      });
    },
  });

  // Utility functions for state management
  const updateFilters = useCallback(
    (newFilters: Partial<DatasetFilterOptions>) => {
      setFilters((prev) => {
        return Object.entries(prev).reduce<DatasetFilterOptions>(
          (acc, [key, value]) => ({
            ...acc,
            [key]: Array.isArray(value)
              ? [...new Set([...value, ...(newFilters[key] || [])])]
              : (newFilters[key] ?? value),
          }),
          {} as DatasetFilterOptions,
        );
      });
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
    },
    [],
  );

  const updateSort = useCallback((newSort: DatasetSortOptions) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const updatePagination = useCallback(
    (newPagination: Partial<PaginationParamsInterface>) => {
      setPagination((prev) => ({ ...prev, ...newPagination }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort(DEFAULT_SORT);
    setPagination(DEFAULT_PAGINATION);
  }, []);

  // Enhanced return object with better organization
  return {
    // Data
    bookmarkedDatasets,
    bookmarkedDatasetIds: Array.from(bookmarkedDatasetIds), // Convert Set back to array for compatibility
    paginationMeta, // Fixed typo from "poagination"

    // State
    filters,
    sort,
    pagination,
    activeFilters,

    // Loading states
    isLoading: isBookmarkedDatasetsLoading,
    isFetching,
    isPlaceholderData,

    // Error handling
    error: bookmarkedDatasetsError,

    // Actions
    addBookmark,
    removeBookmark,
    isDatasetBookmarked,
    toggleBookmark: addOrRemoveBookmarkMutation.mutateAsync,

    // State management
    updateFilters,
    updateSort,
    updatePagination,
    resetFilters,
    setFilters,
    setSort,
    setPagination,

    // Utilities
    refetchBookmarks,

    // Mutation state
    isToggling: addOrRemoveBookmarkMutation.isPending,
    toggleError: addOrRemoveBookmarkMutation.error,
  };
}

// Enhanced dataset mapper with better performance
export interface EnhancedDataset extends IDataset {
  is_bookmarked: boolean;
}

export function useDatasetMapper(
  datasets: IDataset[],
  options?: { skipBookmarkCheck?: boolean },
): EnhancedDataset[] {
  const { skipBookmarkCheck = false } = options ?? {};
  const { isDatasetBookmarked } = useBookmarks();

  return useMemo(() => {
    if (skipBookmarkCheck) {
      return datasets.map((dataset) => ({
        ...dataset,
        is_bookmarked: false,
      }));
    }

    return datasets.map((dataset) => ({
      ...dataset,
      is_bookmarked: isDatasetBookmarked(dataset.id.toString()),
    }));
  }, [datasets, isDatasetBookmarked, skipBookmarkCheck]);
}

// Additional utility hook for bookmark statistics
export function useBookmarkStats() {
  const { bookmarkedDatasets, isLoading, error } = useBookmarks();

  return useMemo(
    () => ({
      totalBookmarks: bookmarkedDatasets.length,
      isLoading,
      error,
      hasBookmarks: bookmarkedDatasets.length > 0,
    }),
    [bookmarkedDatasets.length, isLoading, error],
  );
}
