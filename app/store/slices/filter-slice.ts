import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '..';

export interface FilterSet {
  searchQuery: string;
  categoryFilter: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  /** Multi-value faceted filters. Key = facet name, value = selected values. */
  tags: Record<string, string[]>;
}

const defaultFilterSet: FilterSet = {
  searchQuery: '',
  categoryFilter: null,
  sortBy: 'name',
  sortOrder: 'asc',
  tags: {},
};

interface FilterState {
  filters: Record<string, FilterSet>;
}

const initialState: FilterState = {
  filters: {},
};

function ensure(state: FilterState, key: string): FilterSet {
  if (!state.filters[key]) {
    state.filters[key] = { ...defaultFilterSet, tags: {} };
  }
  return state.filters[key];
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery(
      state,
      action: PayloadAction<{ key: string; query: string }>
    ) {
      ensure(state, action.payload.key).searchQuery = action.payload.query;
    },
    setCategoryFilter(
      state,
      action: PayloadAction<{ key: string; category: string | null }>
    ) {
      ensure(state, action.payload.key).categoryFilter =
        action.payload.category;
    },
    setSortBy(state, action: PayloadAction<{ key: string; sortBy: string }>) {
      ensure(state, action.payload.key).sortBy = action.payload.sortBy;
    },
    setSortOrder(
      state,
      action: PayloadAction<{ key: string; sortOrder: 'asc' | 'desc' }>
    ) {
      ensure(state, action.payload.key).sortOrder = action.payload.sortOrder;
    },
    setTag(
      state,
      action: PayloadAction<{ key: string; tag: string; values: string[] }>
    ) {
      ensure(state, action.payload.key).tags[action.payload.tag] =
        action.payload.values;
    },
    toggleTagValue(
      state,
      action: PayloadAction<{ key: string; tag: string; value: string }>
    ) {
      const f = ensure(state, action.payload.key);
      const values = f.tags[action.payload.tag] ?? [];
      const idx = values.indexOf(action.payload.value);
      if (idx >= 0) {
        values.splice(idx, 1);
      } else {
        values.push(action.payload.value);
      }
      f.tags[action.payload.tag] = values;
    },
    updateFilter(
      state,
      action: PayloadAction<{ key: string; patch: Partial<FilterSet> }>
    ) {
      const { key, patch } = action.payload;
      state.filters[key] = {
        ...(state.filters[key] ?? { ...defaultFilterSet, tags: {} }),
        ...patch,
      };
    },
    resetFilter(state, action: PayloadAction<string>) {
      state.filters[action.payload] = { ...defaultFilterSet, tags: {} };
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
  setTag,
  toggleTagValue,
  updateFilter,
  resetFilter,
  removeFilter,
} = filterSlice.actions;

export function useAppFilter(key: string) {
  const dispatch = useAppDispatch();
  const filterSet = useAppSelector(
    (state) => state.filters.filters[key] ?? defaultFilterSet
  );

  const activeTagCount = useMemo(
    () =>
      Object.values(filterSet.tags).reduce((sum, arr) => sum + arr.length, 0),
    [filterSet.tags]
  );

  return useMemo(
    () => ({
      ...filterSet,
      activeTagCount,
      setSearchQuery: (query: string) =>
        dispatch(setSearchQuery({ key, query })),
      setCategoryFilter: (category: string | null) =>
        dispatch(setCategoryFilter({ key, category })),
      setSortBy: (sortBy: string) => dispatch(setSortBy({ key, sortBy })),
      setSortOrder: (sortOrder: 'asc' | 'desc') =>
        dispatch(setSortOrder({ key, sortOrder })),
      setTag: (tag: string, values: string[]) =>
        dispatch(setTag({ key, tag, values })),
      toggleTagValue: (tag: string, value: string) =>
        dispatch(toggleTagValue({ key, tag, value })),
      updateFilter: (patch: Partial<FilterSet>) =>
        dispatch(updateFilter({ key, patch })),
      resetFilters: () => dispatch(resetFilter(key)),
    }),
    [dispatch, key, filterSet, activeTagCount]
  );
}

export default filterSlice.reducer;
