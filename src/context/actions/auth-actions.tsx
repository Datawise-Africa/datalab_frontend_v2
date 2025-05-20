import type { InferActions } from '@/lib/types/utils';

type LoginPayload = {
  userId: string | null;
  userRole: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  firstName: string | null;
  lastName: string | null;
};

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
};
export type AuthAction = InferActions<typeof authProviderActions>;
