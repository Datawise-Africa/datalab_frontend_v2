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
  AddQueuePayload,
  AuthContextType,
  AuthProviderProps,
  AuthQueueStatus,
  AuthState,
  QueueItem,
  QueueSummary,
} from '@/lib/types/auth-context';
import { authProviderActions } from './actions/auth-actions';
import { authReducer } from './reducers/auth-reducers';

function useAuthQueue() {
  const [authQueue] = useState(new Map<string, QueueItem>());

  const addToQueue = (item: AddQueuePayload | AddQueuePayload[]) => {
    // Remove  items from queue before adding new ones
    // authQueue.forEach((i) => {
    //   // if (i.status === 'done' || i.status === 'error') {
    //   authQueue.delete(i.id);
    //   // }
    // });
    if (Array.isArray(item)) {
      item.forEach((i) => addToQueue(i));
      return;
    }
    const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    authQueue.set(id, { ...item, id, status: 'pending' });
  };

  const removeFromQueue = (id: string) => {
    authQueue.delete(id);
  };

  const updateQueueItemStatus = (id: string, status: AuthQueueStatus) => {
    const item = authQueue.get(id);
    if (item) {
      authQueue.set(id, { ...item, status });
    }
  };

  const processQueue = async () => {
    for (const queueItem of authQueue.values()) {
      if (queueItem.status !== 'pending') continue;

      const { id, function: func, args } = queueItem;

      if (typeof func !== 'function') continue;

      try {
        // console.log(`Processing queue item ${id} with args:`, args);

        updateQueueItemStatus(id, 'active');
        queueItem.status = 'active';
        const result = func(...args);
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        console.error(`Error processing queue item ${id}`, err);
        updateQueueItemStatus(id, 'error');
      }
    }
  };

  const watchedQueue = useMemo(() => {
    return Array.from(authQueue.values()).reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as QueueSummary);
  }, [authQueue]);

  return {
    queue: authQueue,
    addToQueue,
    removeFromQueue,
    updateQueueItemStatus,
    processQueue,
    watchedQueue,
  };
}

const initialState: AuthState = {
  userId: Cookie.get('session_user_id') ?? null,
  userRole: Cookie.get('session_userrole') ?? null,
  accessToken: Cookie.get('session_access_token') ?? null,
  refreshToken: Cookie.get('session_refresh_token') ?? null,
  firstName: Cookie.get('session_first_name') ?? null,
  lastName: Cookie.get('session_last_name') ?? null,
  email: Cookie.get('session_email') ?? null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const aQueue = useAuthQueue();

  const syncState = useCallback(() => {
    Cookie.set('session_user_id', state.userId);
    Cookie.set('session_userrole', state.userRole);
    Cookie.set('session_access_token', state.accessToken);
    Cookie.set('session_refresh_token', state.refreshToken);
    Cookie.set('session_first_name', state.firstName);
    Cookie.set('session_last_name', state.lastName);
    Cookie.set('session_email', state.email);
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
        queue: aQueue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext)!;
};

export { AuthProvider, useAuth };
