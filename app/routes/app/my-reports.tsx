import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { FileText, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Route } from './+types/my-reports';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { DataTable } from '~/components/data-table';
import { useMyReports, useDeleteMyReport } from '~/features/my-reports';
import type { Report, ReportStatus } from '~/lib/types/report';
import { toastUtils } from '~/lib/utils/toast';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'My Reports',
    description: 'Manage the reports you have published',
  });
}

const statusLabels: Record<ReportStatus, string> = {
  DF: 'Draft',
  PB: 'Published',
  AR: 'Archived',
};

const statusVariants: Record<
  ReportStatus,
  'default' | 'secondary' | 'outline'
> = {
  PB: 'default',
  DF: 'secondary',
  AR: 'outline',
};

export default function MyReports() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMyReports({ page, limit });

  const deleteMutation = useDeleteMyReport();

  const reports = response?.data ?? [];
  const totalDocs = response?.meta?.total_docs ?? 0;

  const handlePageChange = useCallback((pageIndex: number) => {
    setPage(pageIndex + 1);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setLimit(newSize);
    setPage(1);
  }, []);

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

  const columns = useMemo<ColumnDef<Report, unknown>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-sm">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.category?.name ?? 'Uncategorized'}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusVariants[row.original.status]}>
            {statusLabels[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'downloads_count',
        header: 'Downloads',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.downloads_count}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(`/app/my-reports/${row.original.id}/edit`)
              }
              aria-label="Edit report"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(row.original)}
              aria-label="Delete report"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate]
  );

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
        ) : (
          <DataTable
            columns={columns}
            data={reports}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isError={isError}
            emptyTitle="No reports yet"
            emptyDescription="Create your first report to get started."
            emptyIcon={<FileText className="h-8 w-8" />}
            serverPagination={{
              pageIndex: page - 1,
              pageSize: limit,
              totalRows: totalDocs,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
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
    </Protect>
  );
}
