import { Link, Outlet, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Loader2,
  Users,
  Database,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Protect } from '~/components/auth/protect';
import {
  useWorkspace,
  useWorkspaceDatasets,
  useWorkspaceMembers,
} from '~/features/workspaces';
import { workspaceKeys } from '~/features/workspaces/query-keys';
import { useAppSelector } from '~/store';
import type { WorkspaceMember, WorkspaceRole } from '~/lib/types/workspace';
import { cn } from '~/lib/utils';

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
  const queryClient = useQueryClient();
  const {
    data: workspace,
    isLoading,
    isFetching: isFetchingWorkspace,
  } = useWorkspace(id!);
  const { data: members, isFetching: isFetchingMembers } = useWorkspaceMembers(
    id!
  );
  const { data: datasetsResponse, isFetching: isFetchingDatasets } =
    useWorkspaceDatasets(id!);

  const isFetching =
    isFetchingWorkspace || isFetchingMembers || isFetchingDatasets;

  const handleRefresh = () => {
    if (!id) return;
    queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(id) });
    queryClient.invalidateQueries({ queryKey: workspaceKeys.members(id) });
    queryClient.invalidateQueries({ queryKey: workspaceKeys.datasets(id) });
    queryClient.invalidateQueries({ queryKey: workspaceKeys.invitations(id) });
    queryClient.invalidateQueries({ queryKey: workspaceKeys.analytics(id) });
  };

  // Counts: prefer the server-reported aggregate, fall back to fetched
  // collection lengths so a freshly-created workspace (or a backend that
  // doesn't aggregate) still shows accurate totals.
  const memberCount = workspace?.member_count || (members?.length ?? 0);
  const datasetCount =
    workspace?.dataset_count ||
    datasetsResponse?.meta?.total_docs ||
    datasetsResponse?.data?.length ||
    0;

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
    <Protect>
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
                {memberCount} members
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                {datasetCount} datasets
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="shrink-0 gap-1.5"
            aria-busy={isFetching}
          >
            <RefreshCw
              className={cn('h-4 w-4', isFetching && 'animate-spin')}
            />
            Refresh
          </Button>
        </div>

        <Outlet />
      </div>
    </Protect>
  );
}
