import { Link } from 'react-router';
import { Plus, Loader2, FolderKanban } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Protect } from '~/components/auth/protect';
import { useWorkspaces } from '~/features/workspaces';
import { WorkspaceCard } from '~/components/workspaces/workspace-card';
import { useAppSelector } from '~/store';
import { AuthPerm } from '~/lib/utils/perm';

export default function WorkspacesPage() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const user = useAppSelector((s) => s.auth.user);
  const perm = AuthPerm.getInstance();
  const canCreate =
    !!user &&
    (perm.hasPermission('creator', user.user_role) ||
      perm.hasPermission('admin', user.user_role));

  return (
    <Protect>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground mt-1">
              Collaborate on datasets with your team.
            </p>
          </div>
          {canCreate && (
            <Button asChild>
              <Link to="/app/workspaces/new">
                <Plus className="mr-1.5 h-4 w-4" />
                Create Workspace
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !workspaces?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderKanban className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="font-medium mb-1">No workspaces yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {canCreate
                ? 'Create a workspace to start collaborating on datasets.'
                : "You don't belong to any workspaces yet. Wait for an invitation from a creator or admin."}
            </p>
            {canCreate && (
              <Button asChild>
                <Link to="/app/workspaces/new">
                  Create your first workspace
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        )}
      </div>
    </Protect>
  );
}
