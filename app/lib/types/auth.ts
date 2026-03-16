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

export type LoginPayload = {
  user_id: string;
  user_role: AuthUserRoleType;
  access_token: string;
  refresh_token: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type AuthUser = {
  user_id: string;
  user_role: AuthUserRoleType;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
};
