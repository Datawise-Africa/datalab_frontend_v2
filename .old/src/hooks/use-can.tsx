import { AuthPerm } from '@/lib/auth/perm';
import { useAuth } from '@/store/auth-store';
import { useMemo } from 'react';

function useCan() {
  const authPerm = AuthPerm.getInstance();
  const { is_authenticated, user } = useAuth();
  if (!is_authenticated) {
    return {
      is_admin: false,
      is_dataset_creator: false,
    };
  }

  const access = useMemo(() => {
    return {
      is_admin: authPerm.hasPermission('admin', user!.user_role),
      is_dataset_creator: authPerm.hasPermission(
        'dataset_creator',
        user!.user_role,
      ),
    };
  }, [user!.user_role, is_authenticated]);

  return access;
}

export default useCan;
