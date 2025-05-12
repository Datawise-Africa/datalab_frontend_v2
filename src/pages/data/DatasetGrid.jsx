import { useState } from 'react';
import PropTypes from 'prop-types';
import DatasetCard from './DatasetCard';

const DatasetGrid = ({ datasets, handleSingleDataModal, handleDownloadDataClick }) => {
  const datasetsPerPage = 8; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the start and end indices for slicing the datasets array
  const indexOfLastDataset = currentPage * datasetsPerPage;
  const indexOfFirstDataset = indexOfLastDataset - datasetsPerPage;
  const currentDatasets = datasets.slice(indexOfFirstDataset, indexOfLastDataset);

  const totalPages = Math.ceil(datasets.length / datasetsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className=' md:col-span-2 lg:col-span-4 lg:mt-4'>
      <div className='flex flex-wrap gap-4'>
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
      <div className='flex justify-center mt-16 ml-20'>
        <button
          className=' className="mt-8 p-2  text-[#101827] text-xl rounded-lg font-bold hover:text-green-800 transition '
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className='px-4 py-2'>{`Page ${currentPage} of ${totalPages}`}</span>
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

DatasetGrid.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSingleDataModal: PropTypes.func.isRequired,
  handleDownloadDataClick: PropTypes.func.isRequired,
};

export default DatasetGrid;
