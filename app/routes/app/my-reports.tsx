import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FileText, Loader2, Plus } from 'lucide-react';
import type { Route } from './+types/my-reports';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
import { ReportList } from '~/components/reports/report-list';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import { useMyReports, useDeleteMyReport } from '~/features/my-reports';
import type { Report } from '~/lib/types/report';
import { toastUtils } from '~/lib/utils/toast';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'My Reports',
    description: 'Manage the reports you have published',
  });
}

export default function MyReports() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  const { data: response, isLoading, isError } = useMyReports({ page, limit });

  const deleteMutation = useDeleteMyReport();

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
    <Protect>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Reports</h1>
              <p className="text-sm text-muted-foreground">
                Create, publish and manage your reports
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to="/app/my-reports/new">
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
          <div className="space-y-6">
            <ReportList
              reports={reports}
              onEdit={(reportId) =>
                navigate(`/app/my-reports/${reportId}/edit`)
              }
              onDelete={setDeleteTarget}
              emptyTitle="No reports yet"
              emptyDescription="Create your first report to get started."
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
          </div>
        )}

        <AppDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete report?"
          description={
            <>
              This will permanently remove{' '}
              <span className="font-medium text-foreground">
                {deleteTarget?.title}
              </span>{' '}
              and all of its versions and files.
            </>
          }
          size="sm"
          closeMode="explicit"
          footer={
            <>
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
            </>
          }
        />
      </div>
    </Protect>
  );
}
