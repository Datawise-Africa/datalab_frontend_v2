import { useMemo } from 'react';
import {
  BarChart,
  Book,
  Bookmark,
  Compass,
  Download,
  Edit,
  LayoutDashboardIcon,
  LockIcon,
  MenuIcon,
  // MenuIcon,
  Paperclip,
  Stethoscope,
  User2,
  UserCheck,
} from 'lucide-react';
import type { SidebarLinkType } from '@/lib/types/sidebar';
import { validateSidebarLink } from '@/lib/utils/validate-sidebar-link';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth-store';

export default function useSidebarLinks() {
  const auth = useAuth();
  const pathName = useLocation().pathname;
  const recursivelyMakeLinksActive = function (pathName: string) {
    return (link: SidebarLinkType): SidebarLinkType => {
      const isActive =
        link.href === pathName ||
        (link.children &&
          link.children.some((child) => child.href === pathName)) ||
        false;
      return {
        ...link,
        isActive,
        children: link.children
          ? link.children.map(recursivelyMakeLinksActive(pathName))
          : undefined,
      };
    };
  };
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
          {
            label: 'My Downloads',
            icon: Download,

            href: '/app/my-downloads',
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
            href: '/app/dataset-creator-dashboard/?tab=my_datasets',
          },
          {
            label: 'Analytics',
            icon: BarChart,
            href: '/app/dataset-creator-analytics',
          },
          {
            label: 'My Reports',
            icon: Paperclip,
            href: '/app/dataset-creator-reports',
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
            href: '/app/approved-creators',
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
       {
        label: 'Dashboards',
        href: '#',
        icon: LayoutDashboardIcon,
        requiresAuth: false,
       requiredRole: 'user',

        // icon: <HeroiconsOutlineDocumentReport />,
        children: [
          {
            label: 'Afyaken',
            badge: '3',
            href: '/dashboards/afyaken',
            icon: Stethoscope,
          },
          {
            label: 'Eduken',
            href: '/dashboards/eduken',
            icon: Book,
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
      .map(validateSidebarLink(auth.is_authenticated, auth.user?.user_role!))
      .filter((link): link is SidebarLinkType => link !== null)
      .map(recursivelyMakeLinksActive(pathName));
  }, [auth.is_authenticated, auth.user?.user_role, pathName]);

  return {
    links: filteredLinks,
  };
}
