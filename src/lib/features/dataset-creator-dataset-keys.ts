import type { PaginationParamsInterface } from '@/constants/pagination';
import type { DatasetStatus } from '../types/data-set';

export interface DatasetFilters {
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export const datasetCreatorDatasetkeys = {
  all: ['datasets'] as const,

  byStatus: (
    status: DatasetStatus,
    filters: DatasetFilters = {},
    pagination: PaginationParamsInterface,
  ) =>
    [
      ...datasetCreatorDatasetkeys.all,
      status,
      { filters, pagination },
    ] as const,

  // Legacy support for existing code
  draft: () => [...datasetCreatorDatasetkeys.all, 'draft'] as const,
  published: () => [...datasetCreatorDatasetkeys.all, 'published'] as const,
  archived: () => [...datasetCreatorDatasetkeys.all, 'archived'] as const,

  // Invalidation helpers
  invalidateStatus: (status: DatasetStatus) =>
    [...datasetCreatorDatasetkeys.all, status] as const,

  invalidateAll: () => datasetCreatorDatasetkeys.all,
};
