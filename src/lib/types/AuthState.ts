export type AuthState = {
  userId: string | null;
  userRole: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  firstName: string | null;
  lastName: string | null;
};
