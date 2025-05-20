import type { PositionState } from '@/lib/types/position-context';
import type { PositionAction } from '../actions/position-actions';

export const positionReducer = (
  state: PositionState,
  action: PositionAction,
) => {
  switch (action.type) {
    case 'SET_POSITION':
      return { ...state, selectedPosition: action.payload };
    case 'RESET_POSITION':
      return { ...state, selectedPosition: null };
    default:
      return state;
  }
};
