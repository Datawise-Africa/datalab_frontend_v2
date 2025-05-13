export interface CookieOptions {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  httpOnly?: boolean;
  maxAge?: number;
  [key: string]: any;
}

export type AuthState = {
  userId: string | null;
  userRole: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  firstName: string | null;
  lastName: string | null;
};
