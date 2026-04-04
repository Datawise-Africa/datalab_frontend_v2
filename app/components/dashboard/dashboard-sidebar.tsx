import { Link, useLocation } from 'react-router';
import {
  Bookmark,
  Download,
  Settings,
  LayoutDashboard,
  BarChart3,
  FileText,
  Upload,
  Users,
  UserCheck,
  UserPlus,
  Stethoscope,
  BookOpen,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { useAppSelector } from '~/store';
import { AuthPerm } from '~/lib/utils/perm';

interface SidebarLink {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

function useDashboardSections(): SidebarSection[] {
  const user = useAppSelector((s) => s.auth.user);
  if (!user) return [];

  const perm = AuthPerm.getInstance();
  const isCreator = perm.hasPermission('creator', user.user_role);
  const isAdmin = perm.hasPermission('admin', user.user_role);

  const sections: SidebarSection[] = [];

  // All users
  sections.push({
    title: 'My Account',
    links: [
      { label: 'Saved Datasets', to: '/app/saved-datasets', icon: Bookmark },
      { label: 'My Downloads', to: '/app/my-downloads', icon: Download },
      {
        label: 'Account Settings',
        to: '/app/account-settings',
        icon: Settings,
      },
    ],
  });

  // Dashboards section for all users
  sections.push({
    title: 'Dashboards',
    links: [
      { label: 'AfyaKen', to: '/dashboards/afyaken', icon: Stethoscope },
      { label: 'EduKen', to: '/dashboards/eduken', icon: BookOpen },
    ],
  });

  // Only show "Become a Creator" for regular users
  if (!isCreator && !isAdmin) {
    sections[0].links.push({
      label: 'Become a Creator',
      to: '/app/become-dataset-creator',
      icon: UserPlus,
    });
  }

  // Dataset creators
  if (isCreator) {
    sections.push({
      title: 'Creator',
      links: [
        {
          label: 'Dashboard',
          to: '/app/creator-dashboard',
          icon: LayoutDashboard,
        },
        { label: 'Upload Dataset', to: '/app/upload-dataset', icon: Upload },
        { label: 'Analytics', to: '/app/creator-analytics', icon: BarChart3 },
        { label: 'Reports', to: '/app/creator-reports', icon: FileText },
      ],
    });
  }

  // Admins
  if (isAdmin) {
    sections.push({
      title: 'Admin',
      links: [
        { label: 'Applications', to: '/app/applications', icon: Users },
        {
          label: 'Approved Creators',
          to: '/app/approved-creators',
          icon: UserCheck,
        },
      ],
    });
  }

  return sections;
}

export function DashboardSidebar({ className }: { className?: string }) {
  const sections = useDashboardSections();
  const location = useLocation();

  return (
    <aside className={cn('w-60 shrink-0', className)}>
      <nav className="sticky top-20 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/5 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
