import type { InferActions } from '@/lib/types/utils';

type LoginPayload = {
  userId: string;
  userRole: string;
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  email: string;
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
