import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import DatasetHeader from '@/components/DatasetHeader';
import React from 'react';
import FilterPanel from './DatasetFilterPanel';

type Props = {
  filters: DatasetFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
  handleSearchResults: (results: IDataset[]) => void;
  handleSearchReset: () => void;
  handleSort: (option: 'Popular' | 'Most Recent') => void;
};

function DatasetToolBar({
  filters,
  setFilters,
  handleSearchResults,
  handleSearchReset,
  handleSort,
}: Props) {
  return (
    <>
      <div className="w-full  mx-auto px-4 gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Section */}
          <div className="flex-1 w-full">
            <DatasetHeader
              onSearchResults={handleSearchResults}
              onSearchReset={handleSearchReset}
              handleSort={handleSort}
            />
          </div>
        </div>
      </div>

      <div className=" lg:flex flex-grow max-w-24xl">
        <FilterPanel filters={filters} setFilters={setFilters} />
      </div>
    </>
  );
}

export default DatasetToolBar;
