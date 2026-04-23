import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { invitationKeys } from './query-keys';
import { workspaceKeys } from '~/features/workspaces/query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.patch(`/invitations/${id}/accept/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Accept failed', extractError(error));
    },
  });
}

export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.patch(`/invitations/${id}/decline/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Decline failed', extractError(error));
    },
  });
}
