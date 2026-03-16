import { useState, useMemo } from 'react';
import type { Route } from './+types/applications';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { ApplicationsTable } from '~/components/admin/applications-table';
import { ApplicantModal } from '~/components/admin/applicant-modal';
import { Input } from '~/components/ui/input';
import { AsyncSelect } from '~/components/ui/async-select';
import { Loader2, Search, Users } from 'lucide-react';
import {
  useCreatorApplications,
  useUpdateApplicationStatus,
} from '~/features/dataset-creator';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Applications',
    description: 'Review dataset creator applications',
  });
}

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In review', value: 'In review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

export default function Applications() {
  const {
    data: applications,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCreatorApplications();
  const updateStatus = useUpdateApplicationStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] =
    useState<BecomeDatasetCreatorType | null>(null);

  const filtered = useMemo(() => {
    if (!applications) return [];
    return applications.filter((app) => {
      const matchesSearch =
        !search ||
        `${app.user.first_name} ${app.user.last_name} ${app.user.email}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        app.affiliation.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const handleApprove = (id: number) => {
    updateStatus.mutate({ id, status: 'Approved' });
  };

  const handleReject = (id: number) => {
    updateStatus.mutate({ id, status: 'Rejected' });
  };

  const handleMarkInReview = (id: number) => {
    updateStatus.mutate({ id, status: 'In review' });
  };

  return (
    <Protect roles={['admin']}>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Creator Applications</h1>
            <p className="text-sm text-muted-foreground">
              Review and manage dataset creator applications
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or affiliation..."
              className="pl-10"
            />
          </div>
          <AsyncSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val ?? 'all')}
            options={statusOptions}
            placeholder="Filter by status"
            className="w-40 shrink-0"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ApplicationsTable
            applications={filtered}
            onViewDetails={setSelectedApp}
            onApprove={handleApprove}
            onReject={handleReject}
            onMarkInReview={handleMarkInReview}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isError={isError}
          />
        )}

        <ApplicantModal
          application={selectedApp}
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </Protect>
  );
}
