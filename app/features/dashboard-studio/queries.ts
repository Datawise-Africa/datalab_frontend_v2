import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  DashboardDataSource,
  DashboardShareLink,
  DashboardRevision,
  DashboardSourceProfile,
} from '~/lib/types/dashboard';
import { dashboardStudioKeys } from './query-keys';
import type { Paginated } from '~/lib/types';
import type { MyDatasetInterface } from '~/features/my-datasets/types';

export interface DashboardDatasetOption {
  id: string;
  name: string;
  scope: 'workspace' | 'personal' | 'public';
}

export const dashboardApiBase = (workspaceId?: string) =>
  workspaceId ? `/workspaces/${workspaceId}/dashboards` : '/my-dashboards';

export function useDashboardDatasetOptions(workspaceId?: string) {
  const scopedUrl = workspaceId
    ? `/workspaces/${workspaceId}/datasets/`
    : '/my-datasets/';
  const scope = workspaceId ? `workspace:${workspaceId}` : 'personal';

  return useQuery({
    queryKey: dashboardStudioKeys.datasetOptions(scope),
    queryFn: async (): Promise<DashboardDatasetOption[]> => {
      const [scopedResponse, publicResponse] = await Promise.all([
        apiClient.get<Paginated<MyDatasetInterface>>(scopedUrl, {
          params: { limit: 100 },
        }),
        apiClient.get<Paginated<MyDatasetInterface>>('/datasets/', {
          params: { limit: 100 },
        }),
      ]);

      const options = new Map<string, DashboardDatasetOption>();
      for (const dataset of scopedResponse.data.data ?? []) {
        options.set(dataset.id, {
          id: dataset.id,
          name: dataset.name,
          scope: workspaceId ? 'workspace' : 'personal',
        });
      }
      for (const dataset of publicResponse.data.data ?? []) {
        if (!options.has(dataset.id)) {
          options.set(dataset.id, {
            id: dataset.id,
            name: dataset.name,
            scope: 'public',
          });
        }
      }
      return [...options.values()];
    },
    staleTime: 30 * 1000,
    refetchOnMount: 'always',
  });
}

export function useDashboardSources(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useQuery({
    queryKey: dashboardStudioKeys.sources(base, id),
    enabled: Boolean(id),
    queryFn: async () =>
      (
        await apiClient.get<DashboardDataSource[]>(
          `${base}/${id}/data-sources/`
        )
      ).data,
  });
}

export function useDashboardRevisions(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useQuery({
    queryKey: dashboardStudioKeys.revisions(base, id),
    enabled: Boolean(id),
    queryFn: async () =>
      (await apiClient.get<DashboardRevision[]>(`${base}/${id}/revisions/`))
        .data,
  });
}

export function useDashboardSourceProfile(
  id: string,
  sourceId?: string,
  workspaceId?: string
) {
  const base = dashboardApiBase(workspaceId);
  return useQuery({
    queryKey: dashboardStudioKeys.profile(base, id, sourceId ?? ''),
    enabled: Boolean(id && sourceId),
    queryFn: async () =>
      (
        await apiClient.get<DashboardSourceProfile>(
          `${base}/${id}/data-sources/${sourceId}/profile/`
        )
      ).data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardShareLinks(id: string, workspaceId?: string) {
  const base = dashboardApiBase(workspaceId);
  return useQuery({
    queryKey: dashboardStudioKeys.shares(base, id),
    enabled: Boolean(id),
    queryFn: async () =>
      (await apiClient.get<DashboardShareLink[]>(`${base}/${id}/share-links/`))
        .data,
  });
}
