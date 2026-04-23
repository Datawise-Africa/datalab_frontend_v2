import { useParams } from 'react-router';
import { useWorkspaceMembers } from '~/features/workspaces';
import { MemberList } from '~/components/workspaces/member-list';
import { InviteMemberDialog } from '~/components/workspaces/invite-member-dialog';
import { useAppSelector } from '~/store';
import type { WorkspaceMember } from '~/lib/types/workspace';

export default function WorkspaceMembersPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const { data: members } = useWorkspaceMembers(id!);

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
        {isWsAdmin && <InviteMemberDialog workspaceId={id!} />}
      </div>

      <MemberList
        members={members ?? []}
        workspaceId={id!}
        isAdmin={isWsAdmin}
      />
    </div>
  );
}
