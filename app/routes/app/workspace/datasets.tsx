import { useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Database, Upload } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { DatasetList } from '~/components/creator-dashboard/dataset-list';
import {
  useWorkspaceDatasets,
  useWorkspaceMembers,
} from '~/features/workspaces';
import {
  useDeleteMyDataset,
  useUpdateMyDatasetStatus,
} from '~/features/my-datasets';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceDatasetsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { data: members } = useWorkspaceMembers(id!);
  const { data: datasetsResponse } = useWorkspaceDatasets(id!);
  const datasets = datasetsResponse?.data ?? [];

  const updateStatus = useUpdateMyDatasetStatus();
  const deleteDataset = useDeleteMyDataset();

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const canManage = myMember?.role === 'admin' || myMember?.role === 'creator';

  const workspaceQuery = id ? `?workspace=${id}` : '';

  const handlePreview = useCallback(
    (datasetId: string) => {
      navigate(`/app/view-dataset/${datasetId}${workspaceQuery}`);
    },
    [navigate, workspaceQuery]
  );

  const handleEdit = useCallback(
    (datasetId: string) => {
      navigate(`/app/edit-dataset/${datasetId}${workspaceQuery}`);
    },
    [navigate, workspaceQuery]
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Datasets</h2>
          <p className="text-sm text-muted-foreground">
            Datasets published in this workspace
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to={`/app/workspaces/${id}/datasets/new`}>
              <Upload className="mr-1.5 h-4 w-4" />
              Upload Dataset
            </Link>
          </Button>
        )}
      </div>

      {!datasets.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No datasets in this workspace yet.
          </p>
        </div>
      ) : (
        <DatasetList
          datasets={datasets}
          onPreview={handlePreview}
          onEdit={canManage ? handleEdit : undefined}
          onArchive={canManage ? handleArchive : undefined}
          onDelete={canManage ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
