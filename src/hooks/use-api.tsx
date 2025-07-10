import axios from 'axios';
import { REACT_PUBLIC_API_HOST } from '@/constants';
import { useAuth } from '@/context/AuthProvider';

export default function useApi() {
  const auth = useAuth();
  const api = axios.create({
    baseURL: REACT_PUBLIC_API_HOST,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const getDataFile = async (url: string) => {
    try {
      const response = await api.get(url, {
        headers: {
          Accept: 'text/csv',
          'Content-Type': 'text/csv',
          responseType: 'text/plain; charset=UTF-8',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data file:', error);
      throw error;
    }
  };
  // Add Authorization token to requests
  api.interceptors.request.use((config) => {
    if (auth.isAuthenticated) {
      config.headers.Authorization = `JWT ${auth.state?.accessToken}`;
    }
    return config;
  });

  // Handle 401 responses
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only handle 401 errors and avoid infinite loops
      if (error.response?.status !== 401 || originalRequest._retry) {
        // For non-401 errors or already-retried requests, reject immediately
        return Promise.reject(error);
      }

      // Mark the request to prevent infinite retries
      originalRequest._retry = true;

      // Check if we have a refresh token
      if (!auth.state.refreshToken) {
        console.error('No refresh token available');
        auth.dispatch({ type: 'LOGOUT' });
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh token');
        const response = await api.post(
          '/auth/refresh-token/',
          {
            refresh_token: auth.state.refreshToken,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            // _noAuth: true, // Add this to prevent the interceptor from intercepting this request
          },
        );

        // Update auth state with new tokens
        auth.dispatch(
          auth.actions.REFRESH({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
          }),
        );

        // Update the original request header
        originalRequest.headers.Authorization = `JWT ${response.data.access_token}`;

        // Retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        auth.dispatch({ type: 'LOGOUT' });
        return Promise.reject(refreshError);
      }
    },
  );

  return {
    getDataFile,
    api,
  };
}
