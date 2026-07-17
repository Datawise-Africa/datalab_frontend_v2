import { Link } from 'react-router';
import { FileText, Download, Lock } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import { cn } from '~/lib/utils';
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

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-shadow hover:shadow-md',
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
            <div className="flex h-full w-full items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          {report.is_premium && (
            <Badge className="absolute right-2 top-2 gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
      </Link>

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
          <span className="truncate">
            {report.owner.first_name} {report.owner.last_name}
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
