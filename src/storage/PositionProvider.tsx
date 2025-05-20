import { createContext, useReducer, useEffect, useContext } from 'react';
import { positionProviderActions } from './actions/position-actions';
import type {
  PositionContextType,
  PositionProviderProps,
  PositionState,
} from '@/lib/types/position-context';
import { positionReducer } from './reducers/position-reducers';

const POSITION_KEY = 'selected_position_key';

const initialState = (
  JSON.parse(localStorage.getItem(POSITION_KEY)!)
    ? JSON.parse(localStorage.getItem(POSITION_KEY)!)
    : {
        selectedPosition: null,
      }
) as PositionState;

// Create context
export const PositionContext = createContext<PositionContextType | undefined>(
  undefined,
);

// Create provider
export const PositionProvider = ({ children }: PositionProviderProps) => {
  const [state, dispatch] = useReducer(positionReducer, initialState);
  useEffect(() => {
    localStorage.setItem(POSITION_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <PositionContext.Provider
      value={{ state, dispatch, actions: positionProviderActions }}
    >
      {children}
    </PositionContext.Provider>
  );
};

export const usePosition = () => {
  const context = useContext(PositionContext);
  if (context === undefined) {
    throw new Error('usePosition must be used within a PositionProvider');
  }
  return context;
};
