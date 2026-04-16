import type { Route } from './+types/workspace';
import { Terminal } from 'lucide-react';
import { PageHeader } from '~/components/layout/page-header';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Workspace',
    description: 'Developer workspace with project-based organization.',
  });
}

export default function Workspace() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Workspace"
        description="A developer workspace for exploring datasets and running analyses."
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <Terminal className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Workspace coming soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We're building an interactive workspace for exploring datasets.
            Check back shortly.
          </p>
        </div>
      </section>
    </div>
  );
}
