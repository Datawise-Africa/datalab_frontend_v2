import DatasetGrid from '../components/data-catalog/DatasetGrid';
import SingleDataModal from '../components/data-catalog/SingleDataModal';
import useDataModal from '@/store/use-data-modal';
import useDownloadDataModal from '@/store/use-download-data-modal';
import DownloadDataModal from '../components/data-catalog/DownloadDataModal';
import type { IDataset } from '@/lib/types/data-set';
import useDatasets from '@/hooks/use-datasets';
import DatasetFilterToolbar from '@/components/data-catalog/DatasetFilterToolbar';
import DatasetCardSkeleton from '@/components/data-catalog/DatasetCardSkeleton';
import { useDatasetStore } from '@/store/dataset-store';
import { useAuthContext } from '@/context/AuthProvider';
import { useAuth } from '@/store/auth-store';

const Homepage = () => {
  const {
    setDownloadDataset,
    setSelectedDataset,
    downloadDataset,
    selectedDataset,
  } = useDatasetStore();
  // const [selectedDataset, setSelectedDataset] = useState<IDataset | null>(null);
  // const [downloadDataset, setDownloadDataset] = useState<IDataset | null>(null);
  const { queue, setIsAuthModalOpen } = useAuthContext();
  const { is_authenticated } = useAuth();
  const datasets = useDatasets();
  const dataModal = useDataModal();
  const downloadDataModal = useDownloadDataModal();
  const handleSingleDataModal = (dataset: IDataset) => {
    setSelectedDataset(dataset);
    dataModal.open();
  };

  const handleDownloadDataClick = (dataset: IDataset) => {
    if (!is_authenticated) {
      queue.addToQueue([
        {
          function: setDownloadDataset,
          args: [dataset],
        },
        {
          function: downloadDataModal.open,
          args: [],
        },
      ]);
      setIsAuthModalOpen(true);
      return;
    } else {
      setDownloadDataset(dataset);
      downloadDataModal.open();
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 py-8">
        <DatasetFilterToolbar />

        {datasets.isLoading ||
        datasets.isDatasetsLoading ||
        datasets.isFilteredDataLoading ? (
          <DatasetCardSkeleton />
        ) : (
          <DatasetGrid
            datasets={datasets.data}
            handleSingleDataModal={handleSingleDataModal}
            handleDownloadDataClick={handleDownloadDataClick}
            paginationInfo={datasets.paginationInfo}
            isLoading={datasets.isLoading}
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
