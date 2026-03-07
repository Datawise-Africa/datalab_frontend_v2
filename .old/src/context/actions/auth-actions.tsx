import type { LoginPayload } from '@/lib/types/auth';
import type { InferActions } from '@/lib/types/utils';

export const authProviderActions = {
  LOGIN: (payload: LoginPayload) =>
    ({
      type: 'LOGIN',
      payload,
    }) as const,

  LOGOUT: () =>
    ({
      type: 'LOGOUT',
    }) as const,
  REFRESH: (payload: { accessToken: string; refreshToken: string }) =>
    ({
      type: 'REFRESH',
      payload,
    }) as const,
};
export type AuthAction = InferActions<typeof authProviderActions>;
