import { useCallback, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Loader2,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type { Route } from './+types/dashboard-categories';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { DataTable } from '~/components/data-table';
import { DashboardCategoryDialog } from '~/components/admin/dashboard-category-dialog';
import { useUrlFilter } from '~/hooks/use-url-filter';
import {
  useDashboardCategories,
  useDeleteDashboardCategory,
} from '~/features/dashboard-categories';
import type { DashboardCategory } from '~/lib/types/dashboard';
import { toastUtils } from '~/lib/utils/toast';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dashboard Categories',
    description: 'Manage dashboard categories',
  });
}

export default function DashboardCategoriesAdmin() {
  const filter = useUrlFilter('admin-dashboard-categories');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<DashboardCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DashboardCategory | null>(
    null
  );

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDashboardCategories({
    page,
    limit,
    search: filter.searchQuery || undefined,
  });

  const deleteMutation = useDeleteDashboardCategory();

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

  const openEdit = (category: DashboardCategory) => {
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

  const columns = useMemo<ColumnDef<DashboardCategory, unknown>[]>(
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
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
            {row.original.description || '—'}
          </p>
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
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Categories</h1>
              <p className="text-sm text-muted-foreground">
                Group dashboards by topic to help users discover them
              </p>
            </div>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            New category
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter.searchQuery}
              onChange={(e) => {
                filter.setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories..."
              className="pl-10"
            />
          </div>
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
            emptyDescription="Create your first dashboard category to get started."
            emptyIcon={<LayoutGrid className="h-8 w-8" />}
            serverPagination={{
              pageIndex: page - 1,
              pageSize: limit,
              totalRows: totalDocs,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
          />
        )}

        <DashboardCategoryDialog
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
                . Dashboards already in this category will become uncategorized.
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
