import { Link } from 'react-router';
import {
  Bookmark,
  Building2,
  Download,
  Loader2,
  Lock,
  User,
} from 'lucide-react';
import { ReportDefaultIllustration } from '~/components/illustrations/report-default';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { useReportBookmark } from '~/features/reports';
import { getWorkspaceName } from '~/features/my-datasets/types';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import { cn } from '~/lib/utils';
import { useAppSelector } from '~/store';
import type { Report } from '~/lib/types/report';

const reportTypeLabels: Record<string, string> = {
  research_paper: 'Research Paper',
  market_report: 'Market Report',
  climate_assessment: 'Climate Assessment',
  policy_brief: 'Policy Brief',
  technical_report: 'Technical Report',
  white_paper: 'White Paper',
  other: 'Report',
};

interface ReportCardProps {
  report: Report;
  className?: string;
}

export function ReportCard({ report, className }: Readonly<ReportCardProps>) {
  const cover = resolveMediaUrl(report.cover_image);
  const typeLabel = reportTypeLabels[report.report_type] ?? 'Report';
  // Workspace attribution replaces the individual, matching dataset-detail.tsx.
  const workspaceName = getWorkspaceName(report.workspace);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const bookmark = useReportBookmark(report.id);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-shadow hover:shadow-md',
        className
      )}
    >
      {/* Detail resolves by id — the API does not support slug lookup. */}
      <Link to={`/research/reports/${report.id}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {cover ? (
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <ReportDefaultIllustration className="transition-transform group-hover:scale-105" />
          )}
          {report.is_premium && (
            <Badge className="absolute right-2 top-2 gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
      </Link>

      {/* Sits outside the <Link> — a button nested in an anchor is invalid.
          Hidden when signed out: anonymous users have no bookmarks. */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={bookmark.toggle}
          disabled={bookmark.isPending}
          aria-pressed={bookmark.isBookmarked}
          aria-busy={bookmark.isPending}
          aria-label={
            bookmark.isBookmarked ? 'Remove bookmark' : 'Bookmark report'
          }
          title={bookmark.isBookmarked ? 'Remove bookmark' : 'Bookmark report'}
          className="absolute left-2 top-2 z-10 rounded-full bg-background/80 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-background disabled:opacity-60"
        >
          {bookmark.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Bookmark
              className={cn(
                'h-4 w-4 text-muted-foreground',
                bookmark.isBookmarked && 'fill-red-500 text-red-500'
              )}
            />
          )}
        </button>
      )}

      <CardContent className="space-y-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{typeLabel}</Badge>
          {report.category && (
            <Badge variant="outline">{report.category.name}</Badge>
          )}
        </div>

        <Link to={`/research/reports/${report.id}`} className="block">
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
            {report.title}
          </h3>
        </Link>

        {report.abstract || report.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {report.abstract || report.description}
          </p>
        ) : null}

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-1 truncate">
            {workspaceName ? (
              <>
                <Building2 className="h-3 w-3 shrink-0" />
                {workspaceName}
              </>
            ) : (
              <>
                <User className="h-3 w-3 shrink-0" />
                {report.owner.first_name} {report.owner.last_name}
              </>
            )}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {report.downloads_count}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
