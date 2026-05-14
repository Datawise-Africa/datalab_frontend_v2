import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  DashboardCategory,
  CreateDashboardCategoryInput,
  UpdateDashboardCategoryInput,
} from '~/lib/types/dashboard';
import { dashboardCategoryKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export function useCreateDashboardCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: CreateDashboardCategoryInput
    ): Promise<DashboardCategory> => {
      const { data } = await apiClient.post<DashboardCategory>(
        '/dashboard-categories/',
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardCategoryKeys.lists(),
      });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

export function useUpdateDashboardCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateDashboardCategoryInput;
    }): Promise<DashboardCategory> => {
      const { data } = await apiClient.patch<DashboardCategory>(
        `/dashboard-categories/${id}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: dashboardCategoryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: dashboardCategoryKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

export function useDeleteDashboardCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/dashboard-categories/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dashboardCategoryKeys.lists(),
      });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}
