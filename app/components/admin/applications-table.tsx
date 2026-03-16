import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/data-table';
import { Users } from 'lucide-react';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import { getDatasetCreatorBadge } from '~/lib/types/dataset-creator';

interface ApplicationsTableProps {
  applications: BecomeDatasetCreatorType[];
  onViewDetails: (application: BecomeDatasetCreatorType) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onMarkInReview?: (id: number) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isError?: boolean;
}

export function ApplicationsTable({
  applications,
  onViewDetails,
  onApprove,
  onReject,
  onMarkInReview,
  onRefresh,
  isRefreshing,
  isError,
}: ApplicationsTableProps) {
  const columns = useMemo<ColumnDef<BecomeDatasetCreatorType, unknown>[]>(
    () => [
      {
        accessorKey: 'user',
        header: 'Applicant',
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div>
              <p className="font-medium text-sm">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = `${rowA.original.user.first_name} ${rowA.original.user.last_name}`;
          const b = `${rowB.original.user.first_name} ${rowB.original.user.last_name}`;
          return a.localeCompare(b);
        },
      },
      {
        accessorKey: 'affiliation',
        header: 'Affiliation',
        cell: ({ getValue }) => (
          <span className="text-sm">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'expertise',
        header: 'Expertise',
        cell: ({ getValue }) => (
          <span className="text-sm max-w-50 truncate block">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const badge = getDatasetCreatorBadge(row.original.status);
          return <Badge className={badge.className}>{badge.label}</Badge>;
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Submitted',
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(getValue() as string).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="text-right block">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => {
          const app = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(app)}
              >
                View
              </Button>
              {app.status === 'Pending' && onMarkInReview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkInReview(app.id)}
                >
                  Review
                </Button>
              )}
              {app.status !== 'Approved' && (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => onApprove(app.id)}
                >
                  Approve
                </Button>
              )}
              {app.status !== 'Rejected' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject(app.id)}
                >
                  Reject
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onViewDetails, onApprove, onReject, onMarkInReview]
  );

  return (
    <DataTable
      columns={columns}
      data={applications}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      isError={isError}
      emptyTitle="No applications"
      emptyDescription="There are no applications matching your current filters."
      emptyIcon={<Users />}
    />
  );
}
