import { Link } from 'react-router';
import type { Route } from './+types/research-report-detail';
import { researchReports, type ResearchReport } from '~/data/research';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  BookOpen,
  Copy,
} from 'lucide-react';
import { generateSEOTags } from '~/lib/utils/seo';

/* ── Loader ─────────────────────────────────────────────────── */
export function loader({ params }: Route.LoaderArgs) {
  const report = researchReports.find((r) => r.slug === params.slug);
  if (!report) {
    throw new Response('Not Found', { status: 404 });
  }
  return { report };
}

/* ── Meta ───────────────────────────────────────────────────── */
export function meta({ data }: Route.MetaArgs) {
  if (!data?.report) {
    return generateSEOTags({
      title: 'Report Not Found',
      description: 'The requested research report could not be found.',
    });
  }
  return generateSEOTags({
    title: data.report.title,
    description: data.report.abstract,
  });
}

/* ── Helpers ────────────────────────────────────────────────── */
function buildCitation(report: ResearchReport): string {
  const lastNames = report.authors.map((author) => {
    const parts = author
      .replace(/^Dr\.\s*/, '')
      .trim()
      .split(' ');
    return parts[parts.length - 1];
  });

  const year = new Date(report.date).getFullYear();
  const authorStr =
    lastNames.length <= 2
      ? lastNames.join(' & ')
      : lastNames.slice(0, -1).join(', ') +
        ', & ' +
        lastNames[lastNames.length - 1];

  return `${authorStr} (${year}). ${report.title}. Data Lab Research Reports.`;
}

/* ── Component ──────────────────────────────────────────────── */
export default function ResearchReportDetail({
  loaderData,
}: Route.ComponentProps) {
  const { report } = loaderData;

  const contentParagraphs = report.content
    .split('\n\n')
    .filter((p) => p.trim() !== '');

  const citation = buildCitation(report);

  const relatedReports = researchReports
    .filter(
      (r) =>
        r.slug !== report.slug &&
        r.tags.some((tag) => report.tags.includes(tag))
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Back Link ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/research/reports"
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            'text-muted-foreground hover:text-primary transition-colors'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {report.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 shrink-0" />
              {report.authors.join(', ')}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              {new Date(report.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" />
              {report.readTime}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {report.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator />
      </div>

      {/* ── Abstract ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="rounded-lg bg-primary/5 border-l-4 border-primary p-6 sm:p-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">
              Abstract
            </h2>
            <p className="text-base leading-relaxed text-primary">
              {report.abstract}
            </p>
          </div>
        </div>
      </section>

      {/* ── Full Content ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Full Report</h2>
          </div>

          {contentParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-muted-foreground leading-relaxed mb-4"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Separator />
      </div>

      {/* ── Citation ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Cite This Report</h2>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                navigator.clipboard.writeText(citation).catch(() => {});
              }}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Citation
            </Button>
          </div>

          <div className="rounded-lg bg-gray-900 p-5">
            <code className="text-sm leading-relaxed text-gray-100 whitespace-pre-wrap break-words">
              {citation}
            </code>
          </div>
        </div>
      </section>

      {/* ── Related Reports ────────────────────────────────── */}
      {relatedReports.length > 0 && (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Separator />
          </div>

          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Related Reports
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedReports.map((related) => (
                <Link
                  key={related.slug}
                  to={`/research/reports/${related.slug}`}
                  className="group"
                >
                  <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                        {related.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {related.abstract}
                      </p>

                      <div className="mt-auto space-y-3 pt-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {related.authors.join(', ')}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(related.date).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>

                        <span className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary transition-colors">
                          Read Report &rarr;
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
