import { useState, useRef, useEffect, useCallback } from 'react';
import { useIsClient } from '~/hooks/use-is-client';
import { Link } from 'react-router';
import {
  Database,
  Menu,
  ChevronDown,
  Search,
  Code,
  BookOpen,
  FileText,
  Users,
  Building2,
  Trophy,
  Phone,
  BarChart3,
  Upload,
  Layers,
  Microscope,
  LayoutDashboard,
  User,
  LogOut,
} from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useAppSelector } from '~/store';
import { useAppModal } from '~/store/slices/modal-slice';
import { useLogout } from '~/features/auth';
import { AuthPerm } from '~/lib/utils/perm';

interface MegaMenuItem {
  label: string;
  to: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MegaMenuSection {
  label: string;
  items: MegaMenuItem[];
  featured?: {
    label: string;
    description: string;
    to: string;
    bgClass: string;
  };
}

const megaMenuSections: MegaMenuSection[] = [
  {
    label: 'Datasets',
    items: [
      {
        label: 'Browse Datasets',
        to: '/datasets',
        description: 'Explore our curated catalog of high-quality datasets',
        icon: Search,
      },
      {
        label: 'Become a Creator',
        to: '/creators',
        description: 'Publish your datasets and reach thousands of developers',
        icon: Upload,
      },
      {
        label: 'Categories',
        to: '/datasets',
        description: 'Health, Finance, Climate, NLP, Computer Vision and more',
        icon: Layers,
      },
    ],
    featured: {
      label: 'New: Dataset Creator Program',
      description:
        'Monetize your data. Join our creator program and publish datasets to the Data Lab marketplace.',
      to: '/creators',
      bgClass: 'bg-primary/5',
    },
  },
  {
    label: 'Developers',
    items: [
      {
        label: 'Workspace',
        to: '/workspace',
        description: 'Write and run Python scripts against live datasets',
        icon: Code,
      },
      {
        label: 'API Documentation',
        to: '/docs',
        description: 'REST API reference, authentication, and endpoints',
        icon: FileText,
      },
      {
        label: 'SDKs & Libraries',
        to: '/docs',
        description: 'Python, JavaScript, and R client libraries',
        icon: Layers,
      },
    ],
    featured: {
      label: 'New: Developer Workspace',
      description:
        'Run Python scripts directly in your browser against Data Lab datasets. No setup required.',
      to: '/workspace',
      bgClass: 'bg-blue-50',
    },
  },
  {
    label: 'Research',
    items: [
      {
        label: 'Research Lab',
        to: '/research',
        description: 'Active projects and collaborations',
        icon: Microscope,
      },
      {
        label: 'Reports & Papers',
        to: '/research/reports',
        description: 'Published findings and technical papers',
        icon: BookOpen,
      },
      {
        label: 'Dashboards',
        to: '/dashboards',
        description: 'Interactive analytics and Power BI publications',
        icon: LayoutDashboard,
      },
    ],
    featured: {
      label: 'Live Dashboards',
      description:
        'Explore interactive analytics dashboards powered by Power BI and other platforms.',
      to: '/dashboards',
      bgClass: 'bg-purple-50',
    },
  },
  {
    label: 'Company',
    items: [
      {
        label: 'About Us',
        to: '/about',
        description: 'Our mission, vision, and story',
        icon: Building2,
      },
      {
        label: 'Team',
        to: '/team',
        description: 'Meet the people behind Data Lab',
        icon: Users,
      },
      {
        label: 'Success Stories',
        to: '/success-stories',
        description: 'How teams build with Data Lab',
        icon: Trophy,
      },
      {
        label: 'Contact',
        to: '/contact',
        description: 'Get in touch with our team',
        icon: Phone,
      },
    ],
  },
];

const allMobileLinks = megaMenuSections.flatMap((section) =>
  section.items.map((item) => ({
    label: item.label,
    to: item.to,
    section: section.label,
    icon: item.icon,
  }))
);

function MegaMenuDropdown({
  section,
  isOpen,
  onClose,
}: {
  section: MegaMenuSection;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        'absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200',
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0'
      )}
    >
      <div className="w-[680px] overflow-hidden rounded-xl border bg-white shadow-xl">
        <div className="flex">
          {/* Links column */}
          <div className="flex-1 p-4">
            <div className="grid gap-1">
              {section.items.map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  onClick={onClose}
                  className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-primary/5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                    <item.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary">
                      {item.label}
                    </div>
                    <div className="text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured column */}
          {section.featured && (
            <div className="w-56 border-l">
              <Link
                to={section.featured.to}
                onClick={onClose}
                className={cn(
                  'flex h-full flex-col justify-between p-5 transition-opacity hover:opacity-90',
                  section.featured.bgClass
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {section.featured.label}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {section.featured.description}
                  </p>
                </div>
                <span className="mt-4 text-xs font-medium text-primary">
                  Learn more &rarr;
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DesktopAuthButtons() {
  const isClient = useIsClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const authModal = useAppModal('auth');
  const logout = useLogout();

  // Render nothing on server to avoid hydration mismatch — auth state differs
  if (!isClient) {
    return <div className="hidden items-center gap-3 lg:flex" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="hidden items-center gap-3 lg:flex">
        <Button variant="outline" size="sm" onClick={() => authModal.open()}>
          Sign in
        </Button>
        <Button size="sm" onClick={() => authModal.open()}>
          Get Started
        </Button>
      </div>
    );
  }

  const perm = AuthPerm.getInstance();
  const isCreator = perm.hasPermission('creator', user.user_role);
  const isAdmin = perm.hasPermission('admin', user.user_role);
  const showBecomeCreator = !isCreator && !isAdmin;

  return (
    <div className="hidden items-center gap-3 lg:flex">
      {showBecomeCreator && (
        <Button asChild variant="outline" size="sm">
          <Link to="/creators#apply-form">Become a Creator</Link>
        </Button>
      )}
      {isCreator && (
        <Button asChild variant="outline" size="sm">
          <Link to="/app/creator-dashboard">Dashboard</Link>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="max-w-30 truncate">{user.first_name}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/app/saved-datasets">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout.mutate()}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileCollapsibleSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && <div className="ml-2 flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}

function MobileAuthSection() {
  const isClient = useIsClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const authModal = useAppModal('auth');
  const logout = useLogout();

  if (!isClient) return null;

  if (!isAuthenticated) {
    return (
      <div className="mt-6 flex flex-col gap-2 border-t px-3 pt-6">
        <SheetClose asChild>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => authModal.open()}
          >
            Sign in
          </Button>
        </SheetClose>
      </div>
    );
  }

  const perm = AuthPerm.getInstance();
  const isCreatorOrAdmin =
    user &&
    (perm.hasPermission('creator', user.user_role) ||
      perm.hasPermission('admin', user.user_role));

  return (
    <div className="mt-6 flex flex-col gap-2 border-t px-3 pt-6">
      {user && (
        <p className="mb-1 px-1 text-xs text-muted-foreground truncate">
          Signed in as{' '}
          <span className="font-medium text-foreground">{user.email}</span>
        </p>
      )}
      <SheetClose asChild>
        <Button asChild variant="outline" className="w-full">
          <Link to="/app/saved-datasets">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </SheetClose>
      {!isCreatorOrAdmin && (
        <SheetClose asChild>
          <Button asChild variant="outline" className="w-full">
            <Link to="/creators#apply-form">Become a Creator</Link>
          </Button>
        </SheetClose>
      )}
      <SheetClose asChild>
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => logout.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </SheetClose>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const handleOpen = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
  }, []);

  const handleImmediateClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">Data</span>
            <span className="text-foreground">Lab</span>
          </span>
        </Link>

        {/* Desktop Mega Menu Navigation */}
        <nav ref={navRef} className="hidden items-center gap-0.5 lg:flex">
          {megaMenuSections.map((section) => (
            <div
              key={section.label}
              className="relative"
              onMouseEnter={() => handleOpen(section.label)}
              onMouseLeave={handleClose}
            >
              <button
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  openMenu === section.label
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
                onClick={() =>
                  setOpenMenu(openMenu === section.label ? null : section.label)
                }
              >
                {section.label}
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    openMenu === section.label && 'rotate-180'
                  )}
                />
              </button>

              <MegaMenuDropdown
                section={section}
                isOpen={openMenu === section.label}
                onClose={handleImmediateClose}
              />
            </div>
          ))}

          {/* Direct Workspace link — always visible */}
          <Link
            to="/workspace"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Code className="h-3.5 w-3.5" />
            Workspace
          </Link>
        </nav>

        {/* Desktop CTA */}
        <DesktopAuthButtons />

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <span>
                  <span className="text-primary">Data</span>
                  <span className="text-foreground">Lab</span>
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-4 flex flex-col gap-1 px-1">
              {megaMenuSections.map((section) => (
                <MobileCollapsibleSection
                  key={section.label}
                  label={section.label}
                >
                  {section.items.map((item) => (
                    <SheetClose key={item.to + item.label} asChild>
                      <Link
                        to={item.to}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/5 hover:text-primary"
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SheetClose>
                  ))}
                </MobileCollapsibleSection>
              ))}

              {/* Direct links */}
              <SheetClose asChild>
                <Link
                  to="/workspace"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <Code className="h-4 w-4 text-muted-foreground" />
                  Workspace
                </Link>
              </SheetClose>
            </nav>

            <MobileAuthSection />
          </SheetContent>
        </Sheet>
      </div>

      {/* Backdrop overlay when mega menu is open */}
      {openMenu && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/5 backdrop-blur-[1px]"
          onClick={handleImmediateClose}
        />
      )}
    </header>
  );
}
