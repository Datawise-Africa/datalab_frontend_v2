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
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user_id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          user_role: data.user_role,
        })
      );
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
      const { data } = await apiClient.post('/auth/register/', input);
      return data;
    },
    onSuccess: (data) => {
      queryClient.clear();
      dispatch(
        login({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user_id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          user_role: data.user_role,
        })
      );
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
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (input: ChangePasswordInput): Promise<void> => {
      await apiClient.post('/auth/change-password/', input);
    },
  });
};

/** Send password reset OTP to email. */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (input: ForgotPasswordInput): Promise<void> => {
      await apiClient.post('/auth/password-reset/', input);
    },
  });
};

/** Complete password reset with OTP + new password. */
export const useCompletePasswordReset = () => {
  return useMutation({
    mutationFn: async (input: ResetPasswordInput): Promise<void> => {
      await apiClient.patch('/auth/password-reset-complete/', input);
    },
  });
};
