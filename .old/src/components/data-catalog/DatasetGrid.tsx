import DatasetCard from './DatasetCard';
import type { IDataset } from '@/lib/types/data-set';
import type { UseDatasetReturnType } from '@/hooks/use-datasets';
import { useDatasetPagination } from '@/store/use-dataset-controls';
import { useSidebar } from '@/store/use-sidebar-store.tsx';
import { cn } from '@/lib/utils.tsx';
import { generatePaginationPageNumbers } from '@/lib/utils/generate-pagination-page-numbers';
import React, { useState } from 'react';
import {
  Database,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';

type DatasetGridProps<T = IDataset> = {
  datasets: T[];
  handleSingleDataModal: (dataset: T) => void;
  handleDownloadDataClick: (dataset: T) => void;
  paginationInfo?: UseDatasetReturnType['paginationInfo'];
  renderCards?: (props: DatasetGridProps<T>['datasets']) => React.ReactNode;
  isLoading?: boolean;
  paginate?: boolean;
};

const DatasetGrid = <T = IDataset,>(props: DatasetGridProps<T>) => {
  const {
    datasets,
    handleSingleDataModal,
    handleDownloadDataClick,
    paginationInfo,
    isLoading = false,
    paginate = true,
  } = props;

  const {
    changePageSize,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    pagination,
  } = useDatasetPagination();

  // const {
  //   total_pages,
  //   current_page,
  //   start_item,
  //   end_item,
  //   has_next_page,
  //   has_previous_page,
  //   total_items,
  // } = paginationInfo!;

  const { isMobile, isCollapsed } = useSidebar();

  // Calculate grid columns based on sidebar state and available space
  const getGridColumns = () => {
    if (isMobile) {
      return 'grid-cols-1 min-[480px]:grid-cols-2';
    }

    if (isCollapsed) {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
    }
  };

  const handlePageSizeChange = async (newSize: number) => {
    changePageSize(newSize);
  };

  // Loading skeleton for cards
  const renderLoadingSkeleton = () => (
    <div className={cn('grid gap-2', getGridColumns())}>
      {Array.from({ length: pagination.limit || 12 }).map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-xl bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"
        >
          <div className="space-y-4 p-6">
            <div className="h-4 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="flex space-x-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Main Content Area */}
      <div className="relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
            <div className="flex items-center space-x-3 rounded-full border bg-white px-6 py-3 shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Loading datasets...
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          renderLoadingSkeleton()
        ) : datasets.length > 0 ? (
          <div
            className={cn(
              'grid gap-2 transition-all duration-300 ease-in-out',
              getGridColumns(),
            )}
            style={{
              minHeight: 'fit-content',
            }}
          >
            {props.renderCards
              ? props.renderCards(props.datasets)
              : datasets.map((dataset, index) => (
                  <DatasetCard
                    key={index}
                    dataset={dataset}
                    handleSingleDataModal={handleSingleDataModal}
                    handleDownloadDataClick={handleDownloadDataClick}
                    mode="default"
                  />
                ))}
          </div>
        ) : (
          // Enhanced Empty State
          <NoDataset />
        )}
      </div>

      {/* Enhanced Pagination Section */}
      {paginate && datasets.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <DatasetCardPagination
            changePageSize={handlePageSizeChange}
            goToNextPage={() => goToNextPage(paginationInfo!.total_pages)}
            goToPage={goToPage}
            goToPreviousPage={goToPreviousPage}
            limit={pagination.limit || 12}
            total_items={paginationInfo!.total_items}
            start_item={paginationInfo!.start_item}
            end_item={paginationInfo!.end_item}
            total_pages={paginationInfo!.total_pages}
            has_next_page={paginationInfo!.has_next_page}
            has_previous_page={paginationInfo!.has_previous_page}
            current_page={paginationInfo!.current_page}
          />
        </div>
      )}
    </div>
  );
};
function NoDataset() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20">
      <div className="relative mb-8">
        {/* Animated background circles */}
        <div className="absolute inset-0 -m-4">
          <div className="absolute top-0 left-0 h-24 w-24 animate-pulse rounded-full bg-blue-100 opacity-60" />
          <div className="animation-delay-1000 absolute top-8 right-0 h-16 w-16 animate-pulse rounded-full bg-purple-100 opacity-40" />
          <div className="animation-delay-2000 absolute bottom-0 left-8 h-12 w-12 animate-pulse rounded-full bg-green-100 opacity-50" />
        </div>

        {/* Main icon with gradient */}
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-sm">
          <Database className="text-primary/40 h-12 w-12" />
        </div>
      </div>

      <div className="max-w-md text-center">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          No datasets found
        </h3>
        <p className="mb-6 leading-relaxed text-gray-500">
          We couldn't find any datasets matching your current filters. Try
          adjusting your search criteria or explore our trending datasets.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {/*<button className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">*/}
          {/*  <Search className="h-4 w-4 mr-2" />*/}
          {/*  Browse all datasets*/}
          {/*</button>*/}
          {/*<button className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">*/}
          {/*  <TrendingUp className="h-4 w-4 mr-2" />*/}
          {/*  View trending*/}
          {/*</button>*/}
        </div>
      </div>
    </div>
  );
}
type DatasetCardPaginationProps = {
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  limit: number;
  total_items: number;
  start_item: number;
  end_item: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  current_page: number;
};

