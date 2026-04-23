import { BarChart3 } from 'lucide-react';

export function FeaturedDashboards() {
  return (
    <section className="relative border-t border-border/60 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Insights
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboards
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Interactive analytics dashboards powered by leading BI platforms.
          </p>
          <div className="mx-auto mt-5 h-px w-16 bg-primary/40" />
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Dashboards coming soon. Stay tuned for interactive analytics.
          </p>
        </div>
      </div>
    </section>
  );
}
