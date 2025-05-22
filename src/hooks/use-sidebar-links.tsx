import { useAuth } from '@/context/AuthProvider';
import {
  BarChart,
  Bookmark,
  Compass,
  Database,
  Download,
  Edit,
  LockIcon,
  MenuIcon,
  Paperclip,
  User2,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';

import { useMemo } from 'react';

export type SidebarLinkType = {
  label: string;
  icon?: string | LucideIcon;
  href: string;
  badge?: string;
  external?: boolean;
  requiredRole?: string;
  requiresAuth?: boolean;
  children?: SidebarLinkType[];
};
export default function useSidebarLinks() {
  const auth = useAuth();
  const links: SidebarLinkType[] = [
    {
      label: 'Menu',
      href: '#',
      icon: MenuIcon,
      children: [
        {
          label: 'Discover',
          icon: Compass,
          href: '/#',
        },
        { label: 'Saved Items', icon: Bookmark, href: '#' },
        {
          label: 'My Downloads',
          icon: Download,
          href: '#',
          badge: 'Pending',
        },
      ],
    },
    {
      label: 'Creator Tools',
      href: '#',
      icon: Edit,
      children: [
        {
          label: 'My Datasets',
          icon: Download,
          href: '#',
        },
        {
          label: 'Analytics',
          icon: BarChart,
          href: '#',
        },
        {
          label: 'My Reports',
          icon: Paperclip,
          href: '#',
        },
      ],
    },
    {
      label: 'Admin',
      href: '#',
      icon: LockIcon,
      // icon: <HeroiconsOutlineDocumentReport />,
      children: [
        {
          label: 'Applications',
          badge: '3',
          href: '#',
          icon: User2,
        },
        {
          label: 'Approved Creators',
          href: '#',
          icon: UserCheck,
        },
        {
          label: 'Approved Datasets',
          href: '#',
          icon: Database,
        },
      ],
    },
  ];

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      if (link.requiresAuth && !auth.isAuthenticated) {
        return false;
      }
      /**
       * TODO: Implement role-based access control
       */
      // if (link.requiredRole && !auth.state.userRole?.includes(link.requiredRole)) {
      //   return false;
      // }
      return true;
    });
  }, [auth.state]);
  return {
    links: filteredLinks,
  };
}
