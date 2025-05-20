import {
  useContext,
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Cookie } from '@/lib/auth/cookie';
import type {
  AuthContextType,
  AuthProviderProps,
  AuthState,
} from '@/lib/types/auth-context';
import { authProviderActions } from './actions/auth-actions';
import { authReducer } from './reducers/auth-reducers';

const initialState: AuthState = {
  userId: Cookie.get('session_user_id') ?? null,
  userRole: Cookie.get('session_userrole') ?? null,
  accessToken: Cookie.get('session_access_token') ?? null,
  refreshToken: Cookie.get('session_refresh_token') ?? null,
  firstName: Cookie.get('session_first_name') ?? null,
  lastName: Cookie.get('session_last_name') ?? null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const syncState = useCallback(() => {
    Cookie.set('session_user_id', state.userId);
    Cookie.set('session_userrole', state.userRole);
    Cookie.set('session_access_token', state.accessToken);
    Cookie.set('session_refresh_token', state.refreshToken);
    Cookie.set('session_first_name', state.firstName);
    Cookie.set('session_last_name', state.lastName);
  }, [state]);
  const isAuthenticated = useMemo(() => {
    return !!state.userId && !!state.accessToken;
  }, [state.userId, state.accessToken]);

  useEffect(() => {
    syncState();
  }, [state, syncState]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        actions: authProviderActions,
        isAuthenticated,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
