import { FileText } from 'lucide-react';
import type { Route } from './+types/research-reports';
import { PageHeader } from '~/components/layout/page-header';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Reports',
    description: 'Browse and search published reports from the Data Lab team.',
  });
}

export default function ResearchReports() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Reports"
        description="Published findings, methodologies, and insights from our research projects."
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Reports coming soon</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            We're preparing published research from the Data Lab team. Check
            back shortly.
          </p>
        </div>
      </section>
    </div>
  );
}
