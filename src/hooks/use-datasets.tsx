import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import React, { useCallback, useMemo, useState } from 'react';
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
  type PaginationParamsInterface,
} from '@/constants/pagination';
import {
  datasetBookmarksKeys,
  datasetsKeys,
} from '@/lib/features/dataset-keys';
import { useAuth } from '@/context/AuthProvider';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useDatasetMapper } from './use-bookmarked-datasets';

export type DatasetSortOptions = 'Popular' | 'Most Recent';
interface BookmarkResponse {
  id: string;
  dataset_id: string;
  user_id: string;
  created_at: string;
}
// type FetchMode = 'Bookmarks' | 'Datasets';
export default function useDatasets() {
  const auth = useAuth();
  const { privateApi, publicApi } = useApi();
  const [searchedDatasets, setSearchedDatasets] = useState<IDataset[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [filters, setFilters] = useState<DatasetFilterOptions>({
    accessLevel: [],
    dataType: [],
    region: [],
    timeframe: [],
  });
  const [sort, setSort] = useState<DatasetSortOptions>('Most Recent');
  const [modalMessage, setModalMessage] = useState<string>('');

  // Pagination state
  const [pagination, setPagination] = useState<PaginationParamsInterface>({
    page: 1,
    limit: DEFAULT_PAGINATION_META.limit || 10,
  });

  // const api = useApi().publicApi;
  const queryClient = useQueryClient();

  const showModal = useCallback((message: string) => {
    setModalMessage(message);
    setIsDatasetModalOpen(true);
  }, []);

  const activeFilters = useMemo(
    () => Object.values(filters).reduce((acc, val) => acc + val.length, 0),
    [filters],
  );

  // Build query parameters
  const buildQueryParams = useCallback(
    (
      paginationParams: PaginationParamsInterface,
      sortParam: DatasetSortOptions,
    ) => {
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
  // console.log({ activeFilters, filters, pagination, sort });

  // Main datasets query with pagination
  const {
    data: datasetsResponse,
    isLoading: isDatasetsLoading,
    error: datasetsError,
    isPlaceholderData: isDatasetsPlaceholderData,
  } = useQuery({
    queryKey: datasetsKeys.list(pagination, sort),
    queryFn: async (): Promise<PaginatedResponse<IDataset>> => {
      const queryParams = buildQueryParams(pagination, sort);
      const response = await publicApi.get<PaginatedResponse<IDataset>>(
        `/data/datasets/?${queryParams.toString()}`,
      );
      return response.data;
    },
    placeholderData: keepPreviousData, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    //   enabled: mode === 'Datasets', // Only fetch if mode is Datasets
  });

  // Filtered datasets query with pagination
  const {
    data: filteredDatasetsResponse,
    isLoading: isFilteredDataLoading,
    error: filteredError,
    isPlaceholderData: isFilteredPlaceholderData,
  } = useQuery({
    queryKey: datasetsKeys.filtered(filters, pagination, sort),
    queryFn: async (): Promise<PaginatedResponse<IDataset>> => {
      const filtersParams = datasetFiltersToSearchParams(filters);
      const queryParams = buildQueryParams(pagination, sort);

      // Combine filter and pagination params
      const combinedParams = new URLSearchParams([
        ...Array.from(filtersParams.entries()),
        ...Array.from(queryParams.entries()),
      ]);

      const response = await publicApi.get<PaginatedResponse<IDataset>>(
        `/data/filter/?${combinedParams.toString()}`,
      );
      return response.data;
    },
    enabled: activeFilters > 0, // && mode === 'Datasets', // Only fetch if there are active filters and mode is Datasets
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes for filtered data
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Handle filtered data errors
  React.useEffect(() => {
    if (filteredError && activeFilters > 0) {
      const noDataMessage = 'No data available under this category yet';
      console.error('Error fetching filtered data:', filteredError);
      showModal(noDataMessage);
    }
  }, [filteredError, activeFilters, showModal]);

  // Extract current data and pagination meta
  const currentResponse = useMemo(() => {
    if (activeFilters > 0) {
      return filteredDatasetsResponse;
    }
    return datasetsResponse;
  }, [activeFilters, filteredDatasetsResponse, datasetsResponse]);

  const rawDatasets = currentResponse?.data || [];
  const paginationMeta: PaginationMetaInterface =
    currentResponse?.meta || DEFAULT_PAGINATION_META;
  // Map datasets with bookmark status
  const enhancedDatasets = useDatasetMapper(rawDatasets);

  // Handle search results
  const enhancedSearchResults = useDatasetMapper(searchedDatasets);

  // For search results, we'll handle them separately without server-side pagination
  // since search is typically done on the frontend
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

    // Server-side sorted data
    return enhancedDatasets;
  }, [rawDatasets, searchedDatasets, hasSearched, sort]);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const goToNextPage = useCallback(() => {
    if (paginationMeta.page < paginationMeta.total_pages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [paginationMeta.page, paginationMeta.total_pages]);

  const goToPreviousPage = useCallback(() => {
    if (paginationMeta.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  }, [paginationMeta.page]);

  const changePageSize = useCallback((limit: number) => {
    setPagination({ page: 1, limit }); // Reset to first page when changing page size
  }, []);

  // Search handlers
  const handleSearchResults = useCallback(
    (results: IDataset[]) => {
      setSearchedDatasets(results);
      setHasSearched(true);
      if (results.length === 0) {
        showModal('No datasets found for your search');
      }
    },
    [showModal],
  );

  const handleSearchReset = useCallback(() => {
    if (searchedDatasets.length === 0) {
      return;
    }
    setSearchedDatasets([]);
    setHasSearched(false);
  }, [searchedDatasets.length]);

  // Enhanced filter setter with pagination reset
  const setFiltersWithReset = useCallback(
    (newFilters: DatasetFilterOptions) => {
      const prevActiveFilters = Object.values(filters).reduce(
        (acc, val) => acc + val.length,
        0,
      );
      const newActiveFilters = Object.values(newFilters).reduce(
        (acc, val) => acc + val.length,
        0,
      );

      setFilters(newFilters);
      // Reset to first page when filters change
      setPagination((prev) => ({ ...prev, page: 1 }));

      // Invalidate queries when switching between filtered/unfiltered
      if (
        (prevActiveFilters === 0 && newActiveFilters > 0) ||
        (prevActiveFilters > 0 && newActiveFilters === 0)
      ) {
        queryClient.invalidateQueries({ queryKey: datasetsKeys.lists() });
      }
    },
    [filters, queryClient],
  );

  // Enhanced sort setter with pagination reset
  const setSortWithReset = useCallback((newSort: DatasetSortOptions) => {
    setSort(newSort);
    // Reset to first page when sort changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Prefetch next page for better UX
  const prefetchNextPage = useCallback(async () => {
    if (paginationMeta.page < paginationMeta.total_pages) {
      const nextPagePagination = { ...pagination, page: pagination.page + 1 };

      if (activeFilters > 0) {
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
    activeFilters,
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

  // Combined loading state
  const pageIsLoading = isDatasetsLoading || isFilteredDataLoading;
  const isLoadingNewPage =
    isDatasetsPlaceholderData || isFilteredPlaceholderData;

  // Refresh function for manual data refresh
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: datasetsKeys.all });
  }, [queryClient]);

  // Fetch user's bookmarks from backend
  const fetchBookmarks = useCallback(async () => {
    // if (!auth.isAuthenticated || mode !== 'Bookmarks') return;
    // setIsBookmarksLoading(true);
    try {
      const response = await privateApi.get<BookmarkResponse[]>(
        '/data/saved-datasets/',
      );
      return response.data.map((bookmark) => bookmark.dataset_id);
      // setBookmarkedDatasets(bookmarkIds);
    } catch (error) {
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, [auth.isAuthenticated]);

  const {
    data: bookmarkedDatasetIds,
    isLoading: isBookmarkedDatasetIdsLoading,
  } = useQuery({
    queryKey: datasetBookmarksKeys.all,
    queryFn: fetchBookmarks,
    // enabled: auth.isAuthenticated && mode === 'Bookmarks',
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    placeholderData: [],
  });

  const handleShareDataset = useCallback(async (dataset: IDataset) => {
    const shareData = {
      title: `Dataset: ${dataset.title}`,
      text: `Check out this dataset: ${dataset.description.slice(0, 100)}...`,
      url: `${window.location.origin}/datasets/${dataset.id}`, // Adjust URL as needed
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        showModal('Dataset shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showModal('Dataset link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing dataset:', error);
      showModal(`Share this dataset: ${shareData.url}`);
    }
  }, []);

  // Check if dataset is bookmarked
  const isDatasetBookmarked = useCallback(
    (datasetId: string) => {
      return bookmarkedDatasetIds!.includes(datasetId.toString());
    },
    [bookmarkedDatasetIds],
  );

  const fetchBookmarkedDatasetsWithDetails = useCallback(async () => {
    try {
      const response = await privateApi.get<PaginatedResponse<IDataset>>(
        '/data/saved-datasets/',
      );
      // setDatasets(response.data);
      return response.data.data;
    } catch (error) {
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, [auth.isAuthenticated, privateApi]);

  const { data: bookmarkedDatasets, isLoading: isBookmarksLoading } = useQuery({
    queryKey: datasetBookmarksKeys.all,
    queryFn: fetchBookmarkedDatasetsWithDetails,
    enabled: auth.isAuthenticated, // Only fetch if authenticated
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    placeholderData: [],
  });
  // Get bookmarked datasets
  const getBookmarkedDatasets = useMemo(() => {
    if (!bookmarkedDatasets || !bookmarkedDatasetIds) {
      return [];
    }
    if (
      Array.isArray(bookmarkedDatasets) &&
      Array.isArray(bookmarkedDatasetIds)
    ) {
      // Filter datasets based on bookmarked IDs
      return bookmarkedDatasets!.filter((dataset) =>
        bookmarkedDatasetIds!.includes(dataset.id.toString()),
      );
    }
    return [];
  }, [bookmarkedDatasets, bookmarkedDatasetIds]);

  // Pagination info for UI
  const paginationInfo = {
    currentPage: paginationMeta.page,
    totalPages: paginationMeta.total_pages,
    totalItems: paginationMeta.total_docs,
    itemsPerPage: paginationMeta.limit,
    hasNextPage: paginationMeta.page < paginationMeta.total_pages,
    hasPreviousPage: paginationMeta.page > 1,
    startItem: (paginationMeta.page - 1) * paginationMeta.limit + 1,
    endItem: Math.min(
      paginationMeta.page * paginationMeta.limit,
      paginationMeta.total_docs,
    ),
  };

  return {
    data,
    isLoading: pageIsLoading,
    isLoadingNewPage, // Useful for showing skeleton while keeping previous data
    handleSearchResults,
    handleSearchReset,
    isDatasetModalOpen,
    setIsDatasetModalOpen,
    modalMessage,
    setSort: setSortWithReset,
    setFilters: setFiltersWithReset,
    filters,
    sort,
    // Pagination
    pagination: paginationInfo,
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
    isBookmarksLoading,
    // Bookmarks
    bookmarkedDatasetIds,
    isDatasetBookmarked,
    // handleBookmarkDataset,
    getBookmarkedDatasets,
    handleShareDataset,
    fetchBookmarkedDatasetsWithDetails,
  };
}

export type UseDatasetReturnType = ReturnType<typeof useDatasets>;
