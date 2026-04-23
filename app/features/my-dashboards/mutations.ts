import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  Dashboard,
  CreateDashboardInput,
  UpdateDashboardInput,
} from '~/lib/types/dashboard';
import { myDashboardKeys } from './query-keys';
import { dashboardQueryKeys } from '~/features/dashboards/query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export function useCreateMyDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDashboardInput): Promise<Dashboard> => {
      const { data } = await apiClient.post<Dashboard>(
        '/my-dashboards/',
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myDashboardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

export function useUpdateMyDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateDashboardInput;
    }): Promise<Dashboard> => {
      const { data } = await apiClient.patch<Dashboard>(
        `/my-dashboards/${id}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: myDashboardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: myDashboardKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

export function useDeleteMyDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/my-dashboards/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myDashboardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}
