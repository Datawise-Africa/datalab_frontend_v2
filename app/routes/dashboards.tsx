import { useState } from 'react';
import { BarChart3, Loader2, Search } from 'lucide-react';
import type { Route } from './+types/dashboards';
import { PageHeader } from '~/components/layout/page-header';
import { Input } from '~/components/ui/input';
import { PublicDashboardCard } from '~/components/dashboards/public-dashboard-card';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import { useDashboards } from '~/features/dashboards';
import { useDebounce } from '~/hooks/use-debounce';
import { generateSEOTags } from '~/lib/utils/seo';
import { breadcrumbSchema } from '~/lib/utils/structured-data';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dashboards & insights from your data',
    description:
      'Generate insights from structured datasets with interactive dashboards built for research and intelligence workflows.',
    url: '/dashboards',
    jsonLd: breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Dashboards', url: '/dashboards' },
    ]),
  });
}

export default function Dashboards() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, isError } = useDashboards({
    page,
    limit,
    search: debouncedSearch || undefined,
  });
  const dashboards = data?.data ?? [];
  const total = data?.meta?.total_docs ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Dashboards"
        description="Generate and explore insights from structured datasets through interactive analytics for research and intelligence workflows."
      />
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search dashboards..."
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? 'Loading...'
              : `${total.toLocaleString()} ${total === 1 ? 'dashboard' : 'dashboards'}`}
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to load dashboards"
            description="Something went wrong fetching dashboards. Please try again."
          />
        ) : dashboards.length === 0 ? (
          <EmptyState
            title={
              debouncedSearch ? 'No matching dashboards' : 'No dashboards yet'
            }
            description={
              debouncedSearch
                ? 'Try a different search term.'
                : 'Check back shortly — we are curating new dashboards.'
            }
          />
        ) : (
          <div className="@container">
            <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
              {dashboards.map((dashboard) => (
                <PublicDashboardCard key={dashboard.id} dashboard={dashboard} />
              ))}
            </div>
            <PaginationControls
              page={page}
              limit={limit}
              total={total}
              pageSizes={[6, 12, 24, 48]}
              onPageChange={setPage}
              onLimitChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              className="mt-8"
            />
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: Readonly<{ title: string; description: string }>) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
      <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
