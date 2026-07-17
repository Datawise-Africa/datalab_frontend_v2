import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { ReportCategory } from '~/lib/types/report';
import type {
  CreateReportCategoryInput,
  UpdateReportCategoryInput,
} from '~/lib/schema/report-schema';
import { reportCategoryKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export function useCreateReportCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: CreateReportCategoryInput
    ): Promise<ReportCategory> => {
      const { data } = await apiClient.post<ReportCategory>(
        '/report-categories/',
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportCategoryKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

/**
 * PATCH echoes back `{ name }` only — no `id`, no `slug` (verified live 2026-07-16).
 * Typed to match rather than claiming a full ReportCategory. Callers should read
 * from the refetched list, not from this return value.
 */
export function useUpdateReportCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateReportCategoryInput;
    }): Promise<UpdateReportCategoryInput> => {
      const { data } = await apiClient.patch<UpdateReportCategoryInput>(
        `/report-categories/${id}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportCategoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: reportCategoryKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

export function useDeleteReportCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/report-categories/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportCategoryKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}
