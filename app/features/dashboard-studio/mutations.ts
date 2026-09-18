import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
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
  DashboardExecution,
  DashboardSemanticModel,
  DashboardRefreshPolicy,
  DashboardRefreshRun,
  DashboardAlert,
  DashboardComment,
} from '~/lib/types/dashboard';
import { dashboardApiBase } from './queries';
import { dashboardStudioKeys } from './query-keys';
import { workspaceKeys } from '~/features/workspaces/query-keys';
import { myDashboardKeys } from '~/features/my-dashboards/query-keys';

/**
 * Keep the cached dashboard (used by the studio and detail pages) in step with
 * what the server just returned, without a refetch.
 */
function patchCachedDashboard(
  client: QueryClient,
  id: string,
  workspaceId: string | undefined,
  patch: Partial<Dashboard>
) {
  const key = workspaceId
    ? workspaceKeys.dashboardDetail(workspaceId, id)
    : myDashboardKeys.detail(id);
  client.setQueryData<Dashboard>(key, (current) =>
    current ? { ...current, ...patch } : current
  );
}

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
    mutationFn: async (
      input:
        | string
        | {
            sourceId: string;
            recipe: Array<Record<string, unknown>>;
          }
    ) => {
      const sourceId = typeof input === 'string' ? input : input.sourceId;
      const recipe = typeof input === 'string' ? [] : input.recipe;
      return (
        await apiClient.post<DashboardDataSource>(
          `${base}/${id}/data-sources/${sourceId}/prepare/`,
          {
            trim_text: true,
            empty_as_null: true,
            infer_numbers: true,
            drop_empty_rows: true,
            drop_duplicates: true,
            recipe,
          }
        )
      ).data;
    },
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
/** 409 from a definition save: changed elsewhere; body has the stored `definition_version`. */
export function isDefinitionConflict(
  error: unknown
): error is AxiosError<{ definition_version: string }> {
  return axios.isAxiosError(error) && error.response?.status === 409;
}

export function useSaveDashboardDefinition(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async ({
      definition,
      note,
      baseVersion,
    }: {
      definition: DashboardDefinition;
      note?: string;
      /** Rejected with 409 if the stored definition changed since. */
      baseVersion?: string;
      silent?: boolean;
    }) =>
      (
        await apiClient.patch<Dashboard>(`${base}/${id}/definition/`, {
          definition,
          note,
          base_version: baseVersion,
        })
      ).data,
    onSuccess: (data, { silent }) => {
      patchCachedDashboard(client, id, workspaceId, data);
      if (!silent) toastUtils.success('Dashboard saved');
    },
    onError: (e) => {
      // Conflicts are resolved in the studio's conflict dialog instead.
      if (!isDefinitionConflict(e))
        toastUtils.error('Save failed', extractError(e));
    },
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
    onSuccess: (data) => {
      patchCachedDashboard(client, id, workspaceId, data);
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.revisions(base, id),
      });
      toastUtils.success('Revision restored');
    },
    onError: (error) => toastUtils.error('Restore failed', extractError(error)),
  });
}

export function useRenderDashboard(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (input: {
      definition?: DashboardDefinition;
      filters?: DashboardQuery['filters'];
      page_id?: string;
    }) =>
      (await apiClient.post<DashboardExecution>(`${base}/${id}/render/`, input))
        .data,
    onError: (error) =>
      toastUtils.error('Dashboard query failed', extractError(error)),
  });
}

export function useSaveSemanticModel(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (model: DashboardSemanticModel) =>
      (
        await apiClient.patch<DashboardSemanticModel>(
          `${base}/${id}/semantic-model/`,
          model
        )
      ).data,
    onSuccess: (semantic_model) => {
      patchCachedDashboard(client, id, workspaceId, { semantic_model });
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.sources(base, id),
      });
      toastUtils.success('Data model saved');
    },
    onError: (error) =>
      toastUtils.error('Model save failed', extractError(error)),
  });
}

export function useSaveRefreshPolicy(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (policy: DashboardRefreshPolicy) =>
      (
        await apiClient.patch<DashboardRefreshPolicy>(
          `${base}/${id}/refresh-policy/`,
          policy
        )
      ).data,
    onSuccess: () => toastUtils.success('Refresh schedule saved'),
    onError: (error) =>
      toastUtils.error('Schedule save failed', extractError(error)),
  });
}

export function useRefreshDashboard(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async () =>
      (await apiClient.post<DashboardRefreshRun>(`${base}/${id}/refresh/`, {}))
        .data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: dashboardStudioKeys.sources(base, id),
      });
      toastUtils.success('Dashboard data refreshed');
    },
    onError: (error) => toastUtils.error('Refresh failed', extractError(error)),
  });
}

export function useCreateDashboardAlert(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (input: Omit<DashboardAlert, 'id'>) =>
      (await apiClient.post<DashboardAlert>(`${base}/${id}/alerts/`, input))
        .data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [...dashboardStudioKeys.sources(base, id), 'alerts'],
      });
      toastUtils.success('Alert created');
    },
    onError: (error) => toastUtils.error('Alert failed', extractError(error)),
  });
}

export function useCreateDashboardComment(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (
      input: Pick<DashboardComment, 'body' | 'page_id' | 'widget_id'>
    ) =>
      (await apiClient.post<DashboardComment>(`${base}/${id}/comments/`, input))
        .data,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [...dashboardStudioKeys.sources(base, id), 'comments'],
      });
      toastUtils.success('Comment added');
    },
    onError: (error) => toastUtils.error('Comment failed', extractError(error)),
  });
}

export function useResolveDashboardComment(id: string, workspaceId?: string) {
  const client = useQueryClient();
  const base = dashboardApiBase(workspaceId);
  return useMutation({
    mutationFn: async (commentId: string) =>
      (
        await apiClient.post<DashboardComment>(
          `${base}/${id}/comments/${commentId}/resolve/`
        )
      ).data,
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: [...dashboardStudioKeys.sources(base, id), 'comments'],
      }),
    onError: (error) => toastUtils.error('Resolve failed', extractError(error)),
  });
}

export async function exportDashboardAnalysis(
  id: string,
  sourceId: string,
  query: DashboardQuery,
  format: 'csv' | 'xlsx',
  workspaceId?: string
) {
  const base = dashboardApiBase(workspaceId);
  const response = await apiClient.post(
    `${base}/${id}/data-sources/${sourceId}/export/`,
    { query, format },
    { responseType: 'blob' }
  );
  const url = URL.createObjectURL(response.data as Blob);
  const anchor = globalThis.document.createElement('a');
  anchor.href = url;
  anchor.download = `datalab-analysis.${format}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
