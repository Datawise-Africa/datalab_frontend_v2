import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatasetGrid from './DatasetGrid';
import apiService from '@/services/apiService';
import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import SingleDataModal from './SingleDataModal';
import useDataModal from '@/hooks/useDataModal';
import { useAuthModal } from '@/hooks/useAuthModal';
import useDownloadDataModal from '@/hooks/useDownloadDataModal';
import DownloadDataModal from './DownloadDataModal';
import NoDataset from '@/components/Modals/DataModals/NoDataset';
import { DatasetsLoader } from '@/components/DatasetsLoader';
import useDatasets from '@/hooks/use-datasets';
import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import DatasetToolBar from '@/components/DatasetToolBar';
import { useAuth } from '@/hooks/use-auth';
import { datasetFilterOptions } from '@/lib/data/dataset-filter-options';
export default function DatasetPage() {
  const { datasets, isLoading } = useDatasets();
  const [filteredData, setFilteredData] = useState<IDataset[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [navUrl, setNavUrl] = useState('');
  // const [sortIsOpen, setSortIsOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<IDataset | null>(null);
  const [downloadDataset, setDownloadDataset] = useState<IDataset | null>(null);
  const [modalMessage, setModalMessage] = useState('');
  const [searchedDatasets, setSearchedDatasets] = useState<IDataset[]>([]);
  const [, setHasSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useAuth();
  const authModal = useAuthModal();
  const dataModal = useDataModal();
  const downloadDataModal = useDownloadDataModal();
  const pathname = useLocation();

  const [sortedData, setSortedData] = useState([...datasets]);

  const handleSort = (option: 'Popular' | 'Most Recent') => {
    let dataToSort =
      searchedDatasets.length > 0
        ? searchedDatasets
        : // : filteredData.length > 0
          // ? filteredData
          datasets;

    let sorted = [...dataToSort];
    if (option === 'Popular') {
      sorted.sort((a, b) => b.download_count - a.download_count);
    } else if (option === 'Most Recent') {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    setSortedData(sorted);
  };

  useEffect(() => {
    setSortedData(
      searchedDatasets.length > 0
        ? searchedDatasets
        : filteredData.length > 0
          ? filteredData
          : datasets,
    );
  }, [searchedDatasets, filteredData, datasets]);

  //   Filter state
  const [filters, setFilters] = useState<DatasetFilterOptions>({
    accessLevel: [],
    dataType: [],
    region: [],
    timeframe: [],
  });

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        let filteredData = datasets;

        // Correct API endpoints for each category
        const endpoints = {
          accessLevel: '/data/filter/access-level/',
          dataType: '/data/filter/datatype/',
          region: '/data/filter/region/',
          timeframe: '/data/filter/timeframe/',
        } as Record<keyof DatasetFilterOptions, string>;

        // Correct query parameter mappings
        const queryKeys = {
          accessLevel: 'access_level',
          dataType: 'datatype',
          region: 'region',
          timeframe: 'timeframe',
        } as Record<keyof DatasetFilterOptions, string>;

        for (const [category, values] of Object.entries(filters)) {
          if (values.length > 0) {
            const queryKey = queryKeys[category];

            // Reverse map user-friendly values back to original values
            const originalValues = values.map((userFriendlyValue) => {
              const mapping = Object.entries(
                datasetFilterOptions[
                  category as keyof typeof datasetFilterOptions
                ] || {},
              ).find(([, value]) => value === userFriendlyValue);
              return mapping ? mapping[0] : userFriendlyValue;
            });

            const queryString = originalValues
              .map((value) => `${queryKey}=${encodeURIComponent(value)}`)
              .join('&');

            const url = `${endpoints[category]}?${queryString}`;

            const response = await apiService.get<IDataset[]>(url);

            if (response && response.length > 0) {
              filteredData = filteredData.filter((item) =>
                response.some((responseDataItem) => {
                  // Condition to check if 'item' matches 'responseDataItem'
                  // Example: Assuming your items have an 'id' property
                  return item.id === responseDataItem.id; // Adjust as needed
                }),
              );
            } else {
              const noDataMessage = `No data available under category ${values} yet`;
              console.warn(noDataMessage);
              showModal(noDataMessage);
            }
          }
        }

        setFilteredData(filteredData.length > 0 ? filteredData : datasets);
      } catch (error) {
        const noDataMessage = `No data available under this category yet`;
        console.error('Error fetching filtered data:', error);
        showModal(noDataMessage);
      }
    };

    fetchFilteredData();
  }, [filters, datasets]);

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleSearchResults = (results: IDataset[]) => {
    setSearchedDatasets(results);
    setHasSearched(true);
    if (results.length === 0) {
      showModal('No datasets found for your search');
    }
  };

  const handleSearchReset = () => {
    setSearchedDatasets([]);
    setHasSearched(false);
  };

  const handleSingleDataModal = (dataset: IDataset) => {
    setSelectedDataset(dataset);
    dataModal.open();
  };

  const handleDownloadDataClick = (dataset: IDataset) => {
    if (!state.userId) {
      authModal.open();
      setNavUrl(pathname.pathname);
      return;
    } else {
      setDownloadDataset(dataset);
      downloadDataModal.open();
    }
  };
  if (isLoading) {
    return <DatasetsLoader />;
  }
  return (
    <div className="flex h-[calc(100vh-3rem)] mt-[3rem] ">
      {/* <Sidebar handleAuthModalToggle={handleAuthModalToggle} /> */}

      <main className="flex-1 overflow-y-auto px-6 py-6 ">
        <DatasetToolBar
          filters={filters}
          setFilters={setFilters}
          handleSearchResults={handleSearchResults}
          handleSearchReset={handleSearchReset}
          handleSort={handleSort}
        />
        <NoDataset
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
        />

        <div className="  grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DatasetGrid
            datasets={
              sortedData.length > 0
                ? sortedData
                : searchedDatasets.length > 0
                  ? searchedDatasets
                  : // : filteredData.length > 0
                    // ? filteredData
                    datasets
            }
            handleSingleDataModal={handleSingleDataModal}
            handleDownloadDataClick={handleDownloadDataClick}
          />
        </div>
      </main>

      {/* Modals */}
      <AuthModal navUrl={navUrl} />
      {selectedDataset && (
        <SingleDataModal
          dataset={selectedDataset}
          // isOpen={dataModal.isOpen}
          // close={dataModal.close}
          // handleDownloadDataClick={handleDownloadDataClick}
        />
      )}
      {downloadDataset && (
        <DownloadDataModal
          dataset={downloadDataset}
          // isOpen={downloadDataModal.isOpen}
          // close={downloadDataModal.close}
        />
      )}
    </div>
  );
}
