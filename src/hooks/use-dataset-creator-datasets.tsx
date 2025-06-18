import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import {
  datasetCreatorDatasetkeys,
  type DatasetFilters,
} from '@/lib/features/dataset-creator-dataset-keys';
import type { DatasetStatus, IDataset } from '@/lib/types/data-set';
import {
  DEFAULT_PAGINATION,
  DEFAULT_PAGINATION_META,
  type PaginatedResponse,
  type PaginationMetaInterface,
  type PaginationParamsInterface,
} from '@/constants/pagination';
import type { UploadDatasetSchemaType } from '@/lib/schema/upload-dataset-schema';

export interface DatasetMutationCallbacks {
  onSuccess?: (data: IDataset) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

type ExtractMapValue<T> = T extends Record<string, infer V> ? V : never;
export function useDatasetCreatorDatasets(
  status: DatasetStatus,
  initialFilters: DatasetFilters = {},
  initialPagination: PaginationParamsInterface = DEFAULT_PAGINATION,
) {
  const [filters, setFilters] = useState<DatasetFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParamsInterface>(initialPagination);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMetaInterface>(
    DEFAULT_PAGINATION_META,
  );

  const api = useApi().privateApi;

  const endpoints: Record<DatasetStatus, string> = {
    DF: '/data/datasets-drafts',
    PB: '/data/datasets-published',
    AR: '/data/datasets-archived',
  } as const;

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    // Pagination
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());

