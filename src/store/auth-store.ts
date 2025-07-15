import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { AuthUser, LoginPayload } from '@/lib/types/auth';
import { useShallow } from 'zustand/react/shallow';

interface AuthState {
  user: AuthUser | null;
  access_token: string | null;
  refresh_token: string | null;
  is_authenticated: boolean;
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
          }),
        logout: () =>
          set({
            user: null,
            access_token: null,
            refresh_token: null,
            is_authenticated: false,
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
      setUser: state.setUser,
      setTokens: state.setTokens,
      setAccessToken: state.setAccessToken,
      setIsAuthenticated: state.setIsAuthenticated,
      login: state.login,
      logout: state.logout,
    }))
  );
}
