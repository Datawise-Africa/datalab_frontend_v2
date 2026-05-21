import { scopedKey } from '~/lib/utils/query-key-scope';

export const workspaceKeys = {
  all: () => scopedKey('workspaces'),
  lists: () => [...workspaceKeys.all(), 'list'] as const,
  detail: (id: string) => [...workspaceKeys.all(), 'detail', id] as const,
  members: (id: string) => [...workspaceKeys.all(), 'members', id] as const,

  // Workspace-scoped datasets
  datasets: (id: string) =>
    [...workspaceKeys.all(), 'scope', id, 'datasets'] as const,
  datasetsList: (id: string, filters?: Record<string, unknown>) =>
    [...workspaceKeys.datasets(id), 'list', filters] as const,
  datasetDetail: (id: string, datasetId: string) =>
    [...workspaceKeys.datasets(id), 'detail', datasetId] as const,

  // Workspace-scoped dashboards
  dashboards: (id: string) =>
    [...workspaceKeys.all(), 'scope', id, 'dashboards'] as const,
  dashboardsList: (id: string, filters?: Record<string, unknown>) =>
    [...workspaceKeys.dashboards(id), 'list', filters] as const,
  dashboardDetail: (id: string, dashboardId: string) =>
    [...workspaceKeys.dashboards(id), 'detail', dashboardId] as const,

  analytics: (id: string) => [...workspaceKeys.all(), 'analytics', id] as const,
  invitations: (id: string) =>
    [...workspaceKeys.all(), 'invitations', id] as const,
};
