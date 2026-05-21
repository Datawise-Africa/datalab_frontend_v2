import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Workspace } from '~/lib/types/workspace';
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
} from '~/lib/schema/workspace-schema';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import type {
  Dashboard,
  CreateDashboardInput,
  UpdateDashboardInput,
} from '~/lib/types/dashboard';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';
import { workspaceKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateWorkspaceInput) => {
      const { data } = await apiClient.post<Workspace>('/workspaces/', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateWorkspaceInput & { id: string }) => {
      const { data } = await apiClient.put<Workspace>(
        `/workspaces/${id}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/workspaces/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      email,
      role,
    }: InviteMemberInput & { workspaceId: string }) => {
      const expirationTime = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();
      const { data } = await apiClient.post(
        `/workspaces/${workspaceId}/invite/`,
        {
          invited_email: email,
          role,
          expiration_time: expirationTime,
        }
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(variables.workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.invitations(variables.workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(variables.workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Invite failed', extractError(error));
    },
  });
}

// TODO: PATCH /workspaces/{id}/members/{memberId}/ is not in the OpenAPI spec.
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      memberId,
      ...input
    }: UpdateMemberRoleInput & { workspaceId: string; memberId: string }) => {
      const { data } = await apiClient.patch(
        `/workspaces/${workspaceId}/members/${memberId}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(variables.workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Role update failed', extractError(error));
    },
  });
}

// TODO: DELETE /workspaces/{id}/members/{memberId}/ is not in the OpenAPI spec.
export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workspaceId,
      memberId,
    }: {
      workspaceId: string;
      memberId: string;
    }) => {
      await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}/`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(variables.workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(variables.workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Remove failed', extractError(error));
    },
  });
}

/* ── Workspace-scoped dataset mutations ── */

/** POST /workspaces/{workspaceId}/datasets/ */
export function useCreateWorkspaceDataset(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: UploadDatasetFormValues
    ): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.post(
        `/workspaces/${workspaceId}/datasets/`,
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.datasets(workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Upload failed', extractError(error));
    },
  });
}

/** PUT /workspaces/{workspaceId}/datasets/{datasetId}/ */
export function useUpdateWorkspaceDataset(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UploadDatasetFormValues;
    }): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.put(
        `/workspaces/${workspaceId}/datasets/${id}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.datasets(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.datasetDetail(workspaceId, variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

/** PATCH /workspaces/{workspaceId}/datasets/{datasetId}/update-status/ */
export function useUpdateWorkspaceDatasetStatus(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'PB' | 'DF' | 'AR';
    }): Promise<void> => {
      await apiClient.patch(
        `/workspaces/${workspaceId}/datasets/${id}/update-status/`,
        { status }
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.datasets(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.datasetDetail(workspaceId, variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Status change failed', extractError(error));
    },
  });
}

/** DELETE /workspaces/{workspaceId}/datasets/{datasetId}/ */
export function useDeleteWorkspaceDataset(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (datasetId: string): Promise<void> => {
      await apiClient.delete(
        `/workspaces/${workspaceId}/datasets/${datasetId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.datasets(workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}

/* ── Workspace-scoped dashboard mutations ── */

/** POST /workspaces/{workspaceId}/dashboards/ */
export function useCreateWorkspaceDashboard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDashboardInput): Promise<Dashboard> => {
      const { data } = await apiClient.post<Dashboard>(
        `/workspaces/${workspaceId}/dashboards/`,
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.dashboards(workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Create failed', extractError(error));
    },
  });
}

/** PATCH /workspaces/{workspaceId}/dashboards/{dashboardId}/ */
export function useUpdateWorkspaceDashboard(workspaceId: string) {
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
        `/workspaces/${workspaceId}/dashboards/${id}/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.dashboards(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.dashboardDetail(workspaceId, variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
}

/** DELETE /workspaces/{workspaceId}/dashboards/{dashboardId}/ */
export function useDeleteWorkspaceDashboard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dashboardId: string): Promise<void> => {
      await apiClient.delete(
        `/workspaces/${workspaceId}/dashboards/${dashboardId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.dashboards(workspaceId),
      });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
}
