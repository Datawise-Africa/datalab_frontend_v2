import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AuthState,
  AuthUser,
  RegisterOrLoginResponse,
} from '~/lib/types/auth';

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const initialState: AuthState = {
  ac_tk: null,
  rf_tk: null,
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
        ac_tk: string;
        rf_tk: string;
        user: AuthUser;
      }>
    ) {
      state.ac_tk = action.payload.ac_tk;
      state.rf_tk = action.payload.rf_tk;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.sessionId = generateSessionId();
    },
    setToken(state, action: PayloadAction<string>) {
      state.ac_tk = action.payload;
      state.isAuthenticated = true;
    },
    login(state, { payload }: PayloadAction<RegisterOrLoginResponse>) {
      const { user, user_role, access, refresh } = payload;
      state.ac_tk = access;
      state.rf_tk = refresh;
      state.user = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: `${user.first_name} ${user.last_name}`,
        date_joined: user.date_joined,
        user_role,
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
