import DatasetCard from './DatasetCard';
import type { IDataset } from '@/lib/types/data-set';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import type { UseDatasetReturnType } from '@/hooks/use-datasets';
import { useDatasetPagination } from '@/store/use-dataset-controls';
type DatasetGridProps = {
  datasets: IDataset[];
  handleSingleDataModal: (dataset: IDataset) => void;
  handleDownloadDataClick: (dataset: IDataset) => void;
  handleShareDataset: (dataset: IDataset) => void;
  paginationInfo: UseDatasetReturnType['paginationInfo'];
};

const DatasetGrid = ({
  datasets,
  handleSingleDataModal,
  handleDownloadDataClick,
  handleShareDataset,
  paginationInfo,
}: DatasetGridProps) => {
  const {
    changePageSize,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    pagination,
  } = useDatasetPagination();
  const {
    total_pages,
    current_page,
    start_item,
    end_item,
    has_next_page,
    has_previous_page,
    total_items,
  } = paginationInfo;

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (total_pages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page range, and last page with ellipsis
      if (current_page <= 3) {
        // Show first few pages
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(total_pages);
      } else if (current_page >= total_pages - 2) {
        // Show last few pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = total_pages - 2; i <= total_pages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = current_page - 1; i <= current_page + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(total_pages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  return (
    <div className="w-full">
      {datasets.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 py-2 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset, index) => (
            <DatasetCard
              key={index}
              dataset={dataset}
              handleSingleDataModal={handleSingleDataModal}
              handleDownloadDataClick={handleDownloadDataClick}
              handleShareDataset={handleShareDataset}
              mode="default"
              // isDatasetBookmarked={isDatasetBookmarked}
              // isBookmarksLoading={isBookmarksLoading}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-gray-500">No datasets available</p>
        </div>
      )}

      {/* Pagination Section */}
      {total_pages > 1 && (
        <div className="space-y-4">
          {/* Page Size Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={pagination.limit}
                onChange={(e) => changePageSize(Number(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Results Info */}
            <div className="text-sm text-gray-600">
              Showing {start_item} to {end_item} of {total_items} results
            </div>
          </div>

          {/* Pagination Controls */}
          <Pagination className="justify-center">
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={has_previous_page ? goToPreviousPage : undefined}
                  className={`cursor-pointer ${!has_previous_page ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => goToPage(page as number)}
                      className={`cursor-pointer ${
                        current_page === page
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    has_next_page ? goToNextPage(current_page + 1) : undefined
                  }
                  className={`cursor-pointer ${!has_next_page ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Quick Jump to Page */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-gray-600">Go to page:</span>
            <input
              type="number"
              min={1}
              max={total_pages}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt((e.target as HTMLInputElement).value);
                  if (page >= 1 && page <= total_pages) {
                    goToPage(page);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              placeholder={current_page.toString()}
            />
            <span className="text-sm text-gray-600">of {total_pages}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetGrid;
