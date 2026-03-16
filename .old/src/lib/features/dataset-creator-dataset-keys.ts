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
    sessionId: string,
  ) =>
    [
      ...datasetCreatorDatasetkeys.all,
      status,
      { filters, pagination },
      sessionId,
    ] as const,

  // Legacy support for existing code
  draft: (sessionId: string) =>
    [...datasetCreatorDatasetkeys.all, 'draft', sessionId] as const,
  published: (sessionId: string) =>
    [...datasetCreatorDatasetkeys.all, 'published', sessionId] as const,
  archived: (sessionId: string) =>
    [...datasetCreatorDatasetkeys.all, 'archived', sessionId] as const,

  // Invalidation helpers
  invalidateStatus: (status: DatasetStatus) =>
    [...datasetCreatorDatasetkeys.all, status] as const,

  invalidateAll: (sessionId: string) =>
    [...datasetCreatorDatasetkeys.all, sessionId] as const,
};
