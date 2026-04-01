import type { AuthUserRoleType } from './auth-context';

export type RegisterOrLoginResponse = {
  refresh: string;
  access: string;
  user_role: AuthUserRoleType;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    is_active: boolean;
    date_joined: string;
  };
};
export interface AuthUser extends Omit<
  RegisterOrLoginResponse['user'],
  'is_verified' | 'is_active'
> {
  full_name: string;
  user_role: AuthUserRoleType;
}

export interface AuthState {
  ac_tk: string | null;
  rf_tk: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  sessionId: string;
}
