import { Link } from 'react-router';
import { ArrowRight, BarChart3, ExternalLink, Eye, User } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { dashboards } from '~/data/dashboards';

const featuredDashboards = dashboards.filter((d) => d.isLive).slice(0, 4);

export function FeaturedDashboards() {
  if (featuredDashboards.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboards
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Interactive analytics dashboards powered by leading BI platforms.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Dashboards coming soon. Stay tuned for interactive analytics.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboards
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Interactive analytics dashboards powered by leading BI platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredDashboards.map((dashboard) => (
            <Card
              key={dashboard.slug}
              className="group flex h-full flex-col overflow-hidden py-0 transition-shadow hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div
                className={cn(
                  'relative flex h-40 items-center justify-center',
                  dashboard.thumbnailColor
                )}
              >
                <BarChart3 className="h-12 w-12 text-white/80" />
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-primary shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Live
                </span>
              </div>

              <CardHeader className="pb-2">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {dashboard.platform}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {dashboard.category}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1 text-base font-semibold">
                  {dashboard.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {dashboard.description}
                </p>
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {dashboard.author}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {dashboard.views.toLocaleString()}
                  </span>
                </div>
                <div className="pt-2">
                  {dashboard.internalRoute ? (
                    <Button asChild size="sm" className="w-full">
                      <Link to={dashboard.internalRoute}>
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="w-full">
                      <a
                        href={dashboard.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View Dashboard
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboards">
              View All Dashboards
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
