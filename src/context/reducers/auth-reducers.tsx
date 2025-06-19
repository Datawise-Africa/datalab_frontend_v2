import type { AuthAction } from '../actions/auth-actions';
import type { AuthState, AuthStateWithRecord } from '@/lib/types/auth-context';

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        fullName: `${action.payload.firstName} ${action.payload.lastName}`,
        ...action.payload,
      };
    }
    case 'LOGOUT': {
      return Object.keys(state).reduce<AuthStateWithRecord>((acc, key) => {
        acc[key] = null;
        return acc;
      }, {} as AuthStateWithRecord);
    }
    case 'REFRESH': {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    }
    default:
      return state;
  }
}
