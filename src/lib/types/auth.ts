import type { AuthUserRoleType } from './auth-context';

export type RegisterOrLoginResponse = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_role: AuthUserRoleType;
  refresh_token: string;
  access_token: string;
};
