import { Download, FileText, Lock, Pencil, Trash2 } from 'lucide-react';
import { ReportDefaultIllustration } from '~/components/illustrations/report-default';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import { fileCount } from '~/lib/types/report';
import type { Report, ReportStatus } from '~/lib/types/report';

const reportTypeLabels: Record<string, string> = {
  research_paper: 'Research Paper',
  market_report: 'Market Report',
  climate_assessment: 'Climate Assessment',
  policy_brief: 'Policy Brief',
  technical_report: 'Technical Report',
  white_paper: 'White Paper',
  other: 'Report',
};

const statusLabels: Record<ReportStatus, string> = {
  DF: 'Draft',
  PB: 'Published',
  AR: 'Archived',
};

const statusVariants: Record<
  ReportStatus,
  'default' | 'secondary' | 'outline'
> = {
  PB: 'default',
  DF: 'secondary',
  AR: 'outline',
};

interface ReportListProps {
  reports: Report[];
  onEdit?: (id: string) => void;
  onDelete?: (report: Report) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Management card grid for reports — mirrors DatasetList rather than a DataTable.
 * Reports carry a cover, abstract, type and category, which a two-column table
 * throws away.
 */
export function ReportList({
  reports,
  onEdit,
  onDelete,
  emptyTitle = 'No reports found',
  emptyDescription = 'Create your first report to get started.',
}: Readonly<ReportListProps>) {
  if (reports.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center">
        <FileText className="mb-1 h-8 w-8 text-muted-foreground/50" />
        <p className="text-lg font-semibold text-muted-foreground">
          {emptyTitle}
        </p>
        <p className="text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
        {reports.map((report) => {
          const cover = resolveMediaUrl(report.cover_image);
          const versionCount = report.latest_version
            ? fileCount(report.latest_version)
            : 0;

          return (
            <Card key={report.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {cover ? (
                  <img
                    src={cover}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ReportDefaultIllustration />
                )}
                {report.is_premium && (
                  <Badge className="absolute right-2 top-2 gap-1">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>

              <CardContent className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={statusVariants[report.status]}>
                    {statusLabels[report.status]}
                  </Badge>
                  <Badge variant="secondary">
                    {reportTypeLabels[report.report_type] ?? 'Report'}
                  </Badge>
                  {report.category && (
                    <Badge variant="outline">{report.category.name}</Badge>
                  )}
                </div>

                <h3 className="line-clamp-2 font-semibold leading-snug">
                  {report.title}
                </h3>

                {(report.abstract || report.description) && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {report.abstract || report.description}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {report.downloads_count}
                  </span>
                  <span>
                    {versionCount} file{versionCount === 1 ? '' : 's'}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="gap-2 border-t p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit?.(report.id)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(report)}
                  aria-label={`Delete ${report.title}`}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
