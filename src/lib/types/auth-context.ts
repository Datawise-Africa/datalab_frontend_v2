import type {
  AuthAction,
  authProviderActions,
} from '@/context/actions/auth-actions';

export type AuthState = {
  userId: string;
  userRole: string;
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};
export type AuthStateWithRecord = AuthState & {
  [key: string]: any;
};
export type AuthQueueStatus = 'pending' | 'active' | 'done' | 'error';
export type QueueItem = {
  id: string;
  function: (...args: any[]) => Promise<any> | any;
  args: any[];
  status: AuthQueueStatus;
};
export type AddQueuePayload = Pick<QueueItem, 'args' | 'function'>;
export type QueueSummary = Record<AuthQueueStatus, number>;
export type AuthContextQueue = {
  queue: Map<string, QueueItem>;
  addToQueue: (item: AddQueuePayload | AddQueuePayload[]) => void;
  removeFromQueue: (id: string) => void;
  updateQueueItemStatus: (id: string, status: AuthQueueStatus) => void;
  processQueue: () => Promise<void>;
};
export type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  actions: typeof authProviderActions;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  queue: AuthContextQueue;
};
