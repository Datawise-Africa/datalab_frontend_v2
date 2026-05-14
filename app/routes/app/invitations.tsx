import type { Route } from './+types/invitations';
import { useMemo } from 'react';
import moment from 'moment';
import { Mail, Check, X } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/data-table';
import { generateSEOTags } from '~/lib/utils/seo';
import {
  useMyInvitations,
  useAcceptInvitation,
  useDeclineInvitation,
} from '~/features/invitations';
import type {
  InvitationStatus,
  WorkspaceInvitation,
} from '~/lib/types/workspace';

const statusVariant: Record<
  InvitationStatus,
  'default' | 'destructive' | 'secondary'
> = {
  accepted: 'default',
  declined: 'destructive',
  pending: 'secondary',
};

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'My Invitations',
    description: 'Pending workspace invitations',
  });
}

export default function InvitationsPage() {
  const { data: invitations, isLoading, isError, refetch } = useMyInvitations();
  const accept = useAcceptInvitation();
  const decline = useDeclineInvitation();

  const columns = useMemo<ColumnDef<WorkspaceInvitation>[]>(
    () => [
      {
        accessorKey: 'workspace_name',
        header: 'Workspace',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.workspace_name}</span>
        ),
      },
      {
        accessorKey: 'invited_email',
        header: 'Invited email',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.invited_email}
          </span>
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
        accessorKey: 'expiration_time',
        header: 'Expires',
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {moment(row.original.expiration_time).fromNow()}
          </span>
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
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => {
          const inv = row.original;
          if (inv.status !== 'pending') {
            return <span className="text-xs text-muted-foreground">—</span>;
          }
          return (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => decline.mutate(inv.id)}
                disabled={decline.isPending}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => accept.mutate(inv.id)}
                disabled={accept.isPending}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Accept
              </Button>
            </div>
          );
        },
      },
    ],
    [accept, decline]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Invitations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pending workspace invitations sent to your email
        </p>
      </div>

      <DataTable
        columns={columns}
        data={invitations ?? []}
        isRefreshing={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
        emptyIcon={<Mail className="h-8 w-8 text-muted-foreground/40" />}
        emptyTitle="No invitations"
        emptyDescription="You don't have any pending workspace invitations."
      />
    </div>
  );
}
