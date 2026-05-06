import { useState } from 'react';
import { useIsClient } from '~/hooks/use-is-client';
import { Link } from 'react-router';
import {
  Bookmark,
  ChevronDown,
  Database,
  Download,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
} from 'lucide-react';

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
import { useAppSelector, useAppDispatch } from '~/store';
import { useAppModal } from '~/store/slices/modal-slice';
import { toggleDarkMode } from '~/store/slices/theme-slice';
import { useLogout } from '~/features/auth';
import { AuthPerm } from '~/lib/utils/perm';

function ThemeToggle({ className }: { className?: string }) {
  const isClient = useIsClient();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.theme.darkMode);
  if (!isClient) {
    return <div className={className} aria-hidden />;
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch(toggleDarkMode())}
      className={className}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

const navLinks = [
  { label: 'Datasets', to: '/datasets' },
  { label: 'Reports', to: '/research/reports' },
  { label: 'Dashboards', to: '/dashboards' },
] as const;

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
        <Button
          size="sm"
          onClick={() => authModal.open({ initialTab: 'signup' })}
        >
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
      {/* {isCreator && (
        <Button asChild variant="outline" size="sm">
          <Link to="/app/creator-dashboard">Dashboard</Link>
        </Button>
      )} */}
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
            <Link to="/app/">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              My Lab
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/app/my-downloads">
              <Download className="mr-2 h-4 w-4" />
              My Downloads
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/app/bookmarks">
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmarks
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
          <Link to="/app/">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            My Lab
          </Link>
        </Button>
      </SheetClose>
      <SheetClose asChild>
        <Button asChild variant="outline" className="w-full">
          <Link to="/app/my-downloads">
            <Download className="mr-2 h-4 w-4" />
            My Downloads
          </Link>
        </Button>
      </SheetClose>
      <SheetClose asChild>
        <Button asChild variant="outline" className="w-full">
          <Link to="/app/bookmarks">
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarks
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">Data</span>
            <span className="text-foreground">Lab</span>
          </span>
        </Link>

        {/* Desktop Flat Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster: theme toggle + auth (desktop) */}
        <div className="flex items-center gap-1">
          <ThemeToggle className="hidden h-8 w-8 lg:inline-flex" />
          <DesktopAuthButtons />

          {/* Mobile theme toggle (always visible on mobile) */}
          <ThemeToggle className="h-8 w-8 lg:hidden" />

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
                {navLinks.map((link) => (
                  <SheetClose key={link.to} asChild>
                    <Link
                      to={link.to}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <MobileAuthSection />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
