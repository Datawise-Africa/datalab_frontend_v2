import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { AuthUser, LoginPayload } from '@/lib/types/auth';
import { useShallow } from 'zustand/react/shallow';
import { v4 as uuid } from 'uuid';
interface AuthState {
  user: AuthUser | null;
  access_token: string | null;
  refresh_token: string | null;
  is_authenticated: boolean;
  session_id?: string;
  setSessionId?: (session_id: string) => void;
  setUser: (user: AuthUser) => void;
  setTokens: (access_token: string, refresh_token: string) => void;
  setAccessToken: (access_token: string) => void;
  setIsAuthenticated: (is_authenticated: boolean) => void;
  login: (payload: LoginPayload) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        access_token: null,
        refresh_token: null,
        is_authenticated: false,
        session_id: uuid(),
        setUser: (user) => set({ user }),
        setTokens: (access_token, refresh_token) =>
          set({ access_token, refresh_token, is_authenticated: true }),
        setAccessToken: (access_token) => set({ access_token }),
        setIsAuthenticated: (is_authenticated) => set({ is_authenticated }),
        login: (payload) =>
          set({
            user: {
              user_id: payload.user_id,
              user_role: payload.user_role,
              first_name: payload.first_name,
              last_name: payload.last_name,
              email: payload.email,
              full_name: `${payload.first_name} ${payload.last_name}`,
            },
            access_token: payload.access_token,
            refresh_token: payload.refresh_token,
            is_authenticated: true,
            session_id: uuid(),
          }),
        logout: () =>
          set({
            user: null,
            access_token: null,
            refresh_token: null,
            is_authenticated: false,
            session_id: uuid(),
          }),
      }),
      {
        name: 'auth-storage',
        // storage: createJSONStorage(),
        partialize: (state) => ({
          user: state.user,
          access_token: state.access_token,
          refresh_token: state.refresh_token,
          is_authenticated: state.is_authenticated,
        }),
        version: 1,
      }
    ),
    { name: 'AuthStore' }
  )
);

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      access_token: state.access_token,
      refresh_token: state.refresh_token,
      is_authenticated: state.is_authenticated,
      session_id: state.session_id,
      setUser: state.setUser,
      setTokens: state.setTokens,
      setAccessToken: state.setAccessToken,
      setIsAuthenticated: state.setIsAuthenticated,
      login: state.login,
      logout: state.logout,
    }))
  );
}
