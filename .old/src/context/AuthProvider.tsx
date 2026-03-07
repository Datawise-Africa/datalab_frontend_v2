import { useContext, createContext, useState } from 'react';
import type {
  AuthContextType,
  AuthProviderProps,
} from '@/lib/types/auth-context';
import { useAuthQueue } from './utils/useAuthQueue';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const aQueue = useAuthQueue();

  return (
    <AuthContext.Provider
      value={{
        isAuthModalOpen,
        setIsAuthModalOpen,
        queue: aQueue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  return useContext(AuthContext)!;
};

export { AuthProvider, useAuthContext };
