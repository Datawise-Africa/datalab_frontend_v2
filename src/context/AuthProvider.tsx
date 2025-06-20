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
const CookieManager = new Cookie<AuthState>();
const initialState: AuthState = {
  userId: CookieManager.get('userId'),
  userRole: CookieManager.get('userRole'),
  accessToken: CookieManager.get('accessToken'),
  refreshToken: CookieManager.get('refreshToken'),
  firstName: CookieManager.get('firstName'),
  lastName: CookieManager.get('lastName'),
  email: CookieManager.get('email'),
  fullName: CookieManager.get('fullName'),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const aQueue = useAuthQueue();

  const syncState = useCallback(() => {
    CookieManager.set('userId', state.userId);
    CookieManager.set('userRole', state.userRole);
    CookieManager.set('accessToken', state.accessToken);
    CookieManager.set('refreshToken', state.refreshToken);
    CookieManager.set('firstName', state.firstName);
    CookieManager.set('lastName', state.lastName);
    CookieManager.set('email', state.email);
    CookieManager.set('fullName', state.fullName);
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