    // Filters
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return params.toString();
  }, [filters, pagination]);

  // Generic fetch function
  const fetchDatasets = useCallback(async (): Promise<IDataset[]> => {
    try {
      const endpoint = endpoints[status];
      const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;

      const response = await api.get<PaginatedResponse<IDataset>>(url);

      // Update pagination metadata
      setPaginationMeta(response.data.meta);

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching ${status} datasets:`, error);
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, [api, status, queryParams]);

  // Query key that includes all parameters for proper caching
  const queryKey = useMemo(
    () => datasetCreatorDatasetkeys.byStatus(status, filters, pagination),
    [status, filters, pagination],
  );

  const query = useQuery({
    queryKey,
    queryFn: fetchDatasets,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    // keepPreviousData: true, // Keep previous data while loading new data,
    placeholderData: (prev) => (prev ? prev : []), // Use previous data as placeholder
  });

  // Pagination helpers
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const goToNextPage = useCallback(() => {
    if (paginationMeta.has_next_page) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [paginationMeta.has_next_page]);

  const goToPreviousPage = useCallback(() => {
    if (paginationMeta.has_prev_page) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  }, [paginationMeta.has_prev_page]);

  const changePageSize = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page
  }, []);

  // Filter helpers
  const updateFilters = useCallback((newFilters: Partial<DatasetFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(DEFAULT_PAGINATION);
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(DEFAULT_PAGINATION);
  }, []);

  return {
    // Data
    data: query.data || [],

    // Query state
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,

    // Pagination
    pagination,
    paginationMeta,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
    resetPagination,

    // Filters
    filters,
    updateFilters,
    clearFilters,

    // Actions
    refetch: query.refetch,
  };
}

// Multi-status hook for when you need multiple dataset types
export function useMultipleDatasetStatuses(
  statuses: DatasetStatus[],
  filters: DatasetFilters = {},
  pagination: PaginationParamsInterface = DEFAULT_PAGINATION,
) {
  const queries = statuses.reduce(
    (acc, status) => {
      acc[status] = useDatasetCreatorDatasets(status, filters, pagination);
      return acc;
    },
    {} as Record<DatasetStatus, ReturnType<typeof useDatasetCreatorDatasets>>,
  );

  const isLoading = Object.values(queries).some((q) => q.isLoading);
  const isError = Object.values(queries).some((q) => q.isError);
  const isFetching = Object.values(queries).some((q) => q.isFetching);

  return {
    queries,
    isLoading,
    isError,
    isFetching,
    refetchAll: () => Object.values(queries).forEach((q) => q.refetch()),
  };
}

// Dataset mutations hook
export function useDatasetMutations(callbacks: DatasetMutationCallbacks = {}) {
  const api = useApi().privateApi;
  const queryClient = useQueryClient();
  type UpdateMutationType = [
    IDataset['id'],
    UploadDatasetSchemaType,
    IDataset['status'],
  ];

  const updateOrPublishEndpoint = '/data/datasets/';
  const transformData = (data: UploadDatasetSchemaType) => {
    const modified = Object.values(data).reduce(
      (acc, value) => ({ ...acc, ...value }),
      {},
    );
    return {
      ...modified,
      keywords: (modified as any).keywords.join(','),
      covered_regions: (modified as any).covered_regions.join(','),
    } as ExtractMapValue<UploadDatasetSchemaType>;
  };
  // Invalidate queries helper
  const invalidateDatasetQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: datasetCreatorDatasetkeys.all });
  }, [queryClient]);

  // Create new dataset (as draft by default)
  const createDataset = useMutation({
    mutationFn: async (payload: UploadDatasetSchemaType): Promise<IDataset> => {
      try {
        const transformedData = transformData(payload);
        (transformedData as any)['status'] = 'PB'; // Ensure published status
        const response = await api.post<IDataset>(
          updateOrPublishEndpoint,
          transformedData,
        );
        return response.data;
      } catch (error) {
        console.error('Error creating dataset:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      invalidateDatasetQueries();
      callbacks.onSuccess?.(data);
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  // Save dataset as draft
  const saveDraft = useMutation({
    mutationFn: async (payload: UploadDatasetSchemaType): Promise<IDataset> => {
      try {
        // const payloadData = Object.values(payload).reduce(
        //   (acc, value) => ({ ...acc, ...value }),
        //   {
        //     status: 'DF', // Ensure draft status
        //   },
        // );
        const payloadData = transformData(payload);
        (payloadData as any).status = 'DF'; // Ensure draft status

        const response = await api.post<IDataset>(
          `${updateOrPublishEndpoint}`,
          payloadData,
        );
        return response.data;
      } catch (error) {
        console.error('Error saving draft:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      // Update the specific dataset in cache
      queryClient.setQueryData(
        datasetCreatorDatasetkeys.byStatus('DF', {}, { page: 1, limit: 10 }),
        (oldData: IDataset[] | undefined) => {
          if (!oldData) return [data];
          const index = oldData.findIndex((dataset) => dataset.id === data.id);
          if (index >= 0) {
            const newData = [...oldData];
            newData[index] = data;
            return newData;
          }
          return [data, ...oldData];
        },
      );
      invalidateDatasetQueries();
      callbacks.onSuccess?.(data);
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  // Publish dataset
  const publishDataset = useMutation({
    mutationFn: async ([
      id,
      updateData,
      status,
    ]: UpdateMutationType): Promise<IDataset> => {
      try {
        const transformedData = transformData(updateData);
        (transformedData as any).status = status; // Ensure published status
        const response = await api.post<IDataset>(
          `${updateOrPublishEndpoint}${id}`,
          transformedData,
        );
        return response.data;
      } catch (error) {
        console.error('Error publishing dataset:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      // Remove from draft cache and add to published cache
      queryClient.setQueryData(
        datasetCreatorDatasetkeys.byStatus('DF', {}, { page: 1, limit: 10 }),
        (oldData: IDataset[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((dataset) => dataset.id !== data.id);
        },
      );

      queryClient.setQueryData(
        datasetCreatorDatasetkeys.byStatus('PB', {}, { page: 1, limit: 10 }),
        (oldData: IDataset[] | undefined) => {
          if (!oldData) return [data];
          return [data, ...oldData];
        },
      );

      invalidateDatasetQueries();
      callbacks.onSuccess?.(data);
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  // Update existing dataset (generic update)
  const updateDataset = useMutation({
    mutationFn: async ([
      id,
      updateData,
      status,
    ]: UpdateMutationType): Promise<IDataset> => {
      try {
        const transformedData = transformData(updateData);
        (transformedData as any).status = status; // Ensure correct status
        const response = await api.put<IDataset>(
          `${updateOrPublishEndpoint}${id}/`,
          transformedData,
        );
        return response.data;
      } catch (error) {
        console.error('Error updating dataset:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      invalidateDatasetQueries();
      callbacks.onSuccess?.(data);
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  // Change dataset status
  const changeDatasetStatus = useMutation({
    mutationFn: async ([id, newStatus]: [
      string,
      DatasetStatus,
    ]): Promise<IDataset> => {
      try {
        const response = await api.put<IDataset>(
          `${updateOrPublishEndpoint}${id}/`,
          { status: newStatus },
        );
        return response.data;
      } catch (error) {
        console.error('Error changing dataset status:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      // Invalidate all dataset queries to refresh data
      invalidateDatasetQueries();
      callbacks.onSuccess?.(data);
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  // Archive dataset
  const archiveDataset = useMutation({
    mutationFn: async (id: string): Promise<IDataset> => {
      try {
        const response = await api.post<IDataset>(
          `${updateOrPublishEndpoint}${id}/archive`,
        );
        return response.data;
      } catch (error) {
        console.error('Error archiving dataset:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: (data) => {
      invalidateDatasetQueries();
      callbacks.onSuccess?.(data);
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  // Delete dataset
  const deleteDataset = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      try {
        await api.delete(`${updateOrPublishEndpoint}${id}`);
      } catch (error) {
        console.error('Error deleting dataset:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    onSuccess: () => {
      invalidateDatasetQueries();
      callbacks.onSettled?.();
    },
    onError: (error: Error) => {
      callbacks.onError?.(error);
    },
    onSettled: () => {
      callbacks.onSettled?.();
    },
  });

  return {
    // Mutations
    createDataset,
    saveDraft,
    publishDataset,
    updateDataset,
    archiveDataset,
    deleteDataset,

    // Loading states
    isCreating: createDataset.isPending,
    isSavingDraft: saveDraft.isPending,
    isPublishing: publishDataset.isPending,
    isUpdating: updateDataset.isPending,
    isArchiving: archiveDataset.isPending,
    isDeleting: deleteDataset.isPending,
    isChangingStatus: changeDatasetStatus.isPending,

    // Any mutation in progress
    isMutating:
      createDataset.isPending ||
      saveDraft.isPending ||
      publishDataset.isPending ||
      updateDataset.isPending ||
      archiveDataset.isPending ||
      deleteDataset.isPending ||
      changeDatasetStatus.isPending,

    // Error states
    createError: createDataset.error,
    saveDraftError: saveDraft.error,
    publishError: publishDataset.error,
    updateError: updateDataset.error,
    archiveError: archiveDataset.error,
    deleteError: deleteDataset.error,
    changeStatusError: changeDatasetStatus.error,

    // Reset functions
    resetCreateError: createDataset.reset,
    resetSaveDraftError: saveDraft.reset,
    resetPublishError: publishDataset.reset,
    resetUpdateError: updateDataset.reset,
    resetArchiveError: archiveDataset.reset,
    resetDeleteError: deleteDataset.reset,
    resetChangeStatusError: changeDatasetStatus.reset,

    // Helper to reset all errors
    resetAllErrors: () => {
      createDataset.reset();
      saveDraft.reset();
      publishDataset.reset();
      updateDataset.reset();
      archiveDataset.reset();
      deleteDataset.reset();
      changeDatasetStatus.reset();
    },
  };
}
