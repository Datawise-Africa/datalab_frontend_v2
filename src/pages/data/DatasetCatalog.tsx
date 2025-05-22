import { useState } from 'react';
import DatasetHeader from './DatasetHeader';
import SortData from './SortData';
import DatasetGrid from './DatasetGrid';
import FilterPanel from './FilterPanel';

import Loader from './Loader';
import SingleDataModal from './SingleDataModal';
import useDataModal from '@/store/useDataModal';
import useDownloadDataModal from '@/store/useDownloadDataModal';
import DownloadDataModal from './DownloadDataModal';
import { useAuth } from '@/context/AuthProvider';
import NoDataset from '@/components/Modals/DataModals/NoDataset';
// import Sidebar from './Sidebar';
import type { IDataset } from '@/lib/types/data-set';
import useDatasets from '@/hooks/use-datasets';

const DataCatalog = () => {
  // const [navUrl, setNavUrl] = useState('');
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<IDataset | null>(null);
  const [downloadDataset, setDownloadDataset] = useState<IDataset | null>(null);
  const auth = useAuth();
  const datasets = useDatasets();
  const dataModal = useDataModal();
  const downloadDataModal = useDownloadDataModal();
  // const pathname = useLocation();

  const handleSingleDataModal = (dataset: IDataset) => {
    setSelectedDataset(dataset);
    dataModal.open();
  };

  const handleDownloadDataClick = (dataset: IDataset) => {
    // console.log('handleDownloadDataClick', dataset);

    if (!auth.isAuthenticated) {
      // console.log('Not authenticated');
      auth.queue.addToQueue([
        {
          function: setDownloadDataset,
          args: [dataset],
        },
        {
          function: downloadDataModal.open,
          args: [],
        },
      ]);
      auth.setIsAuthModalOpen(true);
      return;
    } else {
      setDownloadDataset(dataset);
      downloadDataModal.open();
    }
  };

  if (datasets.isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col ">
      {/* <Sidebar /> */}

      <main className="flex-1  py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mb-4 max-w-24xl ">
          <DatasetHeader
            onSearchResults={datasets.handleSearchResults}
            onSearchReset={datasets.handleSearchReset}
          />

          <div className="items-center justify-center hidden lg:flex w-24 mr-0">
            <SortData
              sortIsOpen={sortIsOpen}
              toggleDropdown={() => setSortIsOpen(!sortIsOpen)}
              onSort={datasets.setSort}
            />
          </div>
        </div>

        <div className=" lg:flex flex-grow max-w-24xl">
          <FilterPanel
            filters={datasets.filters}
            setFilters={datasets.setFilters}
          />
        </div>

        <NoDataset
          isOpen={datasets.isDatasetModalOpen}
          onClose={() => datasets.setIsDatasetModalOpen(false)}
          message={datasets.modalMessage}
        />

        <DatasetGrid
          datasets={datasets.data}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />
      </main>

      {/* Modals */}
      {/* <AuthModal  /> */}
      {selectedDataset && (
        <SingleDataModal
          dataset={selectedDataset}
          // isOpen={dataModal.isOpen}
          // close={dataModal.close}
          // handleDownloadDataClick={handleDownloadDataClick}
        />
      )}
      {downloadDataset && downloadDataModal.isOpen && (
        <DownloadDataModal
          dataset={downloadDataset}
          // isOpen={downloadDataModal.isOpen}
          // close={downloadDataModal.close}
        />
      )}
    </div>
  );
};

export default DataCatalog;
