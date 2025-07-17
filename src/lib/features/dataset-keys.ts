import type { PaginationParamsInterface } from '@/constants/pagination';
import type { DatasetFilterOptions } from '../types/data-set';
import type { DatasetSortOptions } from '@/store/use-dataset-controls';

// Query keys factory for better organization
export const datasetsKeys = {
  all: ['datasets'] as const,
  lists: (sessionId: string) =>
    [...datasetsKeys.all, 'list', sessionId] as const,
  detail: (datasetId: string, sessionId: string) =>
    [
      ...datasetsKeys.all,
      `dataset-${datasetId}`,
      datasetId,
      sessionId,
    ] as const,
  list: (
    pagination: PaginationParamsInterface,
    sort: DatasetSortOptions,
    sessionId: string,
  ) => [...datasetsKeys.lists(sessionId), pagination, sort] as const,
  filtered: (
    filters: DatasetFilterOptions,
    pagination: PaginationParamsInterface,
    sort: DatasetSortOptions,
    sessionId: string,
  ) =>
    [
      ...datasetsKeys.all,
      'filtered',
      filters,
      pagination,
      sort,
      sessionId,
    ] as const,
};

export const datasetBookmarksKeys = {
  all: ['user-favorite-datasets'] as const,
  lists: (sessionId: string) =>
    [...datasetBookmarksKeys.all, 'list', sessionId] as const,
  list: (pagination: PaginationParamsInterface, sessionId: string) =>
    [...datasetBookmarksKeys.lists(sessionId), pagination] as const,
  filtered: (
    filters: DatasetFilterOptions,
    pagination: PaginationParamsInterface,
    sort: DatasetSortOptions,
    sessionId: string,
  ) =>
    [
      ...datasetBookmarksKeys.all,
      'filtered',
      filters,
      pagination,
      sort,
      sessionId,
    ] as const,
  ids: (sessionId: string) =>
    [...datasetBookmarksKeys.all, 'ids', sessionId] as const,
};

export const datasetSearchKeys = {
  all: ['datasetSearch'] as const,
  lists: (sessionId: string) =>
    [...datasetSearchKeys.all, 'list', sessionId] as const,
};
