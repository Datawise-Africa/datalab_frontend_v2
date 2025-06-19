import { useState } from 'react';
import SingleDataModal from '../components/data-catalog/SingleDataModal';
import useDataModal from '@/store/useDataModal';
import useDownloadDataModal from '@/store/useDownloadDataModal';
import DownloadDataModal from '../components/data-catalog/DownloadDataModal';
import { useAuth } from '@/context/AuthProvider';
import type { IDataset } from '@/lib/types/data-set';
import DatasetCardSkeleton from '@/components/data-catalog/DatasetCardSkeleton';
import DatasetCard from '@/components/data-catalog/DatasetCard';
import {
  useBookmarks,
  useDatasetMapper,
} from '@/hooks/use-bookmarked-datasets';

const SavedDatasets = () => {
  const [selectedDataset, setSelectedDataset] = useState<IDataset | null>(null);
  const [downloadDataset, setDownloadDataset] = useState<IDataset | null>(null);

  const auth = useAuth();
  const { bookmarkedDatasets, isLoading, addBookmark } = useBookmarks();
  const enahancedBookmarkedDatasets = useDatasetMapper(
    bookmarkedDatasets.map((item) => item.dataset),
  );
  const dataModal = useDataModal();
  const downloadDataModal = useDownloadDataModal();

  const handleSingleDataModal = (dataset: IDataset) => {
    setSelectedDataset(dataset);
    dataModal.open();
  };

  const handleDownloadDataClick = (dataset: IDataset) => {
    if (!auth.isAuthenticated) {
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
        {isLoading ? (
          <DatasetCardSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {enahancedBookmarkedDatasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                handleDownloadDataClick={handleDownloadDataClick}
                handleSingleDataModal={handleSingleDataModal}
                handleBookmarkDataset={addBookmark}
              />
            ))}
          </div>
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
