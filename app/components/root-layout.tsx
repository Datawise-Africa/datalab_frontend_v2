import { Outlet, Link, useLocation } from 'react-router';
import { Home, FolderOpen, Package, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './error-boundary';
import { LoadingIndicator } from './loading-indicator';
import { Button } from './ui/button';
import { useState } from 'react';
import { ThemeEditor } from './theme-editor';

export default function RootLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/categories', label: 'Categories', icon: FolderOpen },
    { to: '/products', label: 'Products', icon: Package },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <LoadingIndicator />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/datawise-logo-dark.png"
                alt="Datawise Africa"
                className="h-8 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = link.exact
                  ? location.pathname === link.to
                  : isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <Button size="sm" asChild>
                <Link to="/products/new">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-down">
            <div className="container mx-auto px-6 py-4 space-y-1">
              {navLinks.map((link) => {
                const active = link.exact
                  ? location.pathname === link.to
                  : isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex px-4 py-3 rounded-md text-sm font-medium transition-colors items-center gap-3 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border flex items-center justify-end">
                <Button size="sm" asChild>
                  <Link
                    to="/products/new"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 mt-auto">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <img
                src="/assets/datawise-logo-dark.png"
                alt="Datawise Africa"
                className="h-8 w-auto mb-4 brightness-200"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                Building intelligent solutions for Africa&apos;s digital future.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-gray-100 font-semibold mb-4 text-sm uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/products"
                    className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-gray-100 font-semibold mb-4 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm text-gray-400">About Us</span>
                </li>
                <li>
                  <span className="text-sm text-gray-400">Careers</span>
                </li>
                <li>
                  <span className="text-sm text-gray-400">Contact</span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-gray-100 font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm text-gray-400">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-sm text-gray-400">
                    Terms of Service
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Datawise Africa. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <span className="text-sm text-gray-500">
                Built with React & Tailwind
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Theme Editor */}
      <ThemeEditor />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
