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

type DatasetGridProps = {
  datasets: IDataset[];
  handleSingleDataModal: (dataset: IDataset) => void;
  handleDownloadDataClick: (dataset: IDataset) => void;
  pagination: UseDatasetReturnType['pagination'];
  goToPage: UseDatasetReturnType['goToPage'];
  goToNextPage: UseDatasetReturnType['goToNextPage'];
  goToPreviousPage: UseDatasetReturnType['goToPreviousPage'];
  changePageSize: UseDatasetReturnType['changePageSize'];
};

const DatasetGrid = ({
  datasets,
  handleSingleDataModal,
  handleDownloadDataClick,
  pagination,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  changePageSize,
}: DatasetGridProps) => {
  const {
    currentPage,
    endItem,
    hasNextPage,
    hasPreviousPage,
    startItem,
    totalItems,
    itemsPerPage,
    totalPages,
  } = pagination;

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page range, and last page with ellipsis
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  console.log({ pagination });

  return (
    <div className="w-full space-y-6">
      {/* Dataset Grid */}
      {datasets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:min-w-[30rem] lg:grid-cols-3 xl:grid-cols-4">
          {datasets.map((dataset, index) => (
            <DatasetCard
              key={index}
              dataset={dataset}
              handleSingleDataModal={handleSingleDataModal}
              handleDownloadDataClick={handleDownloadDataClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-gray-500">No datasets available</p>
        </div>
      )}

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="space-y-4">
          {/* Page Size Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
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
              Showing {startItem} to {endItem} of {totalItems} results
            </div>
          </div>

          {/* Pagination Controls */}
          <Pagination className="justify-center">
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={hasPreviousPage ? goToPreviousPage : undefined}
                  className={`cursor-pointer ${!hasPreviousPage ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
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
                        currentPage === page
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
                  onClick={hasNextPage ? goToNextPage : undefined}
                  className={`cursor-pointer ${!hasNextPage ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
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
              max={totalPages}
              className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt((e.target as HTMLInputElement).value);
                  if (page >= 1 && page <= totalPages) {
                    goToPage(page);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              placeholder={currentPage.toString()}
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetGrid;
