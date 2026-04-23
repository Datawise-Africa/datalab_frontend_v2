import { Link, Outlet, useParams } from 'react-router';
import { ArrowLeft, Loader2, Users, Database, LayoutGrid } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Protect } from '~/components/auth/protect';
import { useWorkspace, useWorkspaceMembers } from '~/features/workspaces';
import { useAppSelector } from '~/store';
import type { WorkspaceMember, WorkspaceRole } from '~/lib/types/workspace';

function getUserWorkspaceRole(
  userId: string | undefined,
  members: WorkspaceMember[]
): WorkspaceRole | null {
  if (!userId) return null;
  const member = members.find((m) => m.user.id === userId);
  return member?.role ?? null;
}

export default function WorkspaceLayout() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const { data: workspace, isLoading } = useWorkspace(id!);
  const { data: members } = useWorkspaceMembers(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Workspace not found</h2>
        <Button asChild variant="outline">
          <Link to="/app/workspaces">Back to Workspaces</Link>
        </Button>
      </div>
    );
  }

  const myRole = getUserWorkspaceRole(user?.id, members ?? []);

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <Link
              to="/app/workspaces"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All workspaces
            </Link>
            <h1 className="truncate text-2xl font-bold tracking-tight">
              {workspace.name}
            </h1>
            {workspace.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {workspace.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {workspace.member_count ?? 0} members
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                {workspace.dataset_count ?? 0} datasets
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" />
                dashboards
              </span>
              {myRole && (
                <Badge variant="secondary" className="capitalize">
                  {myRole}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </Protect>
  );
}
