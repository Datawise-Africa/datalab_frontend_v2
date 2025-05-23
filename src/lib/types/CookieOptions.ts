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
