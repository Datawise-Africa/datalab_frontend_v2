import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ResetPasswordRequestBody,
} from '~/lib/schema/auth-schema';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
} from '~/lib/schema/user-profile-schema';
import type { RegisterOrLoginResponse, AuthUser } from '~/lib/types/auth';
import { useAppDispatch } from '~/store';
import { login, clearAuth, setToken } from '~/store/slices/auth-slice';
import { authKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await apiClient.post<RegisterOrLoginResponse>(
        '/auth/login/',
        input
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.clear();

      dispatch(
        login({
          access: data.access,
          refresh: data.refresh,
          user_role: data.user_role,
          user: {
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            is_verified: true,
            is_active: true,
            date_joined: new Date().toISOString(),
          },
        })
      );
    },
    onError: (error) => {
      toastUtils.error('Login failed', extractError(error));
    },
  });
};

export const useSignup = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SignupInput) => {
      const { data } = await apiClient.post<RegisterOrLoginResponse>(
        '/auth/register/',
        {
          ...input,
          profile: { bio: '', linkedin_url: '' },
        }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.clear();
      dispatch(
        login({
          access: data.access,
          refresh: data.refresh,
          user_role: data.user_role,
          user: {
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            is_verified: true,
            is_active: true,
            date_joined: new Date().toISOString(),
          },
        })
      );
    },
    onError: (error) => {
      toastUtils.error('Signup failed', extractError(error));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      // No backend logout endpoint in spec — client-only clear.
    },
    onSettled: () => {
      dispatch(clearAuth());
      queryClient.clear();
    },
  });
};

// TODO: No profile update endpoint in OpenAPI spec. Backend confirmation pending.
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput): Promise<AuthUser> => {
      const { data } = await apiClient.put('/auth/me/', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      toastUtils.error('Profile update failed', extractError(error));
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (input: ChangePasswordInput): Promise<void> => {
      await apiClient.post('/auth/change-password/', input);
    },
    onError: (error) => {
      toastUtils.error('Password change failed', extractError(error));
    },
  });
};

/** Send password reset OTP to email. */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (input: ForgotPasswordInput): Promise<void> => {
      await apiClient.post('/auth/forgot-password/', input);
    },
    onError: (error) => {
      toastUtils.error('Reset request failed', extractError(error));
    },
  });
};

/** Complete password reset with OTP + new password. */
export const useCompletePasswordReset = () => {
  return useMutation({
    mutationFn: async (input: ResetPasswordInput): Promise<void> => {
      const body: ResetPasswordRequestBody = {
        otp_code: input.otp_code,
        new_password: input.new_password,
      };
      await apiClient.patch('/auth/reset-password/', body);
    },
    onError: (error) => {
      toastUtils.error('Password reset failed', extractError(error));
    },
  });
};

/** Refresh the access token using the stored refresh token. */
export const useRefreshToken = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (refresh: string): Promise<string> => {
      const { data } = await apiClient.post<{ access: string }>(
        '/auth/token/refresh/',
        { refresh }
      );
      return data.access;
    },
    onSuccess: (access) => {
      dispatch(setToken(access));
    },
    onError: () => {
      dispatch(clearAuth());
    },
  });
};
