import type { IDataset } from '@/lib/types/data-set';
import React, { useCallback, useMemo } from 'react';
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import useApi from './use-api';
import { datasetFiltersToSearchParams } from '@/lib/utils/dataset-filter-options-to-params';
import {
  DEFAULT_PAGINATION_META,
  type PaginatedResponse,
  type PaginationMetaInterface,
} from '@/constants/pagination';
import {
  datasetBookmarksKeys,
  datasetsKeys,
} from '@/lib/features/dataset-keys';
import { useAuth } from '@/context/AuthProvider';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useDatasetMapper } from './use-bookmarked-datasets';
import {
  useDatasetFilterManager,
  useDatasetModal,
  useDatasetPagination,
  useDatasetSearch,
  useDatasetSort,
  useDatasetUI,
} from '@/store/use-dataset-controls';

interface BookmarkResponse {
  id: string;
  dataset_id: string;
  user_id: string;
  created_at: string;
}

export default function useDatasets() {
  const auth = useAuth();
  const { privateApi, publicApi } = useApi();
  const queryClient = useQueryClient();

  // Use Zustand store selectors
  const { filters, activeFiltersCount } = useDatasetFilterManager();

  const {
    pagination,
    goToPage,
    goToNextPage: storeGoToNextPage,
    goToPreviousPage,
    changePageSize,
  } = useDatasetPagination();

  const { searchedDatasets, hasSearched } = useDatasetSearch();

  const { sort } = useDatasetSort();

  const { showModal } = useDatasetModal();

  const { isLoading: storeIsLoading, isLoadingNewPage: storeIsLoadingNewPage } =
    useDatasetUI();

  // Build query parameters
  const buildQueryParams = useCallback(
    (paginationParams: typeof pagination, sortParam: typeof sort) => {
      const params = new URLSearchParams();
      params.append('page', paginationParams.page.toString());
      params.append('limit', paginationParams.limit.toString());
      params.append(
        'sort',
        sortParam === 'Popular' ? 'download_count' : 'created_at',
      );
      params.append('order', 'desc');
      return params;
    },
    [],
  );

  // Main datasets query with pagination
  const {
    data: datasetsResponse,
    isLoading: isDatasetsLoading,
    error: datasetsError,
  } = useQuery({
    queryKey: datasetsKeys.list(pagination, sort),
    queryFn: async (): Promise<PaginatedResponse<IDataset>> => {
      const queryParams = buildQueryParams(pagination, sort);
      const response = await publicApi.get<PaginatedResponse<IDataset>>(
        `/data/datasets/?${queryParams.toString()}`,
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    initialData: () => {
      if (activeFiltersCount > 0) {
        return {
          data: [],
          meta: DEFAULT_PAGINATION_META,
        };
      }
      return undefined;
    },
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Filtered datasets query with pagination
  const {
    data: filteredDatasetsResponse,
    isLoading: isFilteredDataLoading,
    error: filteredError,
  } = useQuery({
    queryKey: datasetsKeys.filtered(filters, pagination, sort),
    queryFn: async (): Promise<PaginatedResponse<IDataset>> => {
      const filtersParams = datasetFiltersToSearchParams(filters);
      const queryParams = buildQueryParams(pagination, sort);

      const combinedParams = new URLSearchParams([
        ...Array.from(filtersParams.entries()),
        ...Array.from(queryParams.entries()),
      ]);

      const response = await publicApi.get<PaginatedResponse<IDataset>>(
        `/data/filter/?${combinedParams.toString()}`,
      );
      return response.data;
    },
    enabled: activeFiltersCount > 0,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    initialData: () => {
      if (activeFiltersCount > 0) {
        return {
          data: [],
          meta: DEFAULT_PAGINATION_META,
        };
      }
      return undefined;
    },
  });

  // Handle filtered data errors
  React.useEffect(() => {
    if (filteredError && activeFiltersCount > 0) {
      const noDataMessage = 'No data available under this category yet';
      console.error('Error fetching filtered data:', filteredError);
      showModal(noDataMessage);
    }
  }, [filteredError, activeFiltersCount, showModal]);

  // Extract current data and pagination meta
  const currentResponse = useMemo(() => {
    if (activeFiltersCount > 0) {
      return filteredDatasetsResponse;
    }
    return datasetsResponse;
  }, [activeFiltersCount, filteredDatasetsResponse, datasetsResponse]);

  const rawDatasets = currentResponse?.data || [];
  const paginationMeta: PaginationMetaInterface =
    currentResponse?.meta || DEFAULT_PAGINATION_META;

  // Map datasets with bookmark status
  const enhancedDatasets = useDatasetMapper(rawDatasets);
  const enhancedSearchResults = useDatasetMapper(searchedDatasets);

  // For search results, handle them separately without server-side pagination
  const data = useMemo(() => {
    if (hasSearched && enhancedSearchResults.length > 0) {
      // For search results, apply client-side sorting
      return [...enhancedSearchResults].sort((a, b) => {
        if (sort === 'Popular') {
          return b.download_count - a.download_count;
        } else if (sort === 'Most Recent') {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });
    }

    return enhancedDatasets;
  }, [enhancedDatasets, enhancedSearchResults, hasSearched, sort]);

  // Enhanced pagination handler that works with server pagination
  const goToNextPage = useCallback(() => {
    storeGoToNextPage(paginationMeta.total_pages);
  }, [storeGoToNextPage, paginationMeta.total_pages]);

  // Prefetch next page for better UX
  const prefetchNextPage = useCallback(async () => {
    if (paginationMeta.page < paginationMeta.total_pages) {
      const nextPagePagination = { ...pagination, page: pagination.page + 1 };

      if (activeFiltersCount > 0) {
        await queryClient.prefetchQuery({
          queryKey: datasetsKeys.filtered(filters, nextPagePagination, sort),
          queryFn: async (): Promise<PaginatedResponse<IDataset>> => {
            const filtersParams = datasetFiltersToSearchParams(filters);
            const queryParams = buildQueryParams(nextPagePagination, sort);
            const combinedParams = new URLSearchParams([
              ...Array.from(filtersParams.entries()),
              ...Array.from(queryParams.entries()),
            ]);
            const response = await publicApi.get<PaginatedResponse<IDataset>>(
              `/data/filter/?${combinedParams.toString()}`,
            );
            return response.data;
          },
          staleTime: 2 * 60 * 1000,
        });
      } else {
        await queryClient.prefetchQuery({
          queryKey: datasetsKeys.list(nextPagePagination, sort),
          queryFn: async (): Promise<PaginatedResponse<IDataset>> => {
            const queryParams = buildQueryParams(nextPagePagination, sort);
            const response = await publicApi.get<PaginatedResponse<IDataset>>(
              `/data/datasets/?${queryParams.toString()}`,
            );
            return response.data;
          },
          staleTime: 5 * 60 * 1000,
        });
      }
    }
  }, [
    paginationMeta,
    pagination,
    activeFiltersCount,
    filters,
    sort,
    queryClient,
    publicApi,
    buildQueryParams,
  ]);

  // Auto-prefetch next page when current page loads
  React.useEffect(() => {
    if (!isDatasetsLoading && !isFilteredDataLoading) {
      prefetchNextPage();
    }
  }, [isDatasetsLoading, isFilteredDataLoading, prefetchNextPage]);

  // Refresh function for manual data refresh
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: datasetsKeys.all });
  }, [queryClient]);

  // Fetch user's bookmarks from backend
  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await privateApi.get<BookmarkResponse[]>(
        '/data/saved-datasets/',
      );
      return response.data.map((bookmark) => bookmark.dataset_id);
    } catch (error) {
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, [auth.isAuthenticated, privateApi]);

  const {
    data: bookmarkedDatasetIds,
    isLoading: isBookmarkedDatasetIdsLoading,
  } = useQuery({
    queryKey: datasetBookmarksKeys.all,
    queryFn: fetchBookmarks,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    placeholderData: [],
  });

  // Check if dataset is bookmarked
  const isDatasetBookmarked = useCallback(
    (datasetId: string) => {
      return bookmarkedDatasetIds?.includes(datasetId.toString()) || false;
    },
    [bookmarkedDatasetIds],
  );

  // Pagination info for UI
  const paginationInfo = {
    current_page: paginationMeta.page,
    total_pages: paginationMeta.total_pages,
    total_items: paginationMeta.total_docs,
    items_per_page: paginationMeta.limit,
    has_next_page: paginationMeta.page < paginationMeta.total_pages,
    has_previous_page: paginationMeta.page > 1,
    start_item: (paginationMeta.page - 1) * paginationMeta.limit + 1,
    end_item: Math.min(
      paginationMeta.page * paginationMeta.limit,
      paginationMeta.total_docs,
    ),
  };

  return {
    data,
    isLoading: storeIsLoading,
    isLoadingNewPage: storeIsLoadingNewPage,
    // Pagination
    paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
    prefetchNextPage,
    // Additional utilities
    refreshData,
    hasSearched,
    // Error states
    datasetsError,
    filteredError,
    // Individual loading states
    isDatasetsLoading,
    isFilteredDataLoading,
    isBookmarkedDatasetIdsLoading,
    // Bookmarks
    isDatasetBookmarked,
    // Store state access (for components that need direct access)
  };
}

export type UseDatasetReturnType = ReturnType<typeof useDatasets>;
