import type {
  AuthAction,
  authProviderActions,
} from '@/storage/actions/auth-actions';

export type AuthState = {
  userId: string | null;
  userRole: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  firstName: string | null;
  lastName: string | null;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};
export type AuthStateWithRecord = AuthState & {
  [key: string]: any;
};

export type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  actions: typeof authProviderActions;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
};
