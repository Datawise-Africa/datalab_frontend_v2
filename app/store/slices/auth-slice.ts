import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUserRoleType } from '~/lib/types/auth-context';

type LoginActionPayload = {
  refresh: string;
  access: string;
  user_role: AuthUserRoleType;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    is_active: boolean;
    date_joined: string;
  };
};
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
    login(state, action: PayloadAction<LoginActionPayload>) {
      const p = action.payload;
      state.token = p.access;
      state.refreshToken = p.refresh;
      state.user = {
        id: p.user.id,
        email: p.user.email,
        first_name: p.user.first_name,
        last_name: p.user.last_name,
        full_name: `${p.user.first_name} ${p.user.last_name}`,
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
