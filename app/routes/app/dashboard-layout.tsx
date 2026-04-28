import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import {
  Database,
  Home,
  Bookmark,
  Download,
  Settings,
  LayoutDashboard,
  LayoutGrid,
  BarChart3,
  FileText,
  Upload,
  Users,
  UserCheck,
  LogOut,
  Menu,
  ArrowLeft,
  Search,
  Sun,
  Moon,
  FolderKanban,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { Protect } from '~/components/auth/protect';
import { useAppSelector, useAppDispatch } from '~/store';
import { toggleDarkMode } from '~/store/slices/theme-slice';
import { AuthPerm } from '~/lib/utils/perm';
import { useLogout } from '~/features/auth';
import { useIsClient } from '~/hooks/use-is-client';
import { useMediaQuery } from '~/hooks/use-media-query';
import { NotificationBell } from '~/components/dashboard/notification-bell';
import { BecomeCreatorBanner } from '~/components/dashboard/become-creator-banner';
import { UserProfileMenu } from '~/components/dashboard/user-profile-menu';

interface SidebarLink {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

const WORKSPACE_PATH_PATTERN = /^\/app\/workspaces\/([^/]+)(?:\/|$)/;

function matchWorkspaceId(pathname: string): string | null {
  const match = pathname.match(WORKSPACE_PATH_PATTERN);
  if (!match) return null;
  const id = match[1];
  if (id === 'new' || !id) return null;
  return id;
}

function buildWorkspaceSections(workspaceId: string): SidebarSection[] {
  const base = `/app/workspaces/${workspaceId}`;
  return [
    {
      title: 'Workspace',
      links: [
        { label: 'Overview', to: base, icon: Home },
        { label: 'Members', to: `${base}/members`, icon: Users },
        { label: 'Datasets', to: `${base}/datasets`, icon: Database },
        { label: 'Dashboards', to: `${base}/dashboards`, icon: LayoutGrid },
        { label: 'Analytics', to: `${base}/analytics`, icon: BarChart3 },
        { label: 'Invitations', to: `${base}/invitations`, icon: Mail },
        { label: 'Settings', to: `${base}/settings`, icon: Settings },
      ],
    },
    {
      title: 'Back',
      links: [
        {
          label: 'All Workspaces',
          to: '/app/workspaces',
          icon: ArrowLeft,
        },
      ],
    },
  ];
}

function buildAppSections({
  isCreator,
  isAdmin,
}: {
  isCreator: boolean;
  isAdmin: boolean;
}): SidebarSection[] {
  const sections: SidebarSection[] = [];

  sections.push({
    title: 'General',
    links: [
      { label: 'Overview', to: '/app', icon: Home },
      { label: 'Bookmarks', to: '/app/bookmarks', icon: Bookmark },
      { label: 'My Downloads', to: '/app/my-downloads', icon: Download },
      { label: 'Invitations', to: '/app/invitations', icon: Mail },
      {
        label: 'Account Settings',
        to: '/app/account-settings',
        icon: Settings,
      },
    ],
  });

  if (isCreator) {
    sections.push({
      title: 'Creator',
      links: [
        {
          label: 'My Datasets',
          to: '/app/creator-dashboard',
          icon: LayoutDashboard,
        },
        { label: 'Upload Dataset', to: '/app/upload-dataset', icon: Upload },
        {
          label: 'My Dashboards',
          to: '/app/my-dashboards',
          icon: LayoutGrid,
        },
        { label: 'Analytics', to: '/app/analytics', icon: BarChart3 },
        { label: 'Reports', to: '/app/creator-reports', icon: FileText },
      ],
    });
  }

  sections.push({
    title: 'Workspaces',
    links: [
      {
        label: 'My Workspaces',
        to: '/app/workspaces',
        icon: FolderKanban,
      },
    ],
  });

  if (isAdmin) {
    sections.push({
      title: 'Admin',
      links: [
        { label: 'Overview', to: '/app/admin', icon: LayoutDashboard },
        { label: 'Applications', to: '/app/applications', icon: Users },
        {
          label: 'Approved Creators',
          to: '/app/approved-creators',
          icon: UserCheck,
        },
        {
          label: 'Dashboard Categories',
          to: '/app/dashboard-categories',
          icon: LayoutGrid,
        },
      ],
    });
  }

  return sections;
}

function useDashboardSections(): SidebarSection[] {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) return [];

  const workspaceId = matchWorkspaceId(location.pathname);
  if (workspaceId) return buildWorkspaceSections(workspaceId);

  const perm = AuthPerm.getInstance();
  return buildAppSections({
    isCreator: perm.hasPermission('creator', user.user_role),
    isAdmin: perm.hasPermission('admin', user.user_role),
  });
}

function SidebarContent({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const darkMode = useAppSelector((s) => s.theme.darkMode);
  const logout = useLogout();
  const sections = useDashboardSections();

  const perm = AuthPerm.getInstance();
  const canBecomeCreator =
    user &&
    !perm.hasPermission('creator', user.user_role) &&
    !perm.hasPermission('admin', user.user_role);
  const inWorkspaceContext = matchWorkspaceId(location.pathname) !== null;
  const showBecomeCreatorBanner =
    !collapsed && canBecomeCreator && !inWorkspaceContext;

  const isActive = (to: string) => {
    if (to === '/app') return location.pathname === '/app';
    // Workspace overview: /app/workspaces/:id must match exactly
    if (/^\/app\/workspaces\/[^/]+$/.test(to)) {
      return location.pathname === to;
    }
    // My Workspaces list: don't stay active when deep-linked into a workspace
    if (to === '/app/workspaces') {
      return (
        location.pathname === '/app/workspaces' ||
        location.pathname === '/app/workspaces/new'
      );
    }
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  const roleBadge =
    user?.user_role === 'admin'
      ? 'Admin'
      : user?.user_role === 'creator'
        ? 'Creator'
        : 'Member';

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          'flex h-14 items-center border-b border-border',
          collapsed ? 'justify-center px-2' : 'gap-2 px-4'
        )}
      >
        <Link to="/" className="flex items-center gap-2" onClick={onNavigate}>
          <Database className="h-5 w-5 text-primary shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight">
              <span className="text-primary">Data</span>
              <span className="text-foreground">Lab</span>
            </span>
          )}
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div
          className={cn(
            'border-b border-border',
            collapsed ? 'flex justify-center py-3' : 'px-4 py-3'
          )}
        >
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                {user.first_name} {user.last_name}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {user.first_name} {user.last_name}
                </p>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {roleBadge}
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto scrollbar-thin py-4 space-y-5',
          collapsed ? 'px-2' : 'px-3'
        )}
      >
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const active = isActive(link.to);
                const linkEl = (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center rounded-lg py-2 text-sm transition-colors',
                      collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                      active
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && link.label}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={link.to + link.label}>
                      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                      <TooltipContent side="right">{link.label}</TooltipContent>
                    </Tooltip>
                  );
                }

                return linkEl;
              })}
            </div>
          </div>
        ))}
      </nav>

      {showBecomeCreatorBanner && (
        <BecomeCreatorBanner onNavigate={onNavigate} />
      )}

      {/* Bottom actions */}
      <div
        className={cn(
          'border-t border-border py-3 space-y-1',
          collapsed ? 'px-2' : 'px-3'
        )}
      >
        {collapsed ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => dispatch(toggleDarkMode())}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  onClick={onNavigate}
                  className="flex items-center justify-center rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Back to site</TooltipContent>
            </Tooltip>
            <Separator className="my-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    logout.mutate();
                    onNavigate?.();
                  }}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign out</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => dispatch(toggleDarkMode())}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 shrink-0" />
              ) : (
                <Moon className="h-4 w-4 shrink-0" />
              )}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link
              to="/"
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back to site
            </Link>
            <Separator className="my-1" />
            <button
              type="button"
              onClick={() => {
                logout.mutate();
                onNavigate?.();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={() => {
        // Dispatch Ctrl+K event to open command palette
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'k', metaKey: true })
          );
        }
      }}
      className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline">
        Ctrl+K
      </kbd>
    </button>
  );
}

