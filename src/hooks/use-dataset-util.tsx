import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { datasetsKeys } from '@/lib/features/dataset-keys';
import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import {
  useDatasetFilters,
  useDatasetPagination,
  useDatasetSearch,
  useDatasetStore,
  type DatasetSortOptions,
} from '@/store/use-dataset-controls';
import { useShallow } from 'zustand/react/shallow';
/**
 * Hook for managing dataset search functionality
 * Use this when you only need search-related functionality
 */
export const useDatasetSearchManager = () => {
  const {
    searchedDatasets,
    hasSearched,
    searchQuery,
    isSearchLoading,
    setSearchedDatasets,
    setHasSearched,
    setSearchQuery,
    resetSearch,
    setIsSearchLoading,
  } = useDatasetSearch();

  const { showModal } = useDatasetStore();

  const handleSearch = useCallback(
    (results: IDataset[], query: string) => {
      setSearchQuery(query);
      setSearchedDatasets(results);
      setHasSearched(true);

      if (results.length === 0) {
        showModal('No datasets found for your search');
      }
    },
    [setSearchQuery, setSearchedDatasets, setHasSearched, showModal],
  );

  const clearSearch = useCallback(() => {
    resetSearch();
  }, [resetSearch]);

  return {
    searchedDatasets,
    hasSearched,
    searchQuery,
    isSearchLoading,
    handleSearch,
    clearSearch,
    setSearchQuery,
    setSearchedDatasets,
    setIsSearchLoading,
  };
};

/**
 * Hook for managing dataset filters
 * Use this in filter components
 */
export const useDatasetFilterManager = () => {
  const {
    filters,
    activeFiltersCount,
    setFilters,
    updateFilter,
    resetFilters,
    clearSpecificFilter,
  } = useDatasetFilters();

  const queryClient = useQueryClient();

  const handleFilterChange = useCallback(
    (newFilters: DatasetFilterOptions) => {
      const prevActiveFilters = activeFiltersCount;
      const newActiveFilters = Object.values(newFilters).reduce(
        (acc, val) => acc + val.length,
        0,
      );

      setFilters(newFilters);

      // Invalidate queries when switching between filtered/unfiltered
      if (
        (prevActiveFilters === 0 && newActiveFilters > 0) ||
        (prevActiveFilters > 0 && newActiveFilters === 0)
      ) {
        queryClient.invalidateQueries({ queryKey: datasetsKeys.lists() });
      }
    },
    [activeFiltersCount, setFilters, queryClient],
  );

  const handleSingleFilterUpdate = useCallback(
    <K extends keyof DatasetFilterOptions>(
      key: K,
      value: DatasetFilterOptions[K],
    ) => {
      updateFilter(key, value);
    },
    [updateFilter],
  );

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    setFilters: handleFilterChange,
    updateFilter: handleSingleFilterUpdate,
    resetFilters,
    clearSpecificFilter,
  };
};

/**
 * Hook for managing dataset pagination
 * Use this in pagination components
 */
export const useDatasetPaginationManager = () => {
  const {
    pagination,
    setPagination,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
    resetPagination,
  } = useDatasetPagination();

  const createPaginationHandler = useCallback(
    (totalPages: number) => ({
      goToNext: () => goToNextPage(totalPages),
      goToPrevious: goToPreviousPage,
      goToPage,
      changePageSize,
    }),
    [goToNextPage, goToPreviousPage, goToPage, changePageSize],
  );

  return {
    pagination,
    setPagination,
    resetPagination,
    createPaginationHandler,
    // Direct handlers (when you know total pages)
    goToPage,
    goToPreviousPage,
    changePageSize,
    // Helper to create handlers with totalPages bound
    withTotalPages: createPaginationHandler,
  };
};

/**
 * Hook for managing dataset sorting
 * Use this in sort components
 */
export const useDatasetSortManager = () => {
  const { sort, setSort } = useDatasetStore(
    useShallow((state) => ({
      sort: state.sort,
      setSort: state.setSort,
    })),
  );

  const sortOptions: DatasetSortOptions[] = ['Most Recent', 'Popular'];

  const handleSortChange = useCallback(
    (newSort: DatasetSortOptions) => {
      setSort(newSort);
    },
    [setSort],
  );

  return {
    sort,
    sortOptions,
    setSort: handleSortChange,
  };
};

/**
 * Hook for managing dataset modals
 * Use this in modal components
 */
