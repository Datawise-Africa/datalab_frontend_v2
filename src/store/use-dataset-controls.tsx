import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import type { PaginationParamsInterface } from '@/constants/pagination';
import { DEFAULT_PAGINATION_META } from '@/constants/pagination';
import { useShallow } from 'zustand/react/shallow';
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
