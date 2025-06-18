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
import { datasetsKeys } from '@/lib/features/dataset-keys';

export type DatasetSortOptions = 'Popular' | 'Most Recent';

export default function useDatasets() {
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

  const api = useApi().publicApi;
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
  console.log({ activeFilters, filters, pagination, sort });

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
      const response = await api.get<PaginatedResponse<IDataset>>(
        `/data/datasets/?${queryParams.toString()}`,
      );
      return response.data;
    },
    placeholderData: keepPreviousData, // Keep previous data while loading new page
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
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

      const response = await api.get<PaginatedResponse<IDataset>>(
        `/data/filter/?${combinedParams.toString()}`,
      );
      return response.data;
    },
    enabled: activeFilters > 0,
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

  const datasets = currentResponse?.data || [];
  const paginationMeta: PaginationMetaInterface =
    currentResponse?.meta || DEFAULT_PAGINATION_META;
  console.log({ activeFilters, datasets, paginationMeta, sort });

  // For search results, we'll handle them separately without server-side pagination
  // since search is typically done on the frontend
  const data = useMemo(() => {
    if (hasSearched && searchedDatasets.length > 0) {
      // For search results, apply client-side sorting
      return [...searchedDatasets].sort((a, b) => {
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
    return datasets;
  }, [datasets, searchedDatasets, hasSearched, sort]);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const goToNextPage = useCallback(() => {
    if (paginationMeta.page < paginationMeta.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [paginationMeta.page, paginationMeta.totalPages]);

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
    if (paginationMeta.page < paginationMeta.totalPages) {
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
            const response = await api.get<PaginatedResponse<IDataset>>(
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
            const response = await api.get<PaginatedResponse<IDataset>>(
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
    api,
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

  // Pagination info for UI
  const paginationInfo = {
    currentPage: paginationMeta.page,
    totalPages: paginationMeta.totalPages,
    totalItems: paginationMeta.totalDocs,
    itemsPerPage: paginationMeta.limit,
    hasNextPage: paginationMeta.page < paginationMeta.totalPages,
    hasPreviousPage: paginationMeta.page > 1,
    startItem: (paginationMeta.page - 1) * paginationMeta.limit + 1,
    endItem: Math.min(
      paginationMeta.page * paginationMeta.limit,
      paginationMeta.totalDocs,
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
  };
}
