import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import {
  Database,
  FileQuestion,
  AlertTriangle,
  ServerCrash,
  Home,
  ArrowLeft,
  Search,
  RefreshCw,
} from 'lucide-react';

import type { Route } from './+types/root';
import './app.css';
import { loadGTagScripts } from './lib/utils/add-google-tag';
import { QueryProvider } from './lib/providers/query-provider';
import { StoreProvider } from './lib/providers/store-provider';
import { env } from './lib/env';
import Navbar from '~/components/layout/navbar';
import Footer from '~/components/layout/footer';
import { Button } from '~/components/ui/button';
import { AuthModal } from '~/components/auth/auth-modal';
import { DownloadModal } from '~/components/download-flow/download-modal';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const GTAG = env.VITE_GTAG_ID;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {GTAG && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GTAG}`}
            ></script>
            <script dangerouslySetInnerHTML={loadGTagScripts(GTAG)}></script>
          </>
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <QueryProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <AuthModal />
        <DownloadModal />
      </QueryProvider>
    </StoreProvider>
  );
}

function NotFoundError() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10/60 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mb-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/5 ring-1 ring-primary/20">
          <FileQuestion className="h-14 w-14 text-primary" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-primary/20">
          <Search className="h-5 w-5 text-primary" />
        </div>
      </div>

      <h1 className="mb-2 text-8xl font-extrabold tracking-tight text-primary sm:text-9xl">
        404
      </h1>

      <h2 className="mb-3 text-2xl font-semibold text-foreground sm:text-3xl">
        Page not found
      </h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved, deleted, or perhaps the URL was mistyped.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/datasets">
            <Database className="h-4 w-4" />
            Browse Datasets
          </Link>
        </Button>
      </div>

      <div className="mt-12 rounded-xl border bg-card p-6 shadow-sm">
        <p className="mb-4 text-sm font-medium text-foreground">
          Here are some helpful links:
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            to="/datasets"
            className="text-primary underline-offset-4 hover:underline"
          >
            Datasets
          </Link>
          <Link
            to="/docs"
            className="text-primary underline-offset-4 hover:underline"
          >
            API Docs
          </Link>
          <Link
            to="/research"
            className="text-primary underline-offset-4 hover:underline"
          >
            Research
          </Link>
          <Link
            to="/contact"
            className="text-primary underline-offset-4 hover:underline"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServerError({
  status,
  statusText,
}: {
  status: number;
  statusText: string;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-red-50/60 blur-3xl" />
        <div className="absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-orange-50/40 blur-3xl" />
      </div>

      <div className="relative mb-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-200">
          <ServerCrash className="h-14 w-14 text-red-500" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-red-200">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
      </div>

      <h1 className="mb-2 text-8xl font-extrabold tracking-tight text-red-500 sm:text-9xl">
        {status}
      </h1>

      <h2 className="mb-3 text-2xl font-semibold text-foreground sm:text-3xl">
        {statusText || 'Something went wrong'}
      </h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        We encountered a server error while processing your request. Our team
        has been notified and is working on a fix.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

function UnexpectedError({
  message,
  stack,
}: {
  message: string;
  stack?: string;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-50/60 blur-3xl" />
      </div>

      <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
        <AlertTriangle className="h-14 w-14 text-amber-500" strokeWidth={1.5} />
      </div>

      <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
        Unexpected Error
      </h1>
      <p className="mb-8 max-w-md text-muted-foreground">{message}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={() => window.location.reload()}
          className="bg-amber-500 hover:bg-amber-600"
        >
          <RefreshCw className="h-4 w-4" />
          Reload Page
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>

      {stack && (
        <div className="mt-10 w-full max-w-3xl text-left">
          <details className="group rounded-xl border border-amber-200 bg-amber-50/50">
            <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-amber-800 select-none hover:bg-amber-50">
              Stack Trace (dev only)
            </summary>
            <div className="border-t border-amber-200 bg-slate-950 p-4 rounded-b-xl">
              <pre className="overflow-x-auto text-xs leading-relaxed text-primary">
                <code>{stack}</code>
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundError />;
    }
    return (
      <ServerError
        status={error.status}
        statusText={error.statusText || 'Server Error'}
      />
    );
  }

  let message = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return <UnexpectedError message={message} stack={stack} />;
}
