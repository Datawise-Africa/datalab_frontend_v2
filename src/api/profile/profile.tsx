import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from './profile-keys';
import type {
  ChangePasswordDataType,
  UpdateUserProfileDataType,
} from '@/lib/schema/user-profile';
import { useAuth } from '@/store/auth-store';
import { useAxios } from '@/hooks/use-axios';



export type UserProfileType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: {
    id: number;
    title: string | null;
    avatar: string | null;
    bio: string | null;
    phone_number: string | null;
    organization: string | null;
    location: string | null;
    linkedin_url: string | null;
  };
};

// Fix: Remove nested property from Omit - TypeScript can't omit nested properties directly
export type UserProfileUpdateType = Omit<UserProfileType, 'id'> & {
  profile: Omit<UserProfileType['profile'], 'id'>;
};

export function useUserProfile() {
  const { is_authenticated } = useAuth();
const axiosClient = useAxios();
  const queryClient = useQueryClient();

  async function fetchProfile(): Promise<UserProfileType> {
    const { data } = await axiosClient.get<UserProfileType>('/auth/me/');
    return data;
  }

  async function updateProfile(
    profileData: UpdateUserProfileDataType,
  ): Promise<UserProfileType> {
    const { data } = await axiosClient.put<UserProfileType>('/auth/me/', profileData);
    return data;
  }

  async function changePassword(
    payload: ChangePasswordDataType,
  ): Promise<void> {
    await axiosClient.post('/auth/change-password/', {
      old_password: payload.current_password,
      new_password: payload.new_password,
    });
  }

  const { data, isLoading, error, isError } = useQuery({
    queryKey: profileKeys.all,
    queryFn: fetchProfile,
    placeholderData: (prev) => prev, // Use previous data to indicate loading state
    // initialData: {} as UserProfileType, // Start with no initial data
    enabled: is_authenticated, // Only fetch if authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Reduce unnecessary refetches
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors (401, 403)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    // Remove conflicting options that prevent fetching
    // placeholderData and initialData can interfere with proper loading states
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      // Optimistically update the cache with the returned data
      queryClient.setQueryData(profileKeys.all, updatedProfile);

      // Invalidate related queries if they exist
      queryClient.invalidateQueries({
        queryKey: profileKeys.details?.() || [],
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      // Optionally, you can show a success message or perform other actions
      console.log('Password changed successfully');
    },
    onError: (error) => {
      console.error('Error changing password:', error);
    },
  });
  return {
    profile: data!,
    isLoading,
    error,
    isError,
    updateProfile: updateProfileMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  };
}
