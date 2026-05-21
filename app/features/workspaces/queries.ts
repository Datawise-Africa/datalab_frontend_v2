import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
} from '~/lib/types/workspace';
import type { Paginated } from '~/lib/types';
import type { Dashboard, DashboardStatus } from '~/lib/types/dashboard';
import type { DatasetStatus } from '~/lib/types/dataset';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import { workspaceKeys } from './query-keys';

interface WorkspaceDatasetsParams {
  status?: DatasetStatus;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
}

interface WorkspaceDashboardsParams {
  status?: DashboardStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}

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

/** List datasets scoped to a workspace via GET /workspaces/{id}/datasets/. */
export function useWorkspaceDatasets(
  id: string,
  params?: WorkspaceDatasetsParams
) {
  const apiParams: Record<string, unknown> = { ...params };
  if (!apiParams.status || apiParams.status === 'all') {
    delete apiParams.status;
  }
  return useQuery({
    queryKey: workspaceKeys.datasetsList(id, apiParams),
    queryFn: async (): Promise<Paginated<MyDatasetInterface>> => {
      const { data } = await apiClient.get<Paginated<MyDatasetInterface>>(
        `/workspaces/${id}/datasets/`,
        { params: apiParams }
      );
      return data;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch a single workspace dataset via GET /workspaces/{id}/datasets/{datasetId}/. */
export function useWorkspaceDataset(workspaceId: string, datasetId: string) {
  return useQuery({
    queryKey: workspaceKeys.datasetDetail(workspaceId, datasetId),
    queryFn: async (): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.get<MyDatasetInterface>(
        `/workspaces/${workspaceId}/datasets/${datasetId}/`
      );
      return data;
    },
    enabled: !!workspaceId && !!datasetId,
    staleTime: 5 * 60 * 1000,
  });
}

/** List dashboards scoped to a workspace via GET /workspaces/{id}/dashboards/. */
export function useWorkspaceDashboards(
  id: string,
  params?: WorkspaceDashboardsParams
) {
  const apiParams: Record<string, unknown> = { ...params };
  if (!apiParams.status || apiParams.status === 'all') {
    delete apiParams.status;
  }
  return useQuery({
    queryKey: workspaceKeys.dashboardsList(id, apiParams),
    queryFn: async (): Promise<Paginated<Dashboard>> => {
      const { data } = await apiClient.get<Paginated<Dashboard>>(
        `/workspaces/${id}/dashboards/`,
        { params: apiParams }
      );
      return data;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch a single workspace dashboard via GET /workspaces/{id}/dashboards/{dashboardId}/. */
export function useWorkspaceDashboard(
  workspaceId: string,
  dashboardId: string
) {
  return useQuery({
    queryKey: workspaceKeys.dashboardDetail(workspaceId, dashboardId),
    queryFn: async (): Promise<Dashboard> => {
      const { data } = await apiClient.get<Dashboard>(
        `/workspaces/${workspaceId}/dashboards/${dashboardId}/`
      );
      return data;
    },
    enabled: !!workspaceId && !!dashboardId,
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
