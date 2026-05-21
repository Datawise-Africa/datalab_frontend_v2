import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { useDeleteMyDataset } from '~/features/my-datasets';
import { useDeleteWorkspaceDataset } from '~/features/workspaces';
import type { PreviewContext } from './preview-context';

type Props = Readonly<{
  datasetId: string;
  context: PreviewContext;
  onDeleted: () => void;
}>;

export function DatasetDangerZone({ datasetId, context, onDeleted }: Props) {
  const [confirm, setConfirm] = useState(false);
  const isWorkspace = context.kind === 'workspace';
  const personalDelete = useDeleteMyDataset();
  const workspaceDelete = useDeleteWorkspaceDataset(
    isWorkspace ? context.workspaceId : ''
  );
  const deleteDataset = isWorkspace ? workspaceDelete : personalDelete;

  const handleConfirm = () => {
    deleteDataset.mutate(datasetId, {
      onSuccess: () => {
        onDeleted();
      },
    });
  };

  return (
    <Card className="border-destructive/30">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting this dataset is permanent. All versions, schemas, and
          download history will be removed. This action cannot be undone.
        </p>
        {!confirm ? (
          <Button variant="destructive" onClick={() => setConfirm(true)}>
            Delete dataset
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={deleteDataset.isPending}
            >
              {deleteDataset.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirm(false)}
              disabled={deleteDataset.isPending}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
