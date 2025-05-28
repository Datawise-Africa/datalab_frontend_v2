import { useAuth } from '@/context/AuthProvider';
import { AuthPerm } from '@/lib/auth/perm';
import { useMemo } from 'react';

function useCan() {
  const authPerm = AuthPerm.getInstance();
  const { isAuthenticated, state } = useAuth();
  if (!isAuthenticated) {
    return {
      is_admin: false,
      is_dataset_creator: false,
    };
  }

  const access = useMemo(() => {
    return {
      is_admin: authPerm.hasPermission('admin', state.userRole),
      is_dataset_creator: authPerm.hasPermission(
        'dataset_creator',
        state.userRole,
      ),
    };
  }, [state.userRole, isAuthenticated]);

  return access;
}

export default useCan;
