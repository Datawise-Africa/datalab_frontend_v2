import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { authKeys } from './query-keys';
import type { AuthUser } from '~/lib/types/auth';

export const useProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async (): Promise<AuthUser> => {
      const { data } = await apiClient.get('/auth/me/');
      return data;
    },
  });
};
