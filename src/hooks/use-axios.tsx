import { useAuthStore } from '@/store/auth-store';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Global flag to track if a token refresh is in progress
let isRefreshing = false;
// Store for callbacks to be executed after token refresh
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Subscribe callback function to be executed after token refresh
 */
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

/**
 * Execute all callbacks with the new token after refresh completes
 */
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const useAxios = () => {
  const VITE_APP_API_URL =
    import.meta.env.VITE_APP_API_URL || 'https://backend.datawiseafrica.com';
  const store = useAuthStore();
  // Create Axios instance
  const axiosClient = axios.create({
    baseURL: VITE_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    // Add timeout to prevent hanging requests
    timeout: 30000, // 30 seconds
  });

  // Request interceptor
  axiosClient.interceptors.request.use(
    (config) => {
      const token = store.access_token;

      if (token) {
        config.headers.Authorization = `JWT ${store.access_token}`;
      }

      // Add AbortController support
      if (!config.signal) {
        const controller = new AbortController();
        config.signal = controller.signal;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // If error is 401 and we haven't already tried to refresh the token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // If refresh is already in progress, wait for the new token
        if (isRefreshing) {
          try {
            return new Promise((resolve) => {
              // Once token is refreshed, retry original request with new token
              subscribeTokenRefresh((token: string) => {
                originalRequest.headers.Authorization = `JWT ${token}`;
                resolve(axiosClient(originalRequest));
              });
            });
          } catch (waitError) {
            return Promise.reject(waitError);
          }
        }

        // Set refreshing flag
        isRefreshing = true;

        try {
          const refreshToken = store.refresh_token;

          if (!refreshToken) {
            // No refresh token available, logout user
            store.logout();
            isRefreshing = false;
            return Promise.reject(error);
          }

          // Create specific AbortController for the refresh request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort('Token refresh timeout after 10s');
          }, 10000); // 10 seconds timeout

          // Request new access token using refresh token
          type RefreshResponseDataType = {
            access_token: string;
            refresh_token: string;
          };
          console.log('Attempting to refresh token');
          const { data } = await axiosClient.post<RefreshResponseDataType>(
            '/auth/refresh-token/',
            { refresh_token: refreshToken },
            { signal: controller.signal }
          );

          // Clear the timeout since request completed
          clearTimeout(timeoutId);

          const { access_token, refresh_token } = data;

          // Update auth store with new tokens
          store.setTokens(access_token, refresh_token);

          // Update the original request with the new token
          originalRequest.headers.Authorization = `JWT ${access_token}`;

          // Notify all pending requests that token has been refreshed
          onRefreshed(access_token);

          // Reset refreshing flag
          isRefreshing = false;

          // Retry the original request
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout the user
          console.error('Token refresh failed:', refreshError);
          store.logout();
          isRefreshing = false;
          refreshSubscribers = [];
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
  return axiosClient;
};
