import { AuthContext } from '@/storage/AuthProvider';
import { useContext } from 'react';

export const useAuth = () => {
  return useContext(AuthContext);
};
