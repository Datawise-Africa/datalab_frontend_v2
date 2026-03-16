import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUserRoleType } from '~/lib/types/auth-context';

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_role: AuthUserRoleType;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  sessionId: string;
}

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  sessionId: generateSessionId(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        user: AuthUser;
      }>
    ) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.sessionId = generateSessionId();
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    login(
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string;
        user_id: string;
        email: string;
        first_name: string;
        last_name: string;
        user_role: AuthUserRoleType;
      }>
    ) {
      const p = action.payload;
      state.token = p.access_token;
      state.refreshToken = p.refresh_token;
      state.user = {
        id: p.user_id,
        email: p.email,
        first_name: p.first_name,
        last_name: p.last_name,
        full_name: `${p.first_name} ${p.last_name}`,
        user_role: p.user_role,
      };
      state.isAuthenticated = true;
      state.sessionId = generateSessionId();
    },
    clearAuth() {
      return { ...initialState, sessionId: generateSessionId() };
    },
  },
});

export const { setCredentials, setToken, login, clearAuth } = authSlice.actions;
export default authSlice.reducer;
