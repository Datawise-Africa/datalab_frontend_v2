import { BarChart3 } from 'lucide-react';

export function FeaturedDashboards() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboards
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Interactive analytics dashboards powered by leading BI platforms.
          </p>
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