function DatasetCardPagination({
  changePageSize,
  goToNextPage,
  goToPage,
  goToPreviousPage,
  limit,
  total_items,
  start_item,
  end_item,
  total_pages,
  has_next_page,
  has_previous_page,
  current_page,
}: DatasetCardPaginationProps) {
  const [jumpPage, setJumpToPage] = useState('');

  const pageNumbers = generatePaginationPageNumbers({
    current_page,
    total_pages,
  });

  const handleJumpToPage = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= total_pages) {
      goToPage(page);
      setJumpToPage('');
    }
  };

  return (
    <div className="w-full p-4">
      {/* Top Row - Page Size & Results Info */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <select
            value={limit}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className="focus:border-primary focus:ring-primary rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-1 focus:outline-none"
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium text-gray-700">
            {start_item.toLocaleString()} - {end_item.toLocaleString()}
          </span>
          <span className="text-gray-500">of</span>
          <span className="font-medium text-gray-700">
            {total_items.toLocaleString()}
          </span>
          <span className="text-gray-500">results</span>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          {/* First Page Button (Double Chevron) */}
          <button
            onClick={() => goToPage(1)}
            disabled={current_page === 1}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${current_page === 1 ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
            title="First page"
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </button>

          {/* Previous Page Button (Single Chevron) */}
          <button
            onClick={goToPreviousPage}
            disabled={!has_previous_page}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${!has_previous_page ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && goToPage(page)}
                disabled={page === 'ellipsis'}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${current_page === page ? 'bg-primary text-white' : page === 'ellipsis' ? 'cursor-default' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {page === 'ellipsis' ? '...' : page}
              </button>
            ))}
          </div>

          {/* Next Page Button (Single Chevron) */}
          <button
            onClick={goToNextPage}
            disabled={!has_next_page}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${!has_next_page ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last Page Button (Double Chevron) */}
          <button
            onClick={() => goToPage(total_pages)}
            disabled={current_page === total_pages}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${current_page === total_pages ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
            title="Last page"
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Page Jump */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Go to</span>
          <input
            type="number"
            min={1}
            max={total_pages}
            value={jumpPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder={current_page.toString()}
          />
          <button
            onClick={handleJumpToPage}
            disabled={!jumpPage}
            className={`rounded-md px-3 py-1 ${jumpPage ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
          >
            Go
          </button>
          <span className="text-gray-500">of {total_pages}</span>
        </div>
      </div>
    </div>
  );
}
export default DatasetGrid;
