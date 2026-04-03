import { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Route } from './+types/approved-creators';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { ApplicantModal } from '~/components/admin/applicant-modal';
import { DataTable } from '~/components/data-table';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Loader2, Search, UserCheck, MoreHorizontal } from 'lucide-react';
import { useCreatorApplications } from '~/features/dataset-creator';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import { useUpdateApplicationStatus } from '~/features/dataset-creator/mutations';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Approved Creators',
    description: 'View approved dataset creators',
  });
}

export default function ApprovedCreators() {
  const {
    data: applications,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCreatorApplications();
  const updateStatus = useUpdateApplicationStatus();
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] =
    useState<BecomeDatasetCreatorType | null>(null);

  const approved = useMemo(() => {
    if (!applications?.data) return [];
    return applications.data
      .filter((app) => app.status === 'approved')
      .filter(
        (app) =>
          !search ||
          `${app.user_name} ${app.user_email}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          app.affiliation.toLowerCase().includes(search.toLowerCase())
      );
  }, [applications, search]);

  const handleRevoke = (id: string) => {
    updateStatus.mutate({ id, status: 'rejected' });
  };

  const columns = useMemo<ColumnDef<BecomeDatasetCreatorType, unknown>[]>(
    () => [
      {
        accessorKey: 'user',
        header: 'Creator',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div>
              <p className="font-medium text-sm">{user.user_name}</p>
              <p className="text-xs text-muted-foreground">{user.user_email}</p>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = `${rowA.original.user_name}`;
          const b = `${rowB.original.user_name}`;
          return a.localeCompare(b);
        },
      },
      {
        accessorKey: 'affiliation',
        header: 'Affiliation',
      },
      {
        accessorKey: 'expertise',
        header: 'Expertise',
        cell: ({ getValue }) => (
          <span className="max-w-50 truncate block text-sm">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'approved_at',
        header: 'Approved',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {new Date(
              row.original.approved_at ?? row.original.created_at
            ).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: () => (
          <Badge className="border-primary/20 bg-primary/5 text-primary">
            Approved
          </Badge>
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
                onClick={() => setSelectedApp(app)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRevoke(app.id)}
              >
                Revoke
              </Button>
            </div>
          );
        },
      },
    ],
    [handleRevoke, setSelectedApp]
  );

  return (
    <Protect roles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Approved Creators</h1>
            <p className="text-sm text-muted-foreground">
              {approved.length} approved dataset creator
              {approved.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or affiliation..."
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={approved}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isError={isError}
            emptyTitle="No approved creators"
            emptyDescription="Approved creators will appear here once applications are reviewed."
            emptyIcon={<UserCheck />}
          />
        )}

        <ApplicantModal
          application={selectedApp}
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={() => {}}
          onReject={handleRevoke}
        />
      </div>
    </Protect>
  );
}
