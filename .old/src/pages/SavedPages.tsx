import { useState } from 'react';
import SingleDataModal from '../components/data-catalog/SingleDataModal';
import useDataModal from '@/store/use-data-modal';
import useDownloadDataModal from '@/store/use-download-data-modal';
import DownloadDataModal from '../components/data-catalog/DownloadDataModal';
import type { IDataset } from '@/lib/types/data-set';
import DatasetCardSkeleton from '@/components/data-catalog/DatasetCardSkeleton';
import DatasetCard from '@/components/data-catalog/DatasetCard';
import {
  useBookmarks,
  useDatasetMapper,
} from '@/hooks/use-bookmarked-datasets';
import DatasetGrid from '@/components/data-catalog/DatasetGrid';
import { BookmarksEmptyState } from '@/components/empty-state';
import { useAuth } from '@/store/auth-store';
import { useAuthContext } from '@/context/AuthProvider';

const SavedDatasets = () => {
  const [selectedDataset, setSelectedDataset] = useState<IDataset | null>(null);
  const [downloadDataset, setDownloadDataset] = useState<IDataset | null>(null);

  const auth = useAuth();
  const { queue, setIsAuthModalOpen } = useAuthContext();
  const { bookmarkedDatasets, isLoading } = useBookmarks();
  const enhancedBookmarkedDatasets = useDatasetMapper(
    bookmarkedDatasets.map((item) => item?.dataset),
  );
  const dataModal = useDataModal();
  const downloadDataModal = useDownloadDataModal();

  // Get sidebar state for responsive grid

  const handleSingleDataModal = (dataset: IDataset) => {
    setSelectedDataset(dataset);
    dataModal.open();
  };
  const authQueueMethods = (dataset: IDataset) => [
    {
      function: setDownloadDataset,
      args: [dataset],
    },
    {
      function: downloadDataModal.open,
      args: [],
    },
  ];

  const handleDownloadDataClick = (dataset: IDataset) => {
    if (!auth.is_authenticated) {
      queue.addToQueue(authQueueMethods(dataset));
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
        {isLoading ? (
          <DatasetCardSkeleton />
        ) : enhancedBookmarkedDatasets.length ? (
          <DatasetGrid
            datasets={enhancedBookmarkedDatasets}
            paginate={false}
            handleDownloadDataClick={handleDownloadDataClick}
            handleSingleDataModal={handleSingleDataModal}
            renderCards={(datasets) =>
              datasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  dataset={dataset}
                  handleDownloadDataClick={handleDownloadDataClick}
                  handleSingleDataModal={handleSingleDataModal}
                  mode="bookmark"
                />
              ))
            }
          />
        ) : (
          <BookmarksEmptyState />
        )}
      </main>
      {selectedDataset && <SingleDataModal dataset={selectedDataset} />}
      {downloadDataset && downloadDataModal.isOpen && (
        <DownloadDataModal dataset={downloadDataset} />
      )}
    </div>
  );
};

export default SavedDatasets;
