import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useIsClient } from '~/hooks/use-is-client';
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
  Menu,
  Stethoscope,
  BookOpen,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '~/components/ui/sheet';
import { cn } from '~/lib/utils';
import { useAppSelector } from '~/store';
import { AuthPerm } from '~/lib/utils/perm';

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();

  if (!isClient || !user) return null;

  const perm = AuthPerm.getInstance();
  const isCreator = perm.hasPermission('dataset_creator', user.user_role);
  const isAdmin = perm.hasPermission('admin', user.user_role);

  const sections = [
    {
      title: 'My Account',
      links: [
        { label: 'Saved Datasets', to: '/app/saved-datasets', icon: Bookmark },
        { label: 'My Downloads', to: '/app/my-downloads', icon: Download },
        {
          label: 'Account Settings',
          to: '/app/account-settings',
          icon: Settings,
        },
        ...(!isCreator && !isAdmin
          ? [
              {
                label: 'Become a Creator',
                to: '/app/become-dataset-creator',
                icon: UserPlus,
              },
            ]
          : []),
      ],
    },
    {
      title: 'Dashboards',
      links: [
        { label: 'AfyaKen', to: '/dashboards/afyaken', icon: Stethoscope },
        { label: 'EduKen', to: '/dashboards/eduken', icon: BookOpen },
      ],
    },
    ...(isCreator
      ? [
          {
            title: 'Creator',
            links: [
              {
                label: 'Dashboard',
                to: '/app/creator-dashboard',
                icon: LayoutDashboard,
              },
              {
                label: 'Upload Dataset',
                to: '/app/upload-dataset',
                icon: Upload,
              },
              {
                label: 'Analytics',
                to: '/app/creator-analytics',
                icon: BarChart3,
              },
              { label: 'Reports', to: '/app/creator-reports', icon: FileText },
            ],
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: 'Admin',
            links: [
              { label: 'Applications', to: '/app/applications', icon: Users },
              {
                label: 'Approved Creators',
                to: '/app/approved-creators',
                icon: UserCheck,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Menu className="mr-1.5 h-4 w-4" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Dashboard</SheetTitle>
        </SheetHeader>

        <nav className="mt-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <SheetClose key={link.to + link.label} asChild>
                      <Link
                        to={link.to}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                          isActive
                            ? 'bg-primary/5 font-medium text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <link.icon className="h-4 w-4 shrink-0" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
