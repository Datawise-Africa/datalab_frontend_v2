import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';
import type {
  Dashboard,
  DashboardAnalysis,
  DashboardDataSource,
  DashboardDefinition,
  DashboardQuery,
  DashboardShareLink,
} from '~/lib/types/dashboard';
import { dashboardApiBase } from './queries';
import { dashboardStudioKeys } from './query-keys';

export function useAddDashboardSource(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (input: FormData | Record<string, unknown>) =>
      (
        await apiClient.post<DashboardDataSource>(
          `${base}/${id}/data-sources/`,
          input,
          input instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : undefined
        )
      ).data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.sources(base, id),
      });
      toastUtils.success('Data source connected');
    },
    onError: (error) =>
      toastUtils.error(
        'Connection failed',
        extractError(
          error,
          'The data source could not be connected. Check the selected dataset and try again.'
        )
      ),
  });
}
export function useDeleteDashboardSource(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (sourceId: string) =>
      apiClient.delete(`${base}/${id}/data-sources/${sourceId}/`),
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.sources(base, id),
      }),
    onError: (e) => toastUtils.error('Delete failed', extractError(e)),
  });
}
export function usePrepareDashboardSource(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (sourceId: string) =>
      (
        await apiClient.post<DashboardDataSource>(
          `${base}/${id}/data-sources/${sourceId}/prepare/`,
          {
            trim_text: true,
            empty_as_null: true,
            infer_numbers: true,
            drop_empty_rows: true,
            drop_duplicates: true,
          }
        )
      ).data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.sources(base, id),
      });
      toastUtils.success('Data prepared');
    },
    onError: (error) =>
      toastUtils.error('Preparation failed', extractError(error)),
  });
}
export function useRunDashboardAnalysis(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async ({
      sourceId,
      query,
    }: {
      sourceId: string;
      query: DashboardQuery;
    }) =>
      (
        await apiClient.post<DashboardAnalysis>(
          `${base}/${id}/data-sources/${sourceId}/query/`,
          query
        )
      ).data,
    onError: (e) => toastUtils.error('Analysis failed', extractError(e)),
  });
}
export function useSaveDashboardDefinition(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async ({
      definition,
      note,
    }: {
      definition: DashboardDefinition;
      note?: string;
    }) =>
      (
        await apiClient.patch<Dashboard>(`${base}/${id}/definition/`, {
          definition,
          note,
        })
      ).data,
    onSuccess: () => toastUtils.success('Dashboard saved'),
    onError: (e) => toastUtils.error('Save failed', extractError(e)),
  });
}
export function useCreateDashboardShare(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (input: {
      access: 'view' | 'interact';
      password?: string;
      expires_at?: string | null;
    }) =>
      (
        await apiClient.post<DashboardShareLink>(
          `${base}/${id}/share-links/`,
          input
        )
      ).data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.shares(base, id),
      });
      toastUtils.success('Share link created');
    },
    onError: (e) => toastUtils.error('Share failed', extractError(e)),
  });
}
export function useCreateInfographic(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (input: {
      title: string;
      definition: Record<string, unknown>;
      is_public?: boolean;
    }) => (await apiClient.post(`${base}/${id}/infographics/`, input)).data,
    onSuccess: () => toastUtils.success('Infographic saved'),
    onError: (e) => toastUtils.error('Infographic failed', extractError(e)),
  });
}

export function useRevokeDashboardShare(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (linkId: string) =>
      (
        await apiClient.post<DashboardShareLink>(
          `${base}/${id}/share-links/${linkId}/revoke/`
        )
      ).data,
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.shares(base, id),
      }),
    onError: (error) => toastUtils.error('Revoke failed', extractError(error)),
  });
}

export function useRestoreDashboardRevision(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (revisionId: string) =>
      (
        await apiClient.post<Dashboard>(
          `${base}/${id}/revisions/${revisionId}/restore/`
        )
      ).data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.revisions(base, id),
      });
      toastUtils.success('Revision restored');
    },
    onError: (error) => toastUtils.error('Restore failed', extractError(error)),
  });
}
