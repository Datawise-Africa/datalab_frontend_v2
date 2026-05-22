import { useParams } from 'react-router';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useWorkspaceMembers } from '~/features/workspaces';
import { MemberList } from '~/components/workspaces/member-list';
import { InviteMemberDialog } from '~/components/workspaces/invite-member-dialog';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceMembersPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const {
    data: members,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useWorkspaceMembers(id!);

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const isWsAdmin = myMember?.role === 'admin';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Members</h2>
          <p className="text-sm text-muted-foreground">
            People who can access this workspace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh members"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
          {isWsAdmin && <InviteMemberDialog workspaceId={id!} />}
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
            Failed to load members.
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <MemberList
          members={members ?? []}
          workspaceId={id!}
          isAdmin={isWsAdmin}
        />
      )}
    </div>
  );
}
