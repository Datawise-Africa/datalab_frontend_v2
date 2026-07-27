import { useState, useCallback } from 'react';
import type { Route } from './+types/applications';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { ApplicationsTable } from '~/components/admin/applications-table';
import { ApplicantModal } from '~/components/admin/applicant-modal';
import { Input } from '~/components/ui/input';
import { Picker } from '~/components/ui/picker';
import { Loader2, Search, Users } from 'lucide-react';
import { useCreatorApplications } from '~/features/dataset-creator';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import { useUrlFilter } from '~/hooks/use-url-filter';
import { useUpdateApplicationStatus } from '~/features/dataset-creator/mutations';

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

const FILTER_KEY = 'applications';

export default function Applications() {
  const filter = useUrlFilter(FILTER_KEY);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const statusFilter = filter.tags['status']?.[0] ?? 'all';

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCreatorApplications({
    page,
    limit,
    search: filter.searchQuery || undefined,
    status: statusFilter,
  });

  const updateStatus = useUpdateApplicationStatus();
  const [selectedApp, setSelectedApp] =
    useState<BecomeDatasetCreatorType | null>(null);

  const applications = response?.data ?? [];
  const totalDocs = response?.meta?.total_docs ?? 0;

  const handlePageChange = useCallback((pageIndex: number) => {
    setPage(pageIndex + 1); // API uses 1-based pages
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setLimit(newSize);
    setPage(1);
  }, []);

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: string) => {
    updateStatus.mutate({ id, status: 'rejected' });
  };

  const handleMarkInReview = (id: string) => {
    updateStatus.mutate({ id, status: 'in_review' });
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
              value={filter.searchQuery}
              onChange={(e) => {
                filter.setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or affiliation..."
              className="pl-10"
            />
          </div>
          <Picker
            value={statusFilter}
            onChange={(val) => {
              filter.setTag('status', val && val !== 'all' ? [val] : []);
              setPage(1);
            }}
            items={statusOptions}
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
            applications={applications}
            onViewDetails={setSelectedApp}
            onApprove={handleApprove}
            onReject={handleReject}
            onMarkInReview={handleMarkInReview}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            isError={isError}
            serverPagination={{
              pageIndex: page - 1,
              pageSize: limit,
              totalRows: totalDocs,
              onPageChange: handlePageChange,
              onPageSizeChange: handlePageSizeChange,
            }}
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
