import type {
  PositionAction,
  positionProviderActions,
} from '@/storage/actions/position-actions';

export type PositionState = {
  selectedPosition: string | null;
};

export type PositionProviderProps = {
  children: React.ReactNode;
};

export type PositionContextType = {
  state: PositionState;
  dispatch: React.Dispatch<PositionAction>;
  actions: typeof positionProviderActions;
};
