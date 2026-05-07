import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
} from '~/lib/types/workspace';
import type { Paginated } from '~/lib/types';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import { workspaceKeys } from './query-keys';

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<Workspace[]>('/workspaces/');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Workspace>(`/workspaces/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkspaceMembers(id: string) {
  return useQuery({
    queryKey: workspaceKeys.members(id),
    queryFn: async () => {
      const { data } = await apiClient.get<WorkspaceMember[]>(
        `/workspaces/${id}/members/`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkspaceDatasets(id: string) {
  return useQuery({
    queryKey: workspaceKeys.datasets(id),
    queryFn: async (): Promise<Paginated<MyDatasetInterface>> => {
      const { data } = await apiClient.get<Paginated<MyDatasetInterface>>(
        '/my-datasets/',
        { params: { workspace: id } }
      );
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// TODO: GET /workspaces/{id}/analytics/ is not in the OpenAPI spec.
export function useWorkspaceAnalytics(id: string) {
  return useQuery({
    queryKey: workspaceKeys.analytics(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/workspaces/${id}/analytics/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkspaceInvitations(id: string) {
  return useQuery({
    queryKey: workspaceKeys.invitations(id),
    queryFn: async (): Promise<WorkspaceInvitation[]> => {
      const { data } = await apiClient.get<
        Paginated<WorkspaceInvitation> | WorkspaceInvitation[]
      >(`/workspaces/${id}/invitations/`);
      return Array.isArray(data) ? data : (data.data ?? []);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
