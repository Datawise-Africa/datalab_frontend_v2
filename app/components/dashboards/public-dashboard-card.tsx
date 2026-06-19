import { Link } from 'react-router';
import moment from 'moment';
import {
  ArrowRight,
  Building2,
  Calendar,
  LayoutGrid,
  Star,
  User,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import type { Dashboard } from '~/lib/types/dashboard';

interface Props {
  dashboard: Dashboard;
}

export function PublicDashboardCard({ dashboard }: Readonly<Props>) {
  const thumbnailUrl = resolveMediaUrl(dashboard.thumbnail);
  const tags = dashboard.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - visibleTags.length;

  const rating = Number(dashboard.average_rating ?? 0);
  const reviewCount = Number(dashboard.total_reviews ?? 0);
  const ownerName = dashboard.owner
    ? `${dashboard.owner.first_name ?? ''} ${dashboard.owner.last_name ?? ''}`.trim() ||
      dashboard.owner.email
    : null;
  const bylineName = dashboard.workspace?.name ?? ownerName;
  const BylineIcon = dashboard.workspace?.name ? Building2 : User;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link
        to={`/dashboards/${dashboard.id}`}
        className="block aspect-video overflow-hidden bg-muted"
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
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
        <div className="flex items-center justify-between gap-2">
          {dashboard.category?.name ? (
            <Badge variant="secondary" className="text-[10px]">
              {dashboard.category.name}
            </Badge>
          ) : (
            <span />
          )}
          {reviewCount > 0 && (
            <span className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            </span>
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {bylineName && (
            <span className="flex items-center gap-1 truncate">
              <BylineIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{bylineName}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            Updated {moment(dashboard.updated_at).fromNow()}
          </span>
        </div>
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
