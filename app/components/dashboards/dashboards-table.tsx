import { useState } from 'react';
import { Link } from 'react-router';
import { LayoutGrid, Plus, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import {
  useMyDashboards,
  useDeleteMyDashboard,
} from '~/features/my-dashboards';
import { DashboardCard } from './dashboard-card';

interface Props {
  /** If provided, scopes the list + create link to the workspace. */
  workspaceId?: string;
  /** Header title override. */
  title?: string;
  /** Header description override. */
  description?: string;
}

/**
 * Card-grid listing of dashboards with server-side pagination. Works in both
 * the user-level `/app/my-dashboards` page and inside a workspace via `workspaceId`.
 */
export function DashboardsTable({
  workspaceId,
  title = 'My Dashboards',
  description = 'Dashboards you have published.',
}: Readonly<Props>) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const params = {
    page,
    limit,
    ...(workspaceId ? { workspace: workspaceId } : {}),
  };
  const { data, isLoading, isError, refetch } = useMyDashboards(params);
  const deleteMutation = useDeleteMyDashboard();

  const dashboards = data?.data ?? [];
  const total = data?.meta?.total_docs ?? 0;

  const createHref = workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards/new`
    : '/app/my-dashboards/new';

  const detailHref = (id: string) =>
    workspaceId
      ? `/app/workspaces/${workspaceId}/dashboards/${id}`
      : `/app/my-dashboards/${id}`;

  const editHref = (id: string) =>
    workspaceId
      ? `/app/workspaces/${workspaceId}/dashboards/${id}/edit`
      : `/app/my-dashboards/${id}/edit`;

  const handleDelete = (id: string, dashboardTitle: string) => {
    if (window.confirm(`Delete "${dashboardTitle}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleLimitChange = (next: number) => {
    setLimit(next);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild>
          <Link to={createHref}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Dashboard
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive/60" />
          <p className="text-sm text-muted-foreground">
            Failed to load dashboards.
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : dashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <LayoutGrid className="h-10 w-10 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No dashboards yet</p>
            <p className="text-sm text-muted-foreground">
              Publish your first dashboard to share it with your audience.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to={createHref}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Dashboard
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboards.map((dashboard) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                detailHref={detailHref(dashboard.id)}
                editHref={editHref(dashboard.id)}
                onDelete={() => handleDelete(dashboard.id, dashboard.title)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>

          <PaginationControls
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            className="pt-2"
          />
        </>
      )}
    </div>
  );
}
