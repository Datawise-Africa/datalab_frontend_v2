import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  Building2,
  Calendar,
  LayoutGrid,
  Loader2,
  Maximize2,
  Minimize2,
  User,
} from 'lucide-react';
import moment from 'moment';
import type { Route } from './+types/dashboard-detail';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { useDashboard } from '~/features/dashboards';
import { useTrackDashboardView } from '~/hooks/use-track-view';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta({ data }: Route.MetaArgs) {
  const title = data?.title ? `${data.title} | Dashboards` : 'Dashboard';
  return generateSEOTags({
    title,
    description:
      data?.description ?? 'Interactive analytics dashboard on Datalab.',
    noIndex: !data,
  });
}

export async function loader({ params }: Route.LoaderArgs) {
  // Pass the id through to the meta function. Actual fetching happens client-side
  // via TanStack Query so loaders/SSR can stay light.
  return {
    id: params.id,
    title: undefined as string | undefined,
    description: undefined as string | undefined,
  };
}

export default function DashboardDetail() {
  const { id } = useParams() as { id: string };
  const { data: dashboard, isLoading, isError } = useDashboard(id);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useTrackDashboardView(dashboard?.id);

  const enterFullscreen = () => {
    const el = frameRef.current?.parentElement;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          // browser-blocked or unsupported — no-op
        });
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {
          // no-op
        });
    } else {
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <LayoutGrid className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
        <h1 className="text-2xl font-semibold">Dashboard not found</h1>
        <p className="mt-2 text-muted-foreground">
          The dashboard you are looking for does not exist or is not public.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/dashboards">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to dashboards
          </Link>
        </Button>
      </div>
    );
  }

  const ownerName = dashboard.owner
    ? `${dashboard.owner.first_name ?? ''} ${dashboard.owner.last_name ?? ''}`.trim() ||
      dashboard.owner.email
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboards">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to dashboards
          </Link>
        </Button>
      </div>

      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            {dashboard.category?.name && (
              <Badge variant="secondary" className="text-[10px]">
                {dashboard.category.name}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {dashboard.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dashboard.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {dashboard.workspace?.name ? (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {dashboard.workspace.name}
              </span>
            ) : (
              ownerName && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {ownerName}
                </span>
              )
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Updated {moment(dashboard.updated_at).fromNow()}
            </span>
          </div>
        </div>

        {dashboard.dashboard_url && (
          <Button variant="outline" onClick={enterFullscreen}>
            <Maximize2 className="mr-1.5 h-4 w-4" />
            Fullscreen
          </Button>
        )}
      </header>

      <Separator className="mb-6" />

      {dashboard.dashboard_url ? (
        <div className="group relative overflow-hidden rounded-lg border bg-muted">
          <iframe
            ref={frameRef}
            src={dashboard.dashboard_url}
            title={dashboard.title}
            className="h-[70vh] w-full border-0"
            allow="fullscreen"
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            className="absolute right-3 top-3 h-8 w-8 opacity-0 shadow transition-opacity group-hover:opacity-100"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <LayoutGrid className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No embed URL provided for this dashboard.
          </p>
        </div>
      )}

      {dashboard.tags && dashboard.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {dashboard.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
