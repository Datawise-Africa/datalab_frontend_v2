import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { ReportList } from '~/components/reports/report-list';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import {
  useWorkspaceReports,
  useDeleteWorkspaceReport,
} from '~/features/my-reports';
import type { Report } from '~/lib/types/report';
import { toastUtils } from '~/lib/utils/toast';

export default function WorkspaceReportsPage() {
  const { id } = useParams<{ id: string }>();
  const workspaceId = id ?? '';
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useWorkspaceReports(workspaceId, { page, limit });

  const deleteMutation = useDeleteWorkspaceReport(workspaceId);

  const reports = response?.data ?? [];
  const total = response?.meta?.total_docs ?? 0;

  const handleDelete = () => {
    if (!deleteTarget) return;
    const title = deleteTarget.title;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toastUtils.success('Deleted report', title);
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Reports</h2>
          <p className="text-sm text-muted-foreground">
            Reports scoped to this workspace
          </p>
        </div>
        <Button asChild>
          <Link to={`/app/workspaces/${workspaceId}/reports/new`}>
            <Plus className="mr-1.5 h-4 w-4" />
            New report
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Couldn&apos;t load reports
          </p>
          <p className="text-sm text-muted-foreground">
            Something went wrong. Please try again shortly.
          </p>
        </div>
      ) : (
        <>
          <ReportList
            reports={reports}
            onEdit={(reportId) =>
              navigate(
                `/app/workspaces/${workspaceId}/reports/${reportId}/edit`
              )
            }
            onDelete={setDeleteTarget}
            emptyTitle="No reports in this workspace"
            emptyDescription="Create a report scoped to this workspace to get started."
          />
          {total > 0 && (
            <PaginationControls
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={(next) => {
                setLimit(next);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete report?</DialogTitle>
            <DialogDescription>
              This will permanently remove{' '}
              <span className="font-medium text-foreground">
                {deleteTarget?.title}
              </span>{' '}
              and all of its versions and files.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
