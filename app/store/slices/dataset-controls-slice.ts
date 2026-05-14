import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '..';

export interface DatasetFilters {
  accessLevel: string[];
  dataType: string[];
  region: string[];
  timeframe: string[];
}

export type DatasetSortOption = 'Most Recent' | 'Popular';

export interface DatasetControlsState {
  searchQuery: string;
  filters: DatasetFilters;
  sort: DatasetSortOption;
  page: number;
  limit: number;
}

const initialState: DatasetControlsState = {
  searchQuery: '',
  filters: {
    accessLevel: [],
    dataType: [],
    region: [],
    timeframe: [],
  },
  sort: 'Most Recent',
  page: 1,
  limit: 10,
};

const datasetControlsSlice = createSlice({
  name: 'datasetControls',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof DatasetFilters;
        values: string[];
      }>
    ) {
      state.filters[action.payload.key] = action.payload.values;
      state.page = 1;
    },
    toggleFilterValue(
      state,
      action: PayloadAction<{
        key: keyof DatasetFilters;
        value: string;
      }>
    ) {
      const { key, value } = action.payload;
      const values = state.filters[key];
      const idx = values.indexOf(value);
      if (idx >= 0) {
        values.splice(idx, 1);
      } else {
        values.push(value);
      }
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.searchQuery = '';
      state.page = 1;
    },
    setSort(state, action: PayloadAction<DatasetSortOption>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setSearchQuery,
  setFilter,
  toggleFilterValue,
  resetFilters,
  setSort,
  setPage,
  setLimit,
} = datasetControlsSlice.actions;

export function useDatasetControls() {
  const dispatch = useAppDispatch();
  const controls = useAppSelector((state) => state.datasetControls);

  const activeFiltersCount = useMemo(() => {
    return Object.values(controls.filters).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
  }, [controls.filters]);

  return useMemo(
    () => ({
      ...controls,
      activeFiltersCount,
      setSearchQuery: (q: string) => dispatch(setSearchQuery(q)),
      setFilter: (key: keyof DatasetFilters, values: string[]) =>
        dispatch(setFilter({ key, values })),
      toggleFilterValue: (key: keyof DatasetFilters, value: string) =>
        dispatch(toggleFilterValue({ key, value })),
      resetFilters: () => dispatch(resetFilters()),
      setSort: (s: DatasetSortOption) => dispatch(setSort(s)),
      setPage: (p: number) => dispatch(setPage(p)),
      setLimit: (l: number) => dispatch(setLimit(l)),
    }),
    [dispatch, controls, activeFiltersCount]
  );
}

export default datasetControlsSlice.reducer;
