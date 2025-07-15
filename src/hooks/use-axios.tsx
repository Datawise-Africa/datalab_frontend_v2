import { useAuthStore } from '@/store/auth-store';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

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
  });

  // Request interceptor
  axiosClient.interceptors.request.use(
    (config) => {
      const token = store.access_token;

      if (token) {
        config.headers.Authorization = `JWT ${store.access_token}`;
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

        try {
          const refreshToken = store.refresh_token;

          if (!refreshToken) {
            // No refresh token available, logout user
            store.logout();
            return Promise.reject(error);
          }

          // Request new access token using refresh token
          type RefreshResponseDataType = {
            access_token: string;
            refresh_token: string;
          };
          console.log('Attempting to refresh token');
          const { data } = await axiosClient.post<RefreshResponseDataType>(
          
            '/auth/refresh-token/',
            {
              refresh_token: refreshToken,
            },
          );

          const { access_token, refresh_token } = data;

          // Update auth store with new token
          store.setTokens(access_token, refresh_token);

          // Update the original request with the new token
          originalRequest.headers.Authorization = `JWT ${access_token}`;

          // Retry the original request
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout the user
          store.logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
  return axiosClient;
};
