import { useAuthStore } from '@/store/auth-store';
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios';
import { useMemo } from 'react';

const AUTH_PATHS = ['login', 'register', 'refresh'];
/**
 * Checks if the URL is part of the authentication paths
 * @param url The URL to check
 * @returns True if the URL is an auth path, false otherwise
 */
const isAuthPageUrl = (url?: string) =>
  AUTH_PATHS.some((p) => !!url?.includes(p));

// Hook to get a configured Axios instance with JWT auto-refresh
export const useAxios = (): AxiosInstance => {
  const store = useAuthStore();
  const API_URL =
    import.meta.env.VITE_APP_API_URL || 'https://backend.datawiseafrica.com';

  const client = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30_000,
  });

  const accessTokenToUse = useMemo(() => {
    return store.access_token || '';
  }, [store.access_token]);

  // 1) Attach JWT to *every* outgoing request
  client.interceptors.request.use(
    (config) => {
      if (accessTokenToUse && !isAuthPageUrl(config.url)) {
        config.headers!['Authorization'] = `Bearer ${accessTokenToUse}`;
        config.headers!['X-Requested-With'] = 'XMLHttpRequest';
      }
      return config;
    },
    (err) => Promise.reject(err),
  );

  // 2) Global response handler to catch 401s & retry once
  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const origReq = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      // only handle if we got a 401, we're not already retrying, and
      // it's not the login/register/refresh endpoint itself
      if (
        error.response?.status === 401 &&
        !origReq._retry &&
        !isAuthPageUrl(origReq.url)
      ) {
        origReq._retry = true;

        // if no refresh token, bail out
        if (!store.refresh_token) {
          // store.logout();
          return Promise.reject(error);
        }

        try {
          // Logout the user
          store.logout();
          // const originalToken = store.access_token;
          // // 3) grab a fresh pair
          // const { data } = await axios.post<{
          //   access_token: string;
          //   refresh_token: string;
          // }>(`${API_URL}/auth/refresh-token/`, {
          //   refresh_token: store.refresh_token,
          // });
          // const tokenDetails = {
          //   or_store: { access: store.access_token, refresh: store.refresh_token },
          // };
          // // 4) stash them in your Zustand store
          // store.setTokens(data.access_token, data.refresh_token);
          // tokenDetails['new_store'] = {
          //   access: store.access_token,
          //   refresh: store.refresh_token,
          // };
          // tokenDetails['req_token'] = data;
          // console.log({ tokenDetails });

          // // 5) update the original request and retry it
          // origReq.headers!['Authorization'] = `JWT ${accessTokenToUse}`;
          // console.log(
          //   `Retrying request with new token: ${data.access_token}, Store token: ${store.access_token}, Original token: ${originalToken}`,
          // );

          // return client(origReq);
        } catch (refreshError) {
          // refresh also failed → really log out
          console.error('Refresh failed:', refreshError);
          store.logout();
          return Promise.reject(refreshError);
        }
      }

      // all other errors get bubbled up
      return Promise.reject(error);
    },
  );

  return client;
};
