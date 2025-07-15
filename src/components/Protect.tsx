import type { AuthUserRoleType } from '@/lib/types/auth-context';
import React, { useMemo } from 'react';
import { RestrictedAccess } from './dashboard/RestrictedAccess';
import { AuthPerm } from '@/lib/auth/perm';
import { useAuth } from '@/store/auth-store';

type BasePropType = Record<string, any> & {
  children?: React.ReactNode;
};
type ProtectProps = {
  role: AuthUserRoleType;
  Component: React.ComponentType<BasePropType>;
  props?: BasePropType;
};
export default function Protect({ role, Component, props = {} }: ProtectProps) {
  const { is_authenticated ,user} = useAuth();
  const perm = AuthPerm.getInstance();
  const userHasAccess = useMemo(() => {
    return (
      is_authenticated &&
      user?.user_role &&
      perm.hasPermission(role, user.user_role)
    );
  }, [role, is_authenticated, user?.user_role]);
  return (
    <div>
      {is_authenticated && userHasAccess ? (
        <Component {...props} />
      ) : (
        <RestrictedAccess />
      )}
    </div>
  );
}
