import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '~/lib/schema/auth-schema';
import type {
  UpdateProfileInput,
  ChangePasswordInput,
} from '~/lib/schema/user-profile-schema';
import type { RegisterOrLoginResponse, AuthUser } from '~/lib/types/auth';
import { useAppDispatch } from '~/store';
import { login, clearAuth } from '~/store/slices/auth-slice';
import { authKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LoginInput): Promise<RegisterOrLoginResponse> => {
      const { data } = await apiClient.post('/auth/login/', input);
      return data;
    },
    onSuccess: (data) => {
      queryClient.clear();
      dispatch(
        login({
          access: data.access_token,
          refresh: data.refresh_token,
          user_role: data.user_role,
          user: {
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
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
    mutationFn: async (
      input: SignupInput
    ): Promise<RegisterOrLoginResponse> => {
      const { data } = await apiClient.post('/auth/register/', {
        ...input,
        profile: { bio: '', linkdin_url: '' },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.clear();
      dispatch(
        login({
          access: data.access_token,
          refresh: data.refresh_token,
          user_role: data.user_role,
          user: {
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
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
      await apiClient.post('/auth/logout/');
    },
    onSettled: () => {
      dispatch(clearAuth());
      queryClient.clear();
    },
  });
};

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
      await apiClient.post('/auth/password-reset/', input);
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
      await apiClient.patch('/auth/password-reset-complete/', input);
    },
    onError: (error) => {
      toastUtils.error('Password reset failed', extractError(error));
    },
  });
};
