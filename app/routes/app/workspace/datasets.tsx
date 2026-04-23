import { Link, useParams } from 'react-router';
import { Database, Upload } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import {
  useWorkspaceDatasets,
  useWorkspaceMembers,
} from '~/features/workspaces';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceDatasetsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const { data: members } = useWorkspaceMembers(id!);
  const { data: datasets } = useWorkspaceDatasets(id!);

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const canManage = myMember?.role === 'admin' || myMember?.role === 'creator';

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

      {!datasets?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No datasets in this workspace yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {datasets.map((ds) => (
            <Card key={ds.id}>
              <CardContent className="p-5">
                <h3 className="mb-1 line-clamp-1 text-sm font-medium">
                  {ds.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                  {ds.description}
                </p>
                <Badge variant="secondary" className="text-[10px]">
                  {ds.status === 'PB'
                    ? 'Published'
                    : ds.status === 'DF'
                      ? 'Draft'
                      : 'Archived'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
