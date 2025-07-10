import type { LucideIcon } from 'lucide-react';
import type { AuthUserRoleType } from './auth-context';

export type SidebarLinkType = {
  label: string;
  icon?: string | LucideIcon;
  href: string;
  badge?: string;
  external?: boolean;
  requiredRole?: AuthUserRoleType;
  requiresAuth?: boolean;
  children?: SidebarLinkType[];
  isActive?: boolean; // Optional property to indicate if the link is active
};
