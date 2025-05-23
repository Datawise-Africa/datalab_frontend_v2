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
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data file:', error);
      throw error;
    }
  };

  return {
    getDataFile,
    privateApi,
    publicApi,
  };
}
