import { useState } from 'react';
import DatasetCard from './DatasetCard';
import type { IDataset } from '@/lib/types/data-set';

type DatasetGridProps = {
  datasets: IDataset[];
  handleSingleDataModal: (dataset: IDataset) => void;
  handleDownloadDataClick: (dataset: IDataset) => void;
};

const DatasetGrid = ({
  datasets,
  handleSingleDataModal,
  handleDownloadDataClick,
}: DatasetGridProps) => {
  const datasetsPerPage = 8; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the start and end indices for slicing the datasets array
  const indexOfLastDataset = currentPage * datasetsPerPage;
  const indexOfFirstDataset = indexOfLastDataset - datasetsPerPage;
  const currentDatasets = datasets.slice(
    indexOfFirstDataset,
    indexOfLastDataset,
  );

  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="w-full">
      {currentDatasets.length > 0 ? (
        <div className="grid gap-2 md:grid-cols-2 lg:min-w-[30rem] lg:grid-cols-3 xl:grid-cols-4">
          {currentDatasets.map((dataset, index) => (
            <DatasetCard
              key={index}
              dataset={dataset}
              handleSingleDataModal={handleSingleDataModal}
              handleDownloadDataClick={handleDownloadDataClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-gray-500">No datasets available</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-16 ml-20 flex justify-center">
        <button
          className='className="mt-8 rounded-lg p-2 text-xl font-bold text-[#101827] transition hover:text-green-800'
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className='className="mt-8 rounded-lg p-2 text-xl font-bold text-[#101827] transition hover:text-green-800'
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DatasetGrid;
