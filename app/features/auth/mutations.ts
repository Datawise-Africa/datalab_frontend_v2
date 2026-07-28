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
import { login, clearAuth } from '~/store/slices/auth-slice';
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
      dispatch(login(data));
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
      dispatch(login(data));
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

// BLOCKED ON BACKEND — verified against `datalab_backend` 2026-07-27, do not wire this up.
// `PUT /api/auth/me/` is not routed: `apps/authentication/urls.py:16-27` is the complete
// auth route list and has no `me/`, no DRF router, and no user-detail route by pk. Calling
// this returns 404 from Django's URL resolver.
//
// The backend is half-built, not absent: `apps/authentication/serializers.py:14-33` already
// defines `UpdateUserSerializer` (id, email, first_name, last_name + nested profile write)
// and `UserSerializer` alongside it, and neither is referenced by any view. Landing this
// needs one view — a `RetrieveUpdateAPIView` at `api/auth/me/` using those serializers.
//
// Until then the account-settings profile tab renders read-only (see `account-settings.tsx`).
// Keep this hook so the frontend half stays ready; re-enable the tab when the route exists.
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (input: UpdateProfileInput): Promise<AuthUser> => {
      const { data } = await apiClient.put('/auth/me/', input);
      return data;
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
