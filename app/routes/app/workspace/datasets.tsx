import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  AlertTriangle,
  Database,
  Loader2,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { DatasetList } from '~/components/creator-dashboard/dataset-list';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import {
  useWorkspaceDatasets,
  useWorkspaceMembers,
  useDeleteWorkspaceDataset,
  useUpdateWorkspaceDatasetStatus,
} from '~/features/workspaces';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceDatasetsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data: members } = useWorkspaceMembers(id!);
  const {
    data: datasetsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useWorkspaceDatasets(id!, { page, limit });
  const datasets = datasetsResponse?.data ?? [];
  const total = datasetsResponse?.meta?.total_docs ?? 0;

  const updateStatus = useUpdateWorkspaceDatasetStatus(id!);
  const deleteDataset = useDeleteWorkspaceDataset(id!);

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const canManage = myMember?.role === 'admin' || myMember?.role === 'creator';

  const handlePreview = useCallback(
    (datasetId: string) => {
      navigate(`/app/workspaces/${id}/datasets/${datasetId}`);
    },
    [navigate, id]
  );

  const handleEdit = useCallback(
    (datasetId: string) => {
      navigate(`/app/workspaces/${id}/datasets/${datasetId}/edit`);
    },
    [navigate, id]
  );

  const handleArchive = useCallback(
    (datasetId: string) => {
      updateStatus.mutate({ id: datasetId, status: 'AR' });
    },
    [updateStatus]
  );

  const handleDelete = useCallback(
    (datasetId: string) => {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Are you sure you want to delete this dataset?')
      ) {
        deleteDataset.mutate(datasetId);
      }
    },
    [deleteDataset]
  );

  const handleLimitChange = (next: number) => {
    setLimit(next);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Datasets</h2>
          <p className="text-sm text-muted-foreground">
            Datasets published in this workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh datasets"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
          {canManage && (
            <Button asChild>
              <Link to={`/app/workspaces/${id}/datasets/new`}>
                <Upload className="mr-1.5 h-4 w-4" />
                Upload Dataset
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive/60" />
          <p className="text-sm text-muted-foreground">
            Failed to load datasets.
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : !datasets.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No datasets in this workspace yet.
          </p>
          {canManage && (
            <Button asChild size="sm" className="mt-3">
              <Link to={`/app/workspaces/${id}/datasets/new`}>
                <Upload className="mr-1.5 h-4 w-4" />
                Upload Dataset
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <DatasetList
            datasets={datasets}
            onPreview={handlePreview}
            onEdit={canManage ? handleEdit : undefined}
            onArchive={canManage ? handleArchive : undefined}
            onDelete={canManage ? handleDelete : undefined}
          />
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
