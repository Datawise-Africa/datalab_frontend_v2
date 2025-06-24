import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import type { PaginationParamsInterface } from '@/constants/pagination';
import { DEFAULT_PAGINATION_META } from '@/constants/pagination';
import { useShallow } from 'zustand/react/shallow';
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { datasetsKeys } from '@/lib/features/dataset-keys';
export type DatasetSortOptions = 'Popular' | 'Most Recent';

interface DatasetState {
  // Search state
  searchedDatasets: IDataset[];
  hasSearched: boolean;
  searchQuery: string;
  isSearchLoading?: boolean;

  // Filter state
  filters: DatasetFilterOptions;
  activeFiltersCount: number;

  // Sort state
  sort: DatasetSortOptions;

  // Pagination state
  pagination: PaginationParamsInterface;

  // Modal state
  isDatasetModalOpen: boolean;
  modalMessage: string;

  // UI state
  isLoading: boolean;
  isLoadingNewPage: boolean;
}

interface DatasetActions {
  // Search actions
  setSearchedDatasets: (datasets: IDataset[]) => void;
  setHasSearched: (searched: boolean) => void;
  setSearchQuery: (query: string) => void;
  resetSearch: () => void;
  setIsSearchLoading: (loading: boolean) => void;

  // Filter actions
  setFilters: (filters: DatasetFilterOptions) => void;
  updateFilter: <K extends keyof DatasetFilterOptions>(
    key: K,
    value: DatasetFilterOptions[K],
  ) => void;
  resetFilters: () => void;
  clearSpecificFilter: (filterKey: keyof DatasetFilterOptions) => void;

  // Sort actions
  setSort: (sort: DatasetSortOptions) => void;

  // Pagination actions
  setPagination: (pagination: Partial<PaginationParamsInterface>) => void;
  goToPage: (page: number) => void;
  goToNextPage: (totalPages: number) => void;
  goToPreviousPage: () => void;
  changePageSize: (limit: number) => void;
  resetPagination: () => void;

  // Modal actions
  setIsDatasetModalOpen: (open: boolean) => void;
  setModalMessage: (message: string) => void;
  showModal: (message: string) => void;
  hideModal: () => void;

  // UI actions
  setIsLoading: (loading: boolean) => void;
  setIsLoadingNewPage: (loading: boolean) => void;

  // Combined actions
  resetAllFiltersAndPagination: () => void;
  resetToInitialState: () => void;
}

type DatasetStore = DatasetState & DatasetActions;

const initialState: DatasetState = {
  // Search state
  searchedDatasets: [],
  hasSearched: false,
  searchQuery: '',

  // Filter state
  filters: {
    accessLevel: [],
    dataType: [],
    region: [],
    timeframe: [],
  },
  activeFiltersCount: 0,

  // Sort state
  sort: 'Most Recent',

  // Pagination state
  pagination: {
    page: 1,
    limit: DEFAULT_PAGINATION_META.limit || 10,
  },

  // Modal state
  isDatasetModalOpen: false,
  modalMessage: '',

  // UI state
  isLoading: false,
  isLoadingNewPage: false,
};

const calculateActiveFilters = (filters: DatasetFilterOptions): number => {
  return Object.values(filters).reduce((acc, val) => acc + val.length, 0);
};

