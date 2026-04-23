import { FileText } from 'lucide-react';

export function FeaturedReports() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Research
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Research Reports
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Published findings and insights from our research projects.
          </p>
          <div className="mx-auto mt-5 h-px w-16 bg-primary/40" />
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Reports coming soon. Stay tuned for published research.
          </p>
        </div>
      </div>
    </section>
  );
}
