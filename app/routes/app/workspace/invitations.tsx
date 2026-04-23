import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Mail } from 'lucide-react';
import moment from 'moment';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';
import { DataTable } from '~/components/data-table';
import { InviteMemberDialog } from '~/components/workspaces/invite-member-dialog';
import {
  useWorkspaceInvitations,
  useWorkspaceMembers,
} from '~/features/workspaces';
import { useAppSelector } from '~/store';
import type {
  InvitationStatus,
  WorkspaceInvitation,
  WorkspaceMember,
} from '~/lib/types/workspace';

const statusVariant: Record<
  InvitationStatus,
  'default' | 'destructive' | 'secondary'
> = {
  accepted: 'default',
  declined: 'destructive',
  pending: 'secondary',
};

export default function WorkspaceInvitationsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((s) => s.auth.user);
  const {
    data: invitations,
    isLoading,
    isError,
    refetch,
  } = useWorkspaceInvitations(id!);
  const { data: members } = useWorkspaceMembers(id!);

  const myMember = (members ?? []).find(
    (m: WorkspaceMember) => m.user.id === user?.id
  );
  const isWsAdmin = myMember?.role === 'admin';

  const columns = useMemo<ColumnDef<WorkspaceInvitation>[]>(
    () => [
      {
        accessorKey: 'invited_email',
        header: 'Invited email',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.invited_email}</span>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge
            variant={statusVariant[row.original.status]}
            className="capitalize"
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'expiration_time',
        header: 'Expires',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {moment(row.original.expiration_time).fromNow()}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Sent',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {moment(row.original.created_at).fromNow()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Invitations</h2>
          <p className="text-sm text-muted-foreground">
            Outstanding invites sent from this workspace
          </p>
        </div>
        {isWsAdmin && <InviteMemberDialog workspaceId={id!} />}
      </div>

      <DataTable
        columns={columns}
        data={invitations ?? []}
        isRefreshing={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
        emptyIcon={<Mail className="h-8 w-8 text-muted-foreground/40" />}
        emptyTitle="No invitations"
        emptyDescription="No outstanding invitations for this workspace."
      />
    </div>
  );
}
