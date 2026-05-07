import { Link } from 'react-router';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import type { Dashboard } from '~/lib/types/dashboard';

interface Props {
  dashboard: Dashboard;
}

export function PublicDashboardCard({ dashboard }: Readonly<Props>) {
  const tags = dashboard.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - visibleTags.length;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link
        to={`/dashboards/${dashboard.id}`}
        className="block aspect-video overflow-hidden bg-muted"
      >
        {dashboard.thumbnail ? (
          <img
            src={dashboard.thumbnail}
            alt={dashboard.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
            <LayoutGrid className="h-10 w-10 text-primary/40" />
          </div>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-3">
        <div className="flex items-center gap-1.5">
          {dashboard.category?.name && (
            <Badge variant="secondary" className="text-[10px]">
              {dashboard.category.name}
            </Badge>
          )}
        </div>
        <Link to={`/dashboards/${dashboard.id}`} className="block">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight group-hover:text-primary">
            {dashboard.title}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {dashboard.description}
        </p>
        {visibleTags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {extraTagCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                +{extraTagCount}
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-5 py-3">
        <Link
          to={`/dashboards/${dashboard.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open dashboard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
