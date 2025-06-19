import type { PaginationParamsInterface } from '@/constants/pagination';
import type { DatasetSortOptions } from '@/hooks/use-datasets';
import type { DatasetFilterOptions } from '../types/data-set';

// Query keys factory for better organization
export const datasetsKeys = {
  all: ['datasets'] as const,
  lists: () => [...datasetsKeys.all, 'list'] as const,
  list: (pagination: PaginationParamsInterface, sort: DatasetSortOptions) =>
    [...datasetsKeys.lists(), pagination, sort] as const,
  filtered: (
    filters: DatasetFilterOptions,
    pagination: PaginationParamsInterface,
    sort: DatasetSortOptions,
  ) => [...datasetsKeys.all, 'filtered', filters, pagination, sort] as const,
};

export const datasetBookmarksKeys = {
  all: ['datasetBookmarks'] as const,
  lists: () => [...datasetBookmarksKeys.all, 'list'] as const,
  list: (pagination: PaginationParamsInterface) =>
    [...datasetBookmarksKeys.lists(), pagination] as const,
  filtered: (
    filters: DatasetFilterOptions,
    pagination: PaginationParamsInterface,
    sort: DatasetSortOptions,
  ) =>
    [
      ...datasetBookmarksKeys.all,
      'filtered',
      filters,
      pagination,
      sort,
    ] as const,
  ids: () => [...datasetBookmarksKeys.all, 'ids'] as const,
};
