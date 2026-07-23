import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import type { Route } from './+types/research-reports';
import { PageHeader } from '~/components/layout/page-header';
import { generateSEOTags } from '~/lib/utils/seo';
import { ReportCard } from '~/components/reports/report-card';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import { useReports } from '~/features/reports';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Reports',
    description: 'Browse and search published reports from the Data Lab team.',
  });
}

export default function ResearchReports() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  // No filter controls: GET /reports/ accepts page + limit only. Adding search or
  // category params here would send values the server silently ignores.
  const { data, isLoading, isError } = useReports({ page, limit });

  const reports = data?.data ?? [];
  const total = data?.meta?.total_docs ?? 0;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Reports"
        description="Published findings, methodologies, and insights from our research projects."
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold">
              Couldn&apos;t load reports
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Something went wrong fetching reports. Please try again shortly.
            </p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold">No reports published yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Published research from the Data Lab team will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
            <div className="mt-10">
              <PaginationControls
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
                onLimitChange={(next) => {
                  setLimit(next);
                  setPage(1);
                }}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