export const useDatasetStore = create<DatasetStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Search actions
      setSearchedDatasets: (datasets) =>
        set({ searchedDatasets: datasets }, false, 'setSearchedDatasets'),

      setHasSearched: (searched) =>
        set({ hasSearched: searched }, false, 'setHasSearched'),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      resetSearch: () =>
        set(
          {
            searchedDatasets: [],
            hasSearched: false,
            searchQuery: '',
          },
          false,
          'resetSearch',
        ),
      setIsSearchLoading: (loading) =>
        set({ isSearchLoading: loading }, false, 'setIsSearchLoading'),

      // Filter actions
      setFilters: (filters) => {
        const activeFiltersCount = calculateActiveFilters(filters);
        set(
          (state) => ({
            filters,
            activeFiltersCount,
            // Reset pagination when filters change
            pagination: { ...state.pagination, page: 1 },
          }),
          false,
          'setFilters',
        );
      },

      updateFilter: (key, value) => {
        set(
          (state) => {
            const newFilters = {
              ...state.filters,
              [key]: value,
            };
            const activeFiltersCount = calculateActiveFilters(newFilters);
            return {
              filters: newFilters,
              activeFiltersCount,
              // Reset pagination when filters change
              pagination: { ...state.pagination, page: 1 },
            };
          },
          false,
          'updateFilter',
        );
      },

      resetFilters: () =>
        set(
          (state) => ({
            filters: initialState.filters,
            activeFiltersCount: 0,
            // Reset pagination when filters are reset
            pagination: { ...state.pagination, page: 1 },
          }),
          false,
          'resetFilters',
        ),

      clearSpecificFilter: (filterKey) => {
        set(
          (state) => {
            const newFilters = {
              ...state.filters,
              [filterKey]: [],
            };
            const activeFiltersCount = calculateActiveFilters(newFilters);
            return {
              filters: newFilters,
              activeFiltersCount,
              // Reset pagination when filters change
              pagination: { ...state.pagination, page: 1 },
            };
          },
          false,
          'clearSpecificFilter',
        );
      },

      // Sort actions
      setSort: (sort) =>
        set(
          (state) => ({
            sort,
            // Reset pagination when sort changes
            pagination: { ...state.pagination, page: 1 },
          }),
          false,
          'setSort',
        ),

      // Pagination actions
      setPagination: (paginationUpdate) =>
        set(
          (state) => ({
            pagination: { ...state.pagination, ...paginationUpdate },
          }),
          false,
          'setPagination',
        ),

      goToPage: (page) =>
        set(
          (state) => ({
            pagination: { ...state.pagination, page },
          }),
          false,
          'goToPage',
        ),

      goToNextPage: (totalPages) => {
        const { pagination } = get();
        if (pagination.page < totalPages) {
          set(
            {
              pagination: { ...pagination, page: pagination.page + 1 },
            },
            false,
            'goToNextPage',
          );
        }
      },

      goToPreviousPage: () => {
        const { pagination } = get();
        if (pagination.page > 1) {
          set(
            {
              pagination: { ...pagination, page: pagination.page - 1 },
            },
            false,
            'goToPreviousPage',
          );
        }
      },

      changePageSize: (limit) =>
        set(
          (state) => ({
            pagination: { ...state.pagination, limit, page: 1 },
          }),
          false,
          'changePageSize',
        ),

      resetPagination: () =>
        set(
          {
            pagination: initialState.pagination,
          },
          false,
          'resetPagination',
        ),

      // Modal actions
      setIsDatasetModalOpen: (open) =>
        set({ isDatasetModalOpen: open }, false, 'setIsDatasetModalOpen'),

      setModalMessage: (message) =>
        set({ modalMessage: message }, false, 'setModalMessage'),

      showModal: (message) =>
        set(
          {
            modalMessage: message,
            isDatasetModalOpen: true,
          },
          false,
          'showModal',
        ),

      hideModal: () =>
        set(
          {
            isDatasetModalOpen: false,
            modalMessage: '',
          },
          false,
          'hideModal',
        ),

      // UI actions
      setIsLoading: (loading) =>
        set({ isLoading: loading }, false, 'setIsLoading'),

      setIsLoadingNewPage: (loading) =>
        set({ isLoadingNewPage: loading }, false, 'setIsLoadingNewPage'),

      // Combined actions
      resetAllFiltersAndPagination: () =>
        set(
          {
            filters: initialState.filters,
            activeFiltersCount: 0,
            pagination: initialState.pagination,
          },
          false,
          'resetAllFiltersAndPagination',
        ),

      resetToInitialState: () =>
        set(initialState, false, 'resetToInitialState'),
    }),
    {
      name: 'dataset-store',
    },
  ),
);

// Selectors for better performance
export function useDatasetFilters() {
  const state = useDatasetStore(
    useShallow((state) => ({
      filters: state.filters,
      activeFiltersCount: state.activeFiltersCount,
      setFilters: state.setFilters,
      updateFilter: state.updateFilter,
      resetFilters: state.resetFilters,
      clearSpecificFilter: state.clearSpecificFilter,
    })),
  );
  return state;
}

export function useDatasetPagination() {
  const state = useDatasetStore(
    useShallow((state) => ({
      pagination: state.pagination,
      setPagination: state.setPagination,
      goToPage: state.goToPage,
      goToNextPage: state.goToNextPage,
      goToPreviousPage: state.goToPreviousPage,
      changePageSize: state.changePageSize,
      resetPagination: state.resetPagination,
    })),
  );
  return state;
}

export function useDatasetSearch() {
  const state = useDatasetStore(
    useShallow((state) => ({
      searchedDatasets: state.searchedDatasets,
      hasSearched: state.hasSearched,
      searchQuery: state.searchQuery,
      isSearchLoading: state.isSearchLoading,
      setSearchedDatasets: state.setSearchedDatasets,
      setHasSearched: state.setHasSearched,
      setSearchQuery: state.setSearchQuery,
      resetSearch: state.resetSearch,
      setIsSearchLoading: state.setIsSearchLoading,
    })),
  );
  return state;
}

export function useDatasetSort() {
  const state = useDatasetStore(
    useShallow((state) => ({
      sort: state.sort,
      setSort: state.setSort,
    })),
  );
  return state;
}

export function useDatasetModal() {
  const state = useDatasetStore(
    useShallow((state) => ({
      isDatasetModalOpen: state.isDatasetModalOpen,
      modalMessage: state.modalMessage,
      setIsDatasetModalOpen: state.setIsDatasetModalOpen,
      setModalMessage: state.setModalMessage,
      showModal: state.showModal,
      hideModal: state.hideModal,
    })),
  );
  return state;
}

export function useDatasetUI() {
  const state = useDatasetStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      isLoadingNewPage: state.isLoadingNewPage,
      setIsLoading: state.setIsLoading,
      setIsLoadingNewPage: state.setIsLoadingNewPage,
    })),
  );
  return state;
}

// Computed selectors
export function useActiveFiltersCount() {
  return useDatasetStore(useShallow((state) => state.activeFiltersCount));
}

export function useHasActiveFilters() {
  return useDatasetStore(useShallow((state) => state.activeFiltersCount > 0));
}

export function usePaginationInfo() {
  return useDatasetStore(
    useShallow((state) => ({
      currentPage: state.pagination.page,
      pageSize: state.pagination.limit,
    })),
  );
}
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
