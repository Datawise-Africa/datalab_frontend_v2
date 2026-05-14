import { Microscope } from 'lucide-react';
import type { Route } from './+types/research';
import { PageHeader } from '~/components/layout/page-header';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Research',
    description: 'Advancing data science through open research at Data Lab.',
  });
}

export default function Research() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Data Lab Research"
        description="Advancing data science through open research in machine learning, causal inference, and data systems."
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <Microscope className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Research coming soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We're preparing research projects and publications. Check back
            shortly.
          </p>
        </div>
      </section>
    </div>
  );
}
