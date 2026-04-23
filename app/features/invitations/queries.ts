import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { WorkspaceInvitation } from '~/lib/types/workspace';
import type { Paginated } from '~/lib/types';
import { invitationKeys } from './query-keys';

export function useMyInvitations() {
  return useQuery({
    queryKey: invitationKeys.lists(),
    queryFn: async (): Promise<WorkspaceInvitation[]> => {
      const { data } = await apiClient.get<
        Paginated<WorkspaceInvitation> | WorkspaceInvitation[]
      >('/invitations/');
      return Array.isArray(data) ? data : (data.data ?? []);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useInvitation(id: string) {
  return useQuery({
    queryKey: invitationKeys.detail(id),
    queryFn: async (): Promise<WorkspaceInvitation> => {
      const { data } = await apiClient.get<WorkspaceInvitation>(
        `/invitations/${id}/`
      );
      return data;
    },
    enabled: !!id,
  });
}
