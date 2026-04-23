import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '~/lib/env';
import { store } from '~/store';
import { clearAuth, setToken } from '~/store/slices/auth-slice';

const isDev = import.meta.env.DEV;

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    const token = store.getState().auth.ac_tk;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = store.getState().auth.rf_tk;
  if (!refresh) throw new Error('No refresh token');

  const { data } = await axios.post<{ access: string }>(
    `${env.VITE_API_BASE_URL}/auth/token/refresh/`,
    { refresh },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );
  store.dispatch(setToken(data.access));
  return data.access;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    if (isDev) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const isRefreshCall = original?.url?.includes('/auth/token/refresh/');
    const hasRefresh = Boolean(store.getState().auth.rf_tk);

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isRefreshCall &&
      hasRefresh
    ) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const access = await refreshPromise;
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: `Bearer ${access}`,
        };
        return apiClient(original);
      } catch {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }
    }

    if (status === 401) {
      store.dispatch(clearAuth());
    }

    return Promise.reject(error);
  }
);
