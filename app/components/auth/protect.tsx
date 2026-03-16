import { type ReactNode } from 'react';
import { useAppSelector } from '~/store';
import { useAppModal } from '~/store/slices/modal-slice';
import type { AuthUserRoleType } from '~/lib/types/auth-context';
import { AuthPerm } from '~/lib/utils/perm';

interface ProtectProps {
  children: ReactNode;
  roles?: AuthUserRoleType[];
  fallback?: ReactNode;
}

export function Protect({ children, roles, fallback }: ProtectProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const authModal = useAppModal('auth');

  if (!isAuthenticated || !user) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-semibold">Sign in required</h2>
        <p className="text-muted-foreground">
          You need to be signed in to access this page.
        </p>
        <button
          type="button"
          className="rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
          onClick={() => authModal.open()}
        >
          Sign in
        </button>
      </div>
    );
  }

  if (roles && roles.length > 0) {
    const perm = AuthPerm.getInstance();
    const hasRole = perm.hasAnyPermission(roles, user.user_role);
    if (!hasRole) {
      if (fallback) return <>{fallback}</>;
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-2xl font-semibold">Access restricted</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
