import DatasetUploadForm from '@/components/dataset-upload/dataset-upload-form.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useMultipleDatasetStatuses } from '@/hooks/use-dataset-creator-datasets';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthProvider';
import DatasetCreatorDashboardDatasetCard from '@/components/dashboard/DatasetCreatorDashboardDatasetCard';
import type { IDataset } from '@/lib/types/data-set';
import { Link } from 'react-router-dom';
type TabTypes = 'drafts' | 'published' | 'archived';

export default function DatasetCreatorsDashboard() {
  const [
    isUpdateOrCreateDatasetModalOpen,
    setIsUpdateOrCreateDatasetModalOpen,
  ] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<IDataset>(null!);
  const { queries } = useMultipleDatasetStatuses(
    ['AR', 'DF', 'PB'],
    {},
    { limit: 10, page: 1 },
  );
  const updateSelectedDatasetOnModalClose = useCallback(() => {
    if (selectedDataset) {
      // queries.PB.refetch();
      // queries.DF.refetch();
      // queries.AR.refetch();
      setSelectedDataset(null!);
    }
    // console.log('Selected dataset reset on modal close');
  }, [queries, selectedDataset]);

  const [activeTab, setActiveTab] = useState<TabTypes>('published');
  const tabs: TabTypes[] = ['published', 'drafts', 'archived'];
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuth();
  const getTabLabel = (tab: TabTypes) => {
    switch (tab) {
      case 'drafts':
        return 'Drafts';
      case 'published':
        return 'My Datasets';
      case 'archived':
        return 'Archived';
      default:
        return '';
    }
  };

  const baseDatasetClasses =
    'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  const handleEditDataset = (dataset: IDataset) => {
    setSelectedDataset(dataset);
    setIsUpdateOrCreateDatasetModalOpen(true);
  };
  const handleDeleteDataset = () => {
    // Implement delete functionality here
  };

  useEffect(() => {
    // Reset selected dataset when modal closes
    if (!isUpdateOrCreateDatasetModalOpen) {
      setSelectedDataset(null!);
    }
    return () => {
      updateSelectedDatasetOnModalClose();
    };
  }, [updateSelectedDatasetOnModalClose]);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="gap-2items-center flex flex-col justify-between md:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {auth.state.fullName}
            </h1>
            <p className="mt-1 text-gray-600">
              Jump back in, or start something new.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md border border-emerald-600 px-3 py-2 text-sm whitespace-nowrap text-emerald-600 hover:bg-emerald-50"
            >
              <Search className="h-4 w-4" />
              Explore Datasets
            </Link>
            <DatasetUploadForm
              handleToggleFormModal={setIsUpdateOrCreateDatasetModalOpen}
              isFormModalOpen={isUpdateOrCreateDatasetModalOpen}
              dataset={selectedDataset}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Search and Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search datasets"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={'outline'}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="border-none">
                <Button
                  variant="outline"
                  className="border-primary/30 flex items-center gap-2"
                >
                  <span>Sort By</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-primary/30 bg-white shadow-lg">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Relevant</DropdownMenuItem>
                <DropdownMenuItem>Date</DropdownMenuItem>
                <DropdownMenuItem>Name</DropdownMenuItem>
                <DropdownMenuItem>Downloads</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="published" className="mb-6 w-full">
          <TabsList className="border-primary/20 w-full rounded-none border-b">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                asChild
                className="border-none shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={() => setActiveTab(tab)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    'w-fit rounded-none border-none px-4 py-2 shadow-none transition-all',
                    'hover:bg-transparent hover:text-gray-800', // hover styles
                    activeTab === tab
                      ? 'text-primary border-primary border-b-2 font-medium'
                      : 'text-gray-600',
                  )}
                >
                  {getTabLabel(tab)}
                  {tab === 'published' && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({queries.PB.data.length})
                    </span>
                  )}
                  {tab === 'drafts' && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({queries.DF.data.length})
                    </span>
                  )}
                  {tab === 'archived' && (
                    <span className="ml-1 text-xs text-gray-500">
                      ({queries.AR.data.length})
                    </span>
                  )}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="published">
            <div className={baseDatasetClasses}>
              {/* Content for Published Datasets */}
              {queries.PB.isLoading ? (
                <DatasetSkeleton count={8} />
              ) : queries.PB.data.length === 0 ? (
                <NoDatasetsPlaceholder />
              ) : (
                queries.PB.data.map((dataset) => (
                  <DatasetCreatorDashboardDatasetCard
                    key={dataset.id}
                    dataset={dataset}
                    onDelete={handleDeleteDataset}
                    onEdit={handleEditDataset}
                  />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="drafts">
            <div className={baseDatasetClasses}>
              {/* Content for Drafts */}
              {queries.DF.isLoading ? (
                <DatasetSkeleton count={8} />
              ) : queries.DF.data.length === 0 ? (
                <NoDatasetsPlaceholder />
              ) : (
                queries.DF.data.map((dataset) => (
                  <DatasetCreatorDashboardDatasetCard
                    key={dataset.id}
                    dataset={dataset}
                    onDelete={handleDeleteDataset}
                    onEdit={handleEditDataset}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="archived">
            <div className={baseDatasetClasses}>
              {/* Content for Archived */}
              {queries.AR.isLoading ? (
                <DatasetSkeleton count={8} />
              ) : queries.AR.data.length === 0 ? (
                <NoDatasetsPlaceholder />
              ) : (
                queries.AR.data.map((dataset) => (
                  <DatasetCreatorDashboardDatasetCard
                    key={dataset.id}
                    dataset={dataset}
                    onEdit={handleEditDataset}
                    onDelete={handleDeleteDataset}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dataset Grid
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {datasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div> */}
      </div>
    </div>
  );
}

function NoDatasetsPlaceholder() {
  return (
    <div className="grid-sta col-start-1 col-end-[-1] mt-20 flex flex-col items-center justify-center space-y-4">
      <img
        src="/assets/datalab/datasetcreatorsimage.svg"
        alt="No datasets"
        className="mx-auto mb-6 max-h-48 object-contain"
      />
      <h2 className="mb-2 text-lg font-semibold">No datasets yet</h2>
      <p className="mx-auto mb-6 max-w-md text-sm text-gray-600">
        Start by uploading your first dataset. Once uploaded, you’ll be able to
        manage, license, and share it from your dashboard.
      </p>
    </div>
  );
}

function DatasetSkeleton({ count = 8 }) {
  return Array.from({ length: count }).map(() => (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Status badges */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-12 rounded bg-gray-200"></div>
          <div className="h-6 w-16 rounded bg-gray-200"></div>
          <div className="h-6 w-14 rounded bg-gray-200"></div>
        </div>
        <div className="h-5 w-5 rounded bg-gray-200"></div>
      </div>

      {/* Title */}
      <div className="mb-2 h-6 w-4/5 rounded bg-gray-200"></div>

      {/* Author and rating */}
      <div className="mb-4 h-4 w-3/5 rounded bg-gray-200"></div>

      {/* Description */}
      <div className="mb-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-4/5 rounded bg-gray-200"></div>
      </div>

      {/* Tags */}
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-20 rounded bg-gray-200"></div>
        <div className="h-6 w-16 rounded bg-gray-200"></div>
        <div className="h-6 w-24 rounded bg-gray-200"></div>
      </div>

      {/* Available to section */}
      <div className="mb-4">
        <div className="mb-2 h-3 w-20 rounded bg-gray-200"></div>
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded bg-gray-200"></div>
          <div className="h-4 w-18 rounded bg-gray-200"></div>
          <div className="h-4 w-14 rounded bg-gray-200"></div>
          <div className="h-4 w-12 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Updated date */}
      <div className="mb-4 h-3 w-32 rounded bg-gray-200"></div>

      {/* File info */}
      <div className="mb-4 flex gap-4">
        <div className="h-3 w-28 rounded bg-gray-200"></div>
        <div className="h-3 w-24 rounded bg-gray-200"></div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-9 flex-1 rounded-md bg-gray-200"></div>
        <div className="h-9 flex-1 rounded-md bg-gray-200"></div>
      </div>
    </div>
  ));
}
