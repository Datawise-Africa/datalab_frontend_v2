export type AuthUserRoleType = 'user' | 'dataset_creator' | 'admin';

export type AuthProviderProps = {
  children: React.ReactNode;
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
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  queue: AuthContextQueue;
};
