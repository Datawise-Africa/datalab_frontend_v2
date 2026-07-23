import { useCallback, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Loader2, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Route } from './+types/report-categories';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
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
import { ReportCategoryDialog } from '~/components/admin/report-category-dialog';
import {
  useReportCategories,
  useDeleteReportCategory,
} from '~/features/report-categories';
import type { ReportCategory } from '~/lib/types/report';
import { toastUtils } from '~/lib/utils/toast';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Report Categories',
    description: 'Manage report categories',
  });
}

export default function ReportCategoriesAdmin() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<ReportCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReportCategory | null>(null);

  // No search box: GET /report-categories/ accepts page + limit only. A client-side
  // filter would only search the current page, which reads as broken search.
  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useReportCategories({ page, limit });

  const deleteMutation = useDeleteReportCategory();

  const categories = response?.data ?? [];
  const totalDocs = response?.meta?.total_docs ?? 0;

  const handlePageChange = useCallback((pageIndex: number) => {
    setPage(pageIndex + 1);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setLimit(newSize);
    setPage(1);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (category: ReportCategory) => {
    setEditing(category);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toastUtils.success('Deleted category', name);
        setDeleteTarget(null);
      },
    });
  };

  const columns = useMemo<ColumnDef<ReportCategory, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-sm">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.slug}</p>
          </div>
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
              onClick={() => openEdit(row.original)}
              aria-label="Edit category"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(row.original)}
              aria-label="Delete category"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Protect roles={['admin']}>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Report Categories</h1>
              <p className="text-sm text-muted-foreground">
                Group reports by topic to help users discover them
              </p>
            </div>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            New category
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={categories}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isError={isError}
            emptyTitle="No categories yet"
            emptyDescription="Create your first report category to get started."
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

        <ReportCategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          category={editing}
        />

        <Dialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete category?</DialogTitle>
              <DialogDescription>
                This will permanently remove{' '}
                <span className="font-medium text-foreground">
                  {deleteTarget?.name}
                </span>
                . Reports already in this category will become uncategorized.
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
