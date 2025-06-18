import DatasetUploadForm from '@/components/dataset-upload/dataset-upload-form.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  Users,
  Calendar,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { useMultipleDatasetStatuses } from '@/hooks/use-dataset-creator-datasets';
import type { IDataset } from '@/lib/types/data-set';
import { getIntendedAudienceIcon } from '@/lib/get-intended-audience-icon';
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
type TabTypes = 'drafts' | 'published' | 'archived';
export default function DatasetCreatorsDashboard() {
  const { queries } = useMultipleDatasetStatuses(
    ['AR', 'DF', 'PB'],
    {},
    { limit: 10, page: 1 },
  );
  const [activeTab, setActiveTab] = useState<TabTypes>('published');
  const tabs: TabTypes[] = ['published', 'drafts', 'archived'];
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, Albert!
            </h1>
            <p className="mt-1 text-gray-600">
              Jump back in, or start something new.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={'outline'}
              className="flex items-center gap-2 rounded-md border border-emerald-600 px-3 py-2 text-emerald-600 hover:bg-emerald-50"
            >
              <Search className="h-4 w-4" />
              Explore Datasets
            </Button>
            <DatasetUploadForm />
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
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="published">
            {/* Content for Published Datasets */}
            {queries.PB.isLoading ? (
              <DatasetSkeleton count={8} />
            ) : queries.PB.data.length === 0 ? (
              <NoDatasetsPlaceholder />
            ) : (
              queries.PB.data.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))
            )}
          </TabsContent>
          <TabsContent value="drafts">
            {/* Content for Drafts */}
            {queries.DF.isLoading ? (
              <DatasetSkeleton count={8} />
            ) : queries.DF.data.length === 0 ? (
              <NoDatasetsPlaceholder />
            ) : (
              queries.DF.data.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))
            )}
          </TabsContent>

          <TabsContent value="archived">
            {/* Content for Archived */}
            {queries.AR.isLoading ? (
              <DatasetSkeleton count={8} />
            ) : queries.AR.data.length === 0 ? (
              <NoDatasetsPlaceholder />
            ) : (
              queries.AR.data.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))
            )}
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
type DatasetCardProps = {
  dataset: IDataset;
};
function DatasetCard({ dataset }: DatasetCardProps) {
  // const extractIntendedAudience = (audience:) => {}
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {!dataset.is_premium ? (
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Free
            </span>
          ) : (
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
              {dataset.price}
            </span>
          )}
          {dataset.status && (
            <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
              <Calendar className="h-3 w-3" />
              {dataset.status === 'PB'
                ? 'Published'
                : dataset.status === 'AR'
                  ? 'Archived'
                  : 'Draft'}
            </span>
          )}
          {dataset.is_private && (
            <span className="flex items-center gap-1 rounded bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
              <Users className="h-3 w-3" />
              Private
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {dataset.title}
      </h3>
      <p className="mb-1 text-sm text-gray-600">
        {/* Dr {dataset.author} •{' '}
        <span className="text-blue-600">★ {dataset.reviews}</span> */}
        {dataset.authors.map((author, index) => (
          <span key={index}>
            {author.first_name} {author.last_name}
            {index < dataset.authors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>

      <p className="mb-4 line-clamp-2 text-sm text-gray-700">
        {dataset.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {dataset.tags.map((tag, index) => (
          <span
            key={index}
            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs text-gray-600">Available to:</p>
        <div className="flex flex-wrap gap-2">
          {getIntendedAudienceIcon(dataset.intended_audience)}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated: {dataset.updated_at}
          </span>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {/* {dataset.formats.join(', ')} ({dataset.size}) */}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {dataset.download_count}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Eye className="h-4 w-4" />
          View Details
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}

function NoDatasetsPlaceholder() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center space-y-4">
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
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map(() => (
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
      ))}
    </div>
  );
}
