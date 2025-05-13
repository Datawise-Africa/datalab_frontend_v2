import {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Cookie } from '@/lib/auth/actions';
import type { AuthState } from '@/lib/types/actions';
import { useAuthModal } from '@/hooks/useAuthModal';

const initialState: AuthState = {
  userId: Cookie.get('session_user_id') ?? null,
  userRole: Cookie.get('session_userrole') ?? null,
  accessToken: Cookie.get('session_access_token') ?? null,
  refreshToken: Cookie.get('session_refresh_token') ?? null,
  firstName: Cookie.get('session_first_name') ?? null,
  lastName: Cookie.get('session_last_name') ?? null,
};

const actions = {
  LOGIN: (
    userId: string,
    userRole: string,
    accessToken: string,
    refreshToken: string,
    firstName: string,
    lastName: string,
  ) =>
    /** @type {const} */ ({
      type: 'LOGIN',
      payload: {
        userId,
        userRole,
        accessToken,
        refreshToken,
        firstName,
        lastName,
      },
    }) as const,

  LOGOUT: () =>
    /** @type {const} */ ({
      type: 'LOGOUT',
    }) as const,
};

type HandleAuthModalToggle = <R = any>(
  callback?: <T = any>(...args: any[]) => Promise<T> | T,
) => null | R;
export const AuthContext = createContext<{
  state: AuthState;
  actions: typeof actions;
  dispatch: React.Dispatch<ReturnType<(typeof actions)[keyof typeof actions]>>;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
  openAuthModal: () => void;
  handleAuthModalToggle: HandleAuthModalToggle;
}>({
  state: initialState,
  actions,
  dispatch: () => null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  closeAuthModal: () => null,
  openAuthModal: () => null,
  handleAuthModalToggle: (
    _callback?: <T = any>(...args: any[]) => Promise<T> | T,
  ) => null,
});

function authReducer(
  state: AuthState,
  action: ReturnType<(typeof actions)[keyof typeof actions]>,
) {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'LOGOUT': {
      return Object.keys(state).reduce<AuthState>((acc, key) => {
        acc[key as keyof AuthState] = null;
        return acc;
      }, {} as AuthState);
    }
    default:
      return state;
  }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { close, open, isOpen } = useAuthModal();
  const syncState = useCallback(() => {
    Cookie.set('session_user_id', state.userId);
    Cookie.set('session_userrole', state.userRole);
    Cookie.set('session_access_token', state.accessToken);
    Cookie.set('session_refresh_token', state.refreshToken);
    Cookie.set('session_first_name', state.firstName);
    Cookie.set('session_last_name', state.lastName);
  }, [state]);
  const handleAuthModalToggle: HandleAuthModalToggle = (callback) => {
    // Toggle the modal
    if (isOpen) {
      close();
    } else {
      open();
    }

    // If user is not authenticated, stop after toggle
    if (!isAuthenticated) {
      callback?.();
      return null;
    }

    // If authenticated, also run callback after toggle
    callback?.();
    return null;
  };
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
        actions,
        isAuthenticated,
        closeAuthModal: close,
        openAuthModal: open,
        isAuthModalOpen: isOpen,
        handleAuthModalToggle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export { AuthProvider };
