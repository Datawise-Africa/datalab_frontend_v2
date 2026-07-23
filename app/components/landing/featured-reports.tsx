import { Link } from 'react-router';
import { ArrowRight, FileText, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ReportCard } from '~/components/reports/report-card';
import { useReports } from '~/features/reports';

export function FeaturedReports() {
  const { data, isLoading } = useReports({ page: 1, limit: 3 });
  const reports = data?.data ?? [];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Research
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Reports
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Published findings and insights from our research projects.
          </p>
          <div className="mx-auto mt-5 h-px w-16 bg-primary/40" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Reports coming soon. Stay tuned for published research.
            </p>
          </div>
        ) : (
          <>
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/research/reports">
                  View All Reports
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
