import { Link, useParams } from 'react-router';
import { Loader2, LayoutGrid, Plus } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { useDashboards } from '~/features/dashboards';
import { useWorkspaceMembers } from '~/features/workspaces';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceDashboardsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const { data, isLoading } = useDashboards({ workspace: id });
  const { data: members } = useWorkspaceMembers(id!);
  const dashboards = data?.data ?? [];

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const canManage = myMember?.role === 'admin' || myMember?.role === 'creator';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Dashboards</h2>
          <p className="text-sm text-muted-foreground">
            Dashboards shared in this workspace
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to={`/app/workspaces/${id}/dashboards/new`}>
              <Plus className="mr-1.5 h-4 w-4" />
              New Dashboard
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : !dashboards.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <LayoutGrid className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No dashboards in this workspace yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dashboards.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-5">
                <h3 className="mb-1 line-clamp-1 text-sm font-medium">
                  {d.title}
                </h3>
                <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                  {d.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {d.status === 'PB'
                      ? 'Published'
                      : d.status === 'DF'
                        ? 'Draft'
                        : 'Archived'}
                  </Badge>
                  {d.is_public && (
                    <Badge variant="outline" className="text-[10px]">
                      Public
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
