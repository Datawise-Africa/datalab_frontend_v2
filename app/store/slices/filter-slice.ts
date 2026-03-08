import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '..';

export interface FilterSet {
  searchQuery: string;
  categoryFilter: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const defaultFilterSet: FilterSet = {
  searchQuery: '',
  categoryFilter: null,
  sortBy: 'name',
  sortOrder: 'asc',
};

interface FilterState {
  filters: Record<string, FilterSet>;
}

const initialState: FilterState = {
  filters: {},
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery(
      state,
      action: PayloadAction<{ key: string; query: string }>
    ) {
      const { key, query } = action.payload;
      state.filters[key] = state.filters[key] ?? { ...defaultFilterSet };
      state.filters[key].searchQuery = query;
    },
    setCategoryFilter(
      state,
      action: PayloadAction<{ key: string; category: string | null }>
    ) {
      const { key, category } = action.payload;
      state.filters[key] = state.filters[key] ?? { ...defaultFilterSet };
      state.filters[key].categoryFilter = category;
    },
    setSortBy(state, action: PayloadAction<{ key: string; sortBy: string }>) {
      const { key, sortBy } = action.payload;
      state.filters[key] = state.filters[key] ?? { ...defaultFilterSet };
      state.filters[key].sortBy = sortBy;
    },
    setSortOrder(
      state,
      action: PayloadAction<{ key: string; sortOrder: 'asc' | 'desc' }>
    ) {
      const { key, sortOrder } = action.payload;
      state.filters[key] = state.filters[key] ?? { ...defaultFilterSet };
      state.filters[key].sortOrder = sortOrder;
    },
    updateFilter(
      state,
      action: PayloadAction<{ key: string; patch: Partial<FilterSet> }>
    ) {
      const { key, patch } = action.payload;
      state.filters[key] = {
        ...(state.filters[key] ?? defaultFilterSet),
        ...patch,
      };
    },
    resetFilter(state, action: PayloadAction<string>) {
      state.filters[action.payload] = { ...defaultFilterSet };
    },
    removeFilter(state, action: PayloadAction<string>) {
      delete state.filters[action.payload];
    },
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  setSortBy,
  setSortOrder,
  updateFilter,
  resetFilter,
  removeFilter,
} = filterSlice.actions;

export function useAppFilter(key: string) {
  const dispatch = useAppDispatch();
  const filterSet = useAppSelector(
    (state) => state.filters.filters[key] ?? defaultFilterSet
  );

  return useMemo(
    () => ({
      ...filterSet,
      setSearchQuery: (query: string) =>
        dispatch(setSearchQuery({ key, query })),
      setCategoryFilter: (category: string | null) =>
        dispatch(setCategoryFilter({ key, category })),
      setSortBy: (sortBy: string) => dispatch(setSortBy({ key, sortBy })),
      setSortOrder: (sortOrder: 'asc' | 'desc') =>
        dispatch(setSortOrder({ key, sortOrder })),
      updateFilter: (patch: Partial<FilterSet>) =>
        dispatch(updateFilter({ key, patch })),
      resetFilters: () => dispatch(resetFilter(key)),
    }),
    [dispatch, key, filterSet]
  );
}

export default filterSlice.reducer;
