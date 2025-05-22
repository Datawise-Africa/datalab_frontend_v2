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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
        {currentDatasets.map((dataset, index) => (
          <DatasetCard
            key={index}
            dataset={dataset}
            handleSingleDataModal={handleSingleDataModal}
            handleDownloadDataClick={handleDownloadDataClick}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-16 ml-20">
        <button
          className=' className="mt-8 p-2  text-[#101827] text-xl rounded-lg font-bold hover:text-green-800 transition '
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className=' className="mt-8 p-2  text-[#101827] text-xl font-bold rounded-lg  hover:text-green-800 transition '
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
