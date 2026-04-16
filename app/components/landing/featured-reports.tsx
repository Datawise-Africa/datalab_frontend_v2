import { FileText } from 'lucide-react';

export function FeaturedReports() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Research Reports
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Published findings and insights from our research projects.
          </p>
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