export const meta = () => [{ name: 'robots', content: 'noindex, nofollow' }];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const isClient = useIsClient();
  const isLg = useMediaQuery('(min-width: 1024px)');

  // Force collapsed at md (768-1023); respect user toggle at lg+.
  const collapsed = !isLg || userCollapsed;

  return (
    <Protect>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Desktop sidebar (md+) */}
          <aside
            className={cn(
              'hidden shrink-0 border-r border-border bg-card transition-[width] duration-200 md:block relative',
              collapsed ? 'w-16' : 'w-64'
            )}
          >
            <SidebarContent collapsed={collapsed} />
            {/* Collapse toggle — only on lg+ where expand makes sense */}
            <button
              type="button"
              onClick={() => setUserCollapsed(!userCollapsed)}
              className="absolute -right-3 top-[4.25rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:flex"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-3.5 w-3.5" />
              ) : (
                <PanelLeftClose className="h-3.5 w-3.5" />
              )}
            </button>
          </aside>

          {/* Main area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top bar */}
            <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
              {/* Mobile menu trigger */}
              {isClient && (
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden h-8 w-8"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <SidebarContent onNavigate={() => setMobileOpen(false)} />
                  </SheetContent>
                </Sheet>
              )}

              {/* Search trigger */}
              <SearchTrigger />

              <div className="flex-1" />

              {/* Notifications */}
              <NotificationBell />

              {/* Profile menu */}
              <UserProfileMenu />
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </Protect>
  );
}
