import { Link } from 'react-router';
import moment from 'moment';
import {
  ArrowRight,
  Pencil,
  Trash2,
  LayoutGrid,
  MoreVertical,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import type { Dashboard, DashboardStatus } from '~/lib/types/dashboard';

interface Props {
  dashboard: Dashboard;
  detailHref: string;
  editHref: string;
  onDelete: () => void;
  isDeleting?: boolean;
}

const statusLabel: Record<DashboardStatus, string> = {
  PB: 'Published',
  DF: 'Draft',
  AR: 'Archived',
};

const statusVariant: Record<
  DashboardStatus,
  'default' | 'secondary' | 'outline'
> = {
  PB: 'default',
  DF: 'secondary',
  AR: 'outline',
};

export function DashboardCard({
  dashboard,
  detailHref,
  editHref,
  onDelete,
  isDeleting,
}: Readonly<Props>) {
  return (
    <Card className="relative flex flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {dashboard.thumbnail ? (
          <img
            src={resolveMediaUrl(dashboard.thumbnail) ?? undefined}
            alt={dashboard.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <LayoutGrid className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {/* Status + visibility over thumbnail */}
        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          <Badge
            variant={statusVariant[dashboard.status]}
            className="text-[10px]"
          >
            {statusLabel[dashboard.status]}
          </Badge>
          {dashboard.is_public && (
            <Badge
              variant="outline"
              className="bg-background/80 text-[10px] backdrop-blur"
            >
              Public
            </Badge>
          )}
        </div>

        {/* Actions menu */}
        <div className="absolute right-2 top-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 bg-background/80 backdrop-blur"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link to={editHref} className="cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={onDelete}
                disabled={isDeleting}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body */}
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1 space-y-1.5">
          <h3 className="line-clamp-1 text-base font-semibold leading-snug">
            {dashboard.title}
          </h3>
          {dashboard.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {dashboard.description}
            </p>
          )}
        </div>

        {dashboard.tags && dashboard.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dashboard.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-normal"
              >
                {tag}
              </Badge>
            ))}
            {dashboard.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{dashboard.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span>
            {dashboard.category?.name ??
              dashboard.workspace?.name ??
              'Personal'}
          </span>
          <span>{moment(dashboard.updated_at).fromNow()}</span>
        </div>

        {/* Primary CTA */}
        <Button asChild size="sm" className="mt-2 w-full">
          <Link to={detailHref}>
            View details
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
