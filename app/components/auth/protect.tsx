import type { ReactNode } from 'react';
import { useAppSelector } from '~/store';
import { useAppModal } from '~/store/slices/modal-slice';
import type { AuthUserRoleType } from '~/lib/types/auth-context';
import { AuthPerm } from '~/lib/utils/perm';
import { useIsClient } from '~/hooks/use-is-client';

interface ProtectProps {
  children: ReactNode;
  roles?: AuthUserRoleType[];
  fallback?: ReactNode;
}

export function Protect({ children, roles, fallback }: ProtectProps) {
  const isClient = useIsClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const authModal = useAppModal('auth');

  // During SSR and initial client render, show a loading state.
  // This ensures server and client HTML match. Auth check kicks in after hydration.
  if (!isClient) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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
