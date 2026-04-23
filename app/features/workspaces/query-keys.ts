import { scopedKey } from '~/lib/utils/query-key-scope';

export const workspaceKeys = {
  all: () => scopedKey('workspaces'),
  lists: () => [...workspaceKeys.all(), 'list'] as const,
  detail: (id: string) => [...workspaceKeys.all(), 'detail', id] as const,
  members: (id: string) => [...workspaceKeys.all(), 'members', id] as const,
  datasets: (id: string) => [...workspaceKeys.all(), 'datasets', id] as const,
  analytics: (id: string) => [...workspaceKeys.all(), 'analytics', id] as const,
  invitations: (id: string) =>
    [...workspaceKeys.all(), 'invitations', id] as const,
};