export const useDatasetModalManager = () => {
  const {
    isDatasetModalOpen,
    modalMessage,
    setIsDatasetModalOpen,
    setModalMessage,
    showModal,
    hideModal,
  } = useDatasetStore((state) => ({
    isDatasetModalOpen: state.isDatasetModalOpen,
    modalMessage: state.modalMessage,
    setIsDatasetModalOpen: state.setIsDatasetModalOpen,
    setModalMessage: state.setModalMessage,
    showModal: state.showModal,
    hideModal: state.hideModal,
  }));

  return {
    isOpen: isDatasetModalOpen,
    message: modalMessage,
    open: setIsDatasetModalOpen,
    setMessage: setModalMessage,
    show: showModal,
    hide: hideModal,
  };
};

/**
 * Hook for getting current dataset state (read-only)
 * Use this when you only need to read the current state
 */
export const useDatasetState = () => {
  return useDatasetStore(
    useShallow((state) => ({
      filters: state.filters,
      sort: state.sort,
      pagination: state.pagination,
      searchQuery: state.searchQuery,
      hasSearched: state.hasSearched,
      activeFiltersCount: state.activeFiltersCount,
      isLoading: state.isLoading,
      isLoadingNewPage: state.isLoadingNewPage,
    })),
  );
};

/**
 * Hook for resetting dataset state
 * Use this when you need to reset various parts of the state
 */
export const useDatasetStateReset = () => {
  const {
    resetSearch,
    resetFilters,
    resetPagination,
    resetAllFiltersAndPagination,
    resetToInitialState,
  } = useDatasetStore((state) => ({
    resetSearch: state.resetSearch,
    resetFilters: state.resetFilters,
    resetPagination: state.resetPagination,
    resetAllFiltersAndPagination: state.resetAllFiltersAndPagination,
    resetToInitialState: state.resetToInitialState,
  }));

  return {
    resetSearch,
    resetFilters,
    resetPagination,
    resetAllFiltersAndPagination,
    resetToInitialState,
  };
};

/**
 * Hook for URL synchronization
 * Use this to sync dataset state with URL parameters
 */
export const useDatasetURLSync = () => {
  const { filters, sort, pagination, searchQuery } = useDatasetState();
  const { setFilters } = useDatasetFilters();
  const { setSort } = useDatasetStore();
  const { setPagination } = useDatasetPagination();
  const { setSearchQuery } = useDatasetSearch();

  const syncFromURL = useCallback(
    (urlParams: URLSearchParams) => {
      // Sync filters from URL
      const urlFilters: DatasetFilterOptions = {
        accessLevel: urlParams.getAll('accessLevel'),
        dataType: urlParams.getAll('dataType'),
        region: urlParams.getAll('region'),
        timeframe: urlParams.getAll('timeframe'),
      };

      // Only update if there are actual filter values
      const hasFilters = Object.values(urlFilters).some(
        (arr) => arr.length > 0,
      );
      if (hasFilters) {
        setFilters(urlFilters);
      }

      // Sync sort from URL
      const urlSort = urlParams.get('sort') as DatasetSortOptions;
      if (urlSort && ['Most Recent', 'Popular'].includes(urlSort)) {
        setSort(urlSort);
      }

      // Sync pagination from URL
      const page = urlParams.get('page');
      const limit = urlParams.get('limit');
      if (page || limit) {
        setPagination({
          ...(page && { page: parseInt(page, 10) }),
          ...(limit && { limit: parseInt(limit, 10) }),
        });
      }

      // Sync search query from URL
      const query = urlParams.get('q');
      if (query) {
        setSearchQuery(query);
      }
    },
    [setFilters, setSort, setPagination, setSearchQuery],
  );

  const syncToURL = useCallback((): URLSearchParams => {
    const params = new URLSearchParams();

    // Add filters to URL
    Object.entries(filters).forEach(([key, values]) => {
      values.forEach((value) => params.append(key, value));
    });

    // Add sort to URL
    if (sort !== 'Most Recent') {
      params.set('sort', sort);
    }

    // Add pagination to URL
    if (pagination.page > 1) {
      params.set('page', pagination.page.toString());
    }
    if (pagination.limit !== 10) {
      params.set('limit', pagination.limit.toString());
    }

    // Add search query to URL
    if (searchQuery) {
      params.set('q', searchQuery);
    }

    return params;
  }, [filters, sort, pagination, searchQuery]);

  return {
    syncFromURL,
    syncToURL,
    currentState: {
      filters,
      sort,
      pagination,
      searchQuery,
    },
  };
};
