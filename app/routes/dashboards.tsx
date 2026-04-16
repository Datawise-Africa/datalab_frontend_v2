import { BarChart3 } from 'lucide-react';
import type { Route } from './+types/dashboards';
import { PageHeader } from '~/components/layout/page-header';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dashboards & Publications',
    description:
      'Explore interactive analytics dashboards powered by Power BI, Tableau, Looker Studio, and more.',
  });
}

export default function Dashboards() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Dashboards & Publications"
        description="Interactive analytics dashboards powered by Power BI, Tableau, Looker Studio, and more."
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Dashboards coming soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We're curating interactive dashboards from leading BI platforms.
            Check back shortly.
          </p>
        </div>
      </section>
    </div>
  );
}
