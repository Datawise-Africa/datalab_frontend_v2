// import PropTypes from "prop-types";

import type { IDataset } from '@/lib/types/data-set';
import SearchDatasets from '../pages/data/SearchDatasets';
import SortData from './DatasetSortData';
// import { useAuth } from "../../storage/AuthProvider";
// import datalab from "/assets/datalab-logo-dark.svg";
// import user_icon from "/assets/user.svg";

type DatasetHeaderProps = {
  handleAuthModalToggle?: () => void;
  onSearchResults: (results: IDataset[]) => void;
  onSearchReset: (results: any[]) => void;
  handleSort: (option: 'Popular' | 'Most Recent') => void;
};

const DatasetHeader = ({
  // handleAuthModalToggle,
  onSearchResults,
  onSearchReset,
  handleSort,
}: DatasetHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex flex-grow w-full gap-4">
        <SearchDatasets
          onSearchResults={onSearchResults}
          onSearchReset={onSearchReset}
          className="w-full"
        />
        {/* Sort Section */}
        <div className="flex items-center justify-start lg:justify-end">
          <SortData onSort={handleSort} />
        </div>
      </div>
    </div>
  );
};

export default DatasetHeader;
