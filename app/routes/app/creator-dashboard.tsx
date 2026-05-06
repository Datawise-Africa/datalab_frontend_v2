import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Route } from './+types/creator-dashboard';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { DatasetStatusTabs } from '~/components/creator-dashboard/dataset-status-tabs';
import { DatasetList } from '~/components/creator-dashboard/dataset-list';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import { DatasetSearch } from '~/components/dataset-catalog/dataset-search';
import { AsyncSelect } from '~/components/ui/async-select';
import { Button } from '~/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '~/components/ui/empty';
import { Loader2, Plus, Database, RefreshCw } from 'lucide-react';
import {
  useMyDatasets,
  useUpdateMyDatasetStatus,
  useDeleteMyDataset,
} from '~/features/my-datasets';
import { useAppSelector } from '~/store';
import { useAppFilter } from '~/store/slices/filter-slice';
import type { DatasetStatus } from '~/lib/types/dataset';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Creator Dashboard',
    description: 'Manage your datasets',
  });
}

const sortOptions = [
  { label: 'Most Recent', value: 'created_at' },
  { label: 'Title A-Z', value: 'title' },
  { label: 'Most Downloads', value: 'download_count' },
];

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const filter = useAppFilter('creator-dashboard');
  const [activeTab, setActiveTab] = useState<DatasetStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const status = activeTab === 'all' ? undefined : activeTab;

  const {
    data: result,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useMyDatasets({
    status,
    page,
    limit,
    search: filter.searchQuery || undefined,
    sort: filter.sortBy || 'created_at',
    order: filter.sortOrder,
  });

  const datasets = result?.data ?? [];
  const total = result?.meta?.total_docs ?? 0;

  const updateStatus = useUpdateMyDatasetStatus();
  const deleteDataset = useDeleteMyDataset();

  const handleDelete = useCallback(
    (id: string) => {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Are you sure you want to delete this dataset?')
      ) {
        deleteDataset.mutate(id);
      }
    },
    [deleteDataset]
  );

  const handleEdit = useCallback(
    (id: string) => {
      navigate(`/app/edit-dataset/${id}`);
    },
    [navigate]
  );

  const handleArchive = useCallback(
    (id: string) => {
      updateStatus.mutate({ id, status: 'AR' });
    },
    [updateStatus]
  );

  const handleTabChange = (tab: DatasetStatus | 'all') => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back{user ? `, ${user.first_name}` : ''}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and publish your datasets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/datasets">Explore Datasets</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/app/upload-dataset">
                <Plus className="mr-1.5 h-4 w-4" />
                Upload Dataset
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <DatasetStatusTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Search + Sort + Refresh */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DatasetSearch
            value={filter.searchQuery}
            onChange={(q) => {
              filter.setSearchQuery(q);
              setPage(1);
            }}
            className="flex-1"
            placeholder="Search your datasets..."
          />
          <div className="flex items-center gap-2">
            <AsyncSelect
              value={filter.sortBy || 'created_at'}
              onChange={(val) => filter.setSortBy(val ?? 'created_at')}
              options={sortOptions}
              placeholder="Sort by"
              className="h-9 w-40 shrink-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>

        {/* Count + top pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                <span className="font-semibold text-foreground">
                  {total.toLocaleString()}
                </span>{' '}
                {total === 1 ? 'dataset' : 'datasets'}
              </>
            )}
          </p>
        </div>

        <PaginationControls
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <Empty className="border py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Database />
              </EmptyMedia>
              <EmptyTitle>Failed to load datasets</EmptyTitle>
              <EmptyDescription>
                Something went wrong. Please try again.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </EmptyContent>
          </Empty>
        ) : datasets.length === 0 ? (
          <Empty className="border py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Database />
              </EmptyMedia>
              <EmptyTitle>
                {filter.searchQuery
                  ? 'No matching datasets'
                  : 'No datasets yet'}
              </EmptyTitle>
              <EmptyDescription>
                {filter.searchQuery
                  ? 'Try a different search term.'
                  : 'Upload your first dataset to get started.'}
              </EmptyDescription>
            </EmptyHeader>
            {!filter.searchQuery && (
              <EmptyContent>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/app/upload-dataset">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Dataset
                  </Link>
                </Button>
              </EmptyContent>
            )}
          </Empty>
        ) : (
          <DatasetList
            datasets={datasets}
            onPreview={(id) => navigate(`/app/view-dataset/${id}`)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onArchive={handleArchive}
          />
        )}

        {/* Bottom pagination */}
        <PaginationControls
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>
    </Protect>
  );
}
