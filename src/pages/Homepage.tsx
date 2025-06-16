import { useState } from 'react';
// import DatasetHeader from '../components/data-catalog/DatasetHeader';
// import FilterPanel from '../components/data-catalog/FilterPanel';
// import SortData from '../components/data-catalog/SortData';
import DatasetGrid from '../components/data-catalog/DatasetGrid';
import SingleDataModal from '../components/data-catalog/SingleDataModal';
import useDataModal from '@/store/useDataModal';
import useDownloadDataModal from '@/store/useDownloadDataModal';
import DownloadDataModal from '../components/data-catalog/DownloadDataModal';
import { useAuth } from '@/context/AuthProvider';
// import NoDataset from '@/components/Modals/DataModals/NoDataset';
// import Sidebar from './Sidebar';
import type { IDataset } from '@/lib/types/data-set';
import useDatasets from '@/hooks/use-datasets';
import DatasetFilterToolbar from '@/components/data-catalog/DatasetFilterToolbar';
import DatasetCardSkeleton from '@/components/data-catalog/DatasetCardSkeleton';

const Homepage = () => {
  // const [navUrl, setNavUrl] = useState('');
  // const [sortIsOpen, setSortIsOpen] = useState(false);
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

  return (
    <div className="flex flex-col">
      <main className="flex-1 py-8">
        <DatasetFilterToolbar
          filters={datasets.filters}
          onSearchResults={datasets.handleSearchResults}
          setFilters={(value) =>
            datasets.setFilters(
              typeof value === 'function' ? value(datasets.filters) : value,
            )
          }
          setSortOption={(value) =>
            datasets.setSort(
              typeof value === 'function' ? value(datasets.sort) : value,
            )
          }
          sortOption={datasets.sort}
          resetSearch={datasets.handleSearchReset}
        />
        {/* <NoDataset
          isOpen={datasets.isDatasetModalOpen}
          onClose={() => datasets.setIsDatasetModalOpen(false)}
          message={datasets.modalMessage}
        /> */}
        {datasets.isLoading ? (
          <DatasetCardSkeleton />
        ) : (
          <DatasetGrid
            datasets={datasets.data}
            handleSingleDataModal={handleSingleDataModal}
            handleDownloadDataClick={handleDownloadDataClick}
          />
        )}
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

export default Homepage;
