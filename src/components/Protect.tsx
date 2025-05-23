import { useAuth } from '@/context/AuthProvider';
import type { AuthUserRoleType } from '@/lib/types/auth-context';
import React, { useMemo } from 'react';
import { RestrictedAccess } from './dashboard/RestrictedAccess';
import { AuthPerm } from '@/lib/auth/perm';

type BasePropType = Record<string, any> & {
  children?: React.ReactNode;
};
type ProtectProps = {
  role: AuthUserRoleType;
  Component: React.ComponentType<BasePropType>;
  props?: BasePropType;
};
export default function Protect({ role, Component, props = {} }: ProtectProps) {
  const { state, isAuthenticated } = useAuth();
  const perm = AuthPerm.getInstance();
  const userHasAccess = useMemo(() => {
    return (
      isAuthenticated &&
      state.userRole &&
      perm.hasPermission(role, state.userRole)
    );
  }, [role, isAuthenticated, state.userRole]);
  return (
    <div>
      {isAuthenticated && userHasAccess ? (
        <Component {...props} />
      ) : (
        <RestrictedAccess />
      )}
    </div>
  );
}
