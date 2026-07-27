import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Lock,
  Bookmark,
} from 'lucide-react';
import type { Route } from './+types/research-report-detail';
import { generateSEOTags } from '~/lib/utils/seo';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import {
  useReport,
  useReportVersions,
  useReportBookmark,
} from '~/features/reports';
import { useResumeAfterAuth } from '~/hooks/use-resume-after-auth';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import { useTrackReportView } from '~/hooks/use-track-view';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import { formatBytes } from '~/lib/utils/format';
import { fileCount } from '~/lib/types/report';
import { cn } from '~/lib/utils';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Report',
    description: 'Read published research from the Data Lab team.',
  });
}

const reportTypeLabels: Record<string, string> = {
  research_paper: 'Research Paper',
  market_report: 'Market Report',
  climate_assessment: 'Climate Assessment',
  policy_brief: 'Policy Brief',
  technical_report: 'Technical Report',
  white_paper: 'White Paper',
  other: 'Report',
};

export default function ResearchReportDetail() {
  const { id } = useParams();
  const reportId = id ?? '';

  const { data: report, isLoading, isError } = useReport(reportId);
  const { data: versionsData } = useReportVersions(reportId);
  const bookmark = useReportBookmark(reportId);
  const resumeBookmarkToggle = useResumeAfterAuth<void>(() =>
    bookmark.toggle()
  );
  const handleBookmark = () => resumeBookmarkToggle();

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const reportDownloadModal = useAppModal('reportDownload');

  useTrackReportView(report ? reportId : undefined);

  const versions = versionsData ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <h1 className="text-2xl font-semibold">Report not found</h1>
        <p className="text-sm text-muted-foreground">
          This report may have been unpublished or removed.
        </p>
        <Button asChild variant="outline">
          <Link to="/research/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reports
          </Link>
        </Button>
      </div>
    );
  }

  const cover = resolveMediaUrl(report.cover_image);
  const typeLabel = reportTypeLabels[report.report_type] ?? 'Report';

  // The endpoint is IsAuthenticated, so anonymous users are routed through the
  // auth modal's `next` intent — signing in re-opens the download modal with
  // the same payload rather than dropping the click.
  const handleDownload = () => {
    const payload = { reportId: report.id, reportName: report.title };
    if (!isAuthenticated) {
      authModal.open({ next: { modal: 'reportDownload', payload } });
      return;
    }
    reportDownloadModal.open(payload);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/research/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to reports
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{typeLabel}</Badge>
          {report.category && (
            <Badge variant="outline">{report.category.name}</Badge>
          )}
          {report.is_premium && (
            <Badge className="gap-1">
              <Lock className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {report.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>
            {report.owner.first_name} {report.owner.last_name}
          </span>
          {report.published_at && (
            <span>
              Published {new Date(report.published_at).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {report.downloads_count} downloads
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            className={cn(
              bookmark.isBookmarked && 'border-red-500 text-red-500'
            )}
            onClick={handleBookmark}
            disabled={bookmark.isPending}
            aria-pressed={bookmark.isBookmarked}
            aria-busy={bookmark.isPending}
          >
            {bookmark.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bookmark
                className={cn(
                  'mr-2 h-4 w-4',
                  bookmark.isBookmarked && 'fill-red-500 text-red-500'
                )}
              />
            )}
            {bookmark.isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </div>

        {cover && (
          <img
            src={cover}
            alt=""
            className="mt-8 w-full rounded-lg border object-cover"
          />
        )}

        {report.abstract && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Abstract</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {report.abstract}
            </p>
          </section>
        )}

        {report.description && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {report.description}
            </p>
          </section>
        )}

        {report.authors.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold">Authors</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {report.authors.map((author) => (
                <li key={`${author.user.id}-${author.role}`}>
                  {author.user.first_name} {author.user.last_name}
                  <span className="text-xs"> — {author.role}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {report.tags.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {report.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {versions.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <h2 className="text-lg font-semibold">Versions</h2>
              <ul className="mt-3 space-y-2">
                {versions.map((version) => (
                  <li
                    key={version.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        v{version.version}
                        {version.is_latest && (
                          <Badge variant="secondary" className="ml-2">
                            Latest
                          </Badge>
                        )}
                      </p>
                      {version.description && (
                        <p className="text-xs text-muted-foreground">
                          {version.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {fileCount(version)} file
                      {fileCount(version) === 1 ? '' : 's'} ·{' '}
                      {formatBytes(version.size_bytes)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
