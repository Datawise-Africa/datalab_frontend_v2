import axios from 'axios';
import { REACT_PUBLIC_API_HOST } from '@/constants';
import { useAuth } from '@/context/AuthProvider';

export default function useApi() {
  const auth = useAuth();
  const privateApi = axios.create({
    baseURL: REACT_PUBLIC_API_HOST,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${auth.state.accessToken}`,
    },
  });

  const publicApi = axios.create({
    baseURL: REACT_PUBLIC_API_HOST,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const getDataFile = async (url: string) => {
    try {
      const response = await axios.get(url, {
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
  privateApi.interceptors.request.use((config) => {
    if (auth.state?.accessToken) {
      config.headers.Authorization = `JWT ${auth.state?.accessToken}`;
    }
    return config;
  });

  // Handle 401 responses
  privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Prevent infinite retry loops
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          if (!auth.state.refreshToken) {
            console.error('No refresh token available');
            auth.dispatch({ type: 'LOGOUT' });
            return Promise.reject(error);
          }
          const response = await publicApi.post(
            `/auth/refresh-token/`,
            {
              ...(auth.isAuthenticated
                ? {
                    grant_type: 'refresh_token',
                    refresh_token: auth.state?.refreshToken,
                  }
                : {}),
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          auth.dispatch(
            auth.actions.REFRESH({
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            }),
          );
          // Retry the original request with new access token
          originalRequest.headers.Authorization = `JWT ${response.data.access_token}`;
          return privateApi.request(originalRequest);
          // } else {
          //   console.error('Token refresh failed:', response);
          // }
        } catch (refreshError) {
          console.error('Refresh error:', refreshError);
          // Logout user after failed retry
          auth.dispatch({ type: 'LOGOUT' });
        }
      } else if (error.response?.status === 401 && originalRequest._retry) {
        // Second 401 even after retry — force logout
        auth.dispatch({ type: 'LOGOUT' });
      }

      return Promise.reject(error);
    },
  );

  return {
    getDataFile,
    privateApi,
    publicApi,
  };
}
