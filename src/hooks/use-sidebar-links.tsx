import { useMemo } from 'react';
import { useAuth } from '@/context/AuthProvider';
import {
  BarChart,
  Bookmark,
  Compass,
  Download,
  Edit,
  LockIcon,
  MenuIcon,
  // MenuIcon,
  Paperclip,
  User2,
  UserCheck,
} from 'lucide-react';
import type { SidebarLinkType } from '@/lib/types/sidebar';
import { validateSidebarLink } from '@/lib/utils/validate-sidebar-link';

export default function useSidebarLinks() {
  const auth = useAuth();

  const filteredLinks = useMemo(() => {
    const sidebarLinks: SidebarLinkType[] = [
      {
        href: '/#',
        icon: MenuIcon,
        label: 'Menu',
        children: [
          {
            label: 'Discover',
            icon: Compass,

            href: '/#',
          },
          {
            label: 'Saved Items',
            icon: Bookmark,
            href: '/app/saved-datasets',
          },
          // {
          //   label: 'My Downloads',
          //   icon: Download,

          //   href: '#',
          //   badge: 'Pending',
          // },

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
            href: '/app/dataset-creator-dashboard/?tab=my_datasets',
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
            href: '/app/applications',
            icon: User2,
          },
          {
            label: 'Approved Creators',
            href: '/app/applications/approvedcreators',
            icon: UserCheck,
          },
          // {
          //   label: 'Approved Datasets',
          //   href: '/',
          //   icon: Database,
          //   requiresAuth: true,
          //   requiredRole: 'admin',
          // },
        ],
      },
    ];
    return sidebarLinks
      .map(validateSidebarLink(auth.isAuthenticated, auth.state.userRole))
      .filter((link): link is SidebarLinkType => link !== null);
  }, [auth.isAuthenticated, auth.state.userRole]);

  return {
    links: filteredLinks,
  };
}
