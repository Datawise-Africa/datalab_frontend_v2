import { useMemo } from 'react';
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
} from 'lucide-react';
import type { SidebarLinkType } from '@/lib/types/sidebar';
import { validateSidebarLink } from '@/lib/utils/validate-sidebar-link';

export default function useSidebarLinks() {
  const sidebarLinks: SidebarLinkType[] = [
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
      requiresAuth: true,
      requiredRole: 'dataset_creator',
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
      requiresAuth: true,
      requiredRole: 'admin',
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
          requiresAuth: true,
          requiredRole: 'admin',
        },
      ],
    },
  ];
  const auth = useAuth();

  const filteredLinks = useMemo(() => {
    return sidebarLinks
      .map(validateSidebarLink(auth.isAuthenticated, auth.state.userRole))
      .filter((link): link is SidebarLinkType => link !== null);
  }, [auth.isAuthenticated, auth.state.userRole]);

  return {
    links: filteredLinks,
  };
}
