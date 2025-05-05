import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DatasetHeader from "./DatasetHeader";
import SortData from "./SortData";
import DatasetGrid from "./DatasetGrid";
import Loader from "./Loader";
import apiService from "../../services/apiService";
import AuthModal from "../../components/Modals/AuthModals/AuthModal";
import SingleDataModal from "./SingleDataModal";
import useDataModal from "../../hooks/useDataModal";
import useAuthModal from "../../hooks/useAuthModal";
import useDownloadDataModal from "../../hooks/useDownloadDataModal";
import DownloadDataModal from "./DownloadDataModal";
import { useAuth } from "../../storage/AuthProvider";
import NoDataset from "../../components/Modals/DataModals/NoDataset";
import Sidebar from "./Sidebar";

const DataCatalog = () => {
  const [datasets, setDatasets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [navUrl, setNavUrl] = useState("");
  const [sortIsOpen, setSortIsOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [downloadDataset, setDownloadDataset] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [searchedDatasets, setSearchedDatasets] = useState([]);
  const [, setHasSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useAuth();
  const authModal = useAuthModal();
  const dataModal = useDataModal();
  const downloadDataModal = useDownloadDataModal();
  const pathname = useLocation();

  const [sortedData, setSortedData] = useState([...datasets]);

  const handleSort = (option) => {
    let dataToSort =
      searchedDatasets.length > 0
        ? searchedDatasets
        : filteredData.length > 0
        ? filteredData
        : datasets;

    let sorted = [...dataToSort];
    if (option === "Popular") {
      sorted.sort((a, b) => b.download_count - a.download_count);
    } else if (option === "Most Recent") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setSortedData(sorted);
  };

  useEffect(() => {
    setSortedData(
      searchedDatasets.length > 0
        ? searchedDatasets
        : filteredData.length > 0
        ? filteredData
        : datasets
    );
  }, [searchedDatasets, filteredData, datasets]);

  const [filters] = useState({});

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await apiService.get("/data/local/");
        setDatasets(response);
      } catch (error) {
        console.log("Failed to fetch datasets", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleSearchResults = (results) => {
    setSearchedDatasets(results);
    setHasSearched(true);
    if (results.length === 0) {
      showModal("No datasets found for your search");
    }
  };

  const handleSearchReset = () => {
    setSearchedDatasets([]);
    setHasSearched(false);
  };

  const handleAuthModalToggle = () => {
    if (!state.userId) {
      authModal.open();
      setNavUrl(pathname.pathname);
      return;
    }
  };

  const handleSingleDataModal = (dataset) => {
    setSelectedDataset(dataset);
    dataModal.open();
  };

  const handleDownloadDataClick = (dataset) => {
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
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen mt-18 bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
      handleAuthModalToggle={handleAuthModalToggle}

      />

      {/* Main Content */}
      <main className="ml-16 md:ml-64 w-full px-4 py-16 lg:py-8">
        <DatasetHeader
          // handleAuthModalToggle={handleAuthModalToggle}
          onSearchResults={handleSearchResults}
          onSearchReset={handleSearchReset}
        />

        <NoDataset
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
        />

        <div className="flex items-center justify-end pt-2">
          <SortData
            sortIsOpen={sortIsOpen}
            toggleDropdown={() => setSortIsOpen(!sortIsOpen)}
            onSort={handleSort}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DatasetGrid
            datasets={
              sortedData.length > 0
                ? sortedData
                : searchedDatasets.length > 0
                ? searchedDatasets
                : filteredData.length > 0
                ? filteredData
                : datasets
            }
            handleSingleDataModal={handleSingleDataModal}
            handleDownloadDataClick={handleDownloadDataClick}
          />
        </div>
      </main>

      <AuthModal navUrl={navUrl} />
      {selectedDataset && (
        <SingleDataModal
          dataset={selectedDataset}
          isOpen={dataModal.isOpen}
          close={dataModal.close}
          handleDownloadDataClick={handleDownloadDataClick}
        />
      )}
      {downloadDataset && (
        <DownloadDataModal
          dataset={downloadDataset}
          isOpen={downloadDataModal.isOpen}
          close={downloadDataModal.close}
        />
      )}
    </div>
  );
};

export default DataCatalog;
