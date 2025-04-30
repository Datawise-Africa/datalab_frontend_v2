import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import DatasetHeader from "./DatasetHeader";
import FilterIcon from "./FilterIcon";
import SortData from "./SortData";
import FilterPanel from "./FilterPanel";
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
  const showModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

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

  //   Filter state
  const [filters, setFilters] = useState({
    accessLevel: [],
    dataType: [],
    region: [],
    timeframe: [],
  });

  const optionMappings = useMemo(
    () => ({
      accessLevel: {
        public: "Public Access",
        non_profit: "Non-Profit",
        commercial: "Commercial",
        students: "Student",
      },
      dataType: {
        education: "Education",
        healthcare: "Healthcare",
        agriculture: "Agricultural",
        environmental: "Environmental",
      },
      region: {
        "East Africa": "East African ",
        "West Africa": "West African ",
        "North Africa": "North African ",
        "Southern Africa": "Southern African ",
      },
      timeframe: {
        "Last Year": "Past Year",
        "Last 5 Years": "Past 5 Years",
        "5+ Years": "More than 5 Years",
      },
    }),
    []
  );
  // Fetch data based on filters
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

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        let filteredData = datasets;

        // Correct API endpoints for each category
        const endpoints = {
          accessLevel: "/data/filter/access-level/",
          dataType: "/data/filter/datatype/",
          region: "/data/filter/region/",
          timeframe: "/data/filter/timeframe/",
        };

        // Correct query parameter mappings
        const queryKeys = {
          accessLevel: "access_level",
          dataType: "datatype",
          region: "region",
          timeframe: "timeframe",
        };

        for (const [category, values] of Object.entries(filters)) {
          if (values.length > 0) {
            const queryKey = queryKeys[category];

            // Reverse map user-friendly values back to original values
            const originalValues = values.map((userFriendlyValue) => {
              const mapping = Object.entries(
                optionMappings[category] || {}
              ).find(([, value]) => value === userFriendlyValue);
              return mapping ? mapping[0] : userFriendlyValue;
            });

            const queryString = originalValues
              .map((value) => `${queryKey}=${encodeURIComponent(value)}`)
              .join("&");

            const url = `${endpoints[category]}?${queryString}`;

            const response = await apiService.get(url);

            if (response && response.length > 0) {
              filteredData = filteredData.filter((item) =>
                response.some((responseDataItem) => {
                  // Condition to check if 'item' matches 'responseDataItem'
                  // Example: Assuming your items have an 'id' property
                  return item.id === responseDataItem.id; // Adjust as needed
                })
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
        console.error("Error fetching filtered data:", error);
        showModal(noDataMessage);
      }
    };

    fetchFilteredData();
  }, [optionMappings, filters, datasets]);

  if (isLoading) {
    return <Loader />;
  }

  const handleSearchResults = (results) => {
    setSearchedDatasets(results);
    setHasSearched(true);
    if (results.length === 0) {
      showModal("No datasets found for your search");
    }
  };

  // console.log({searchedDatasets})

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

  return (
    <div className="container mx-auto flex items-center py-16 lg:py-8 justify-center">
      <div className="w-full mt-15">
        <DatasetHeader
          handleAuthModalToggle={handleAuthModalToggle}
          onSearchResults={handleSearchResults}
          onSearchReset={handleSearchReset}
        />

        <NoDataset
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
        />
        <div className="flex items-center justify-between pt-2">
          <div className="hidden lg:flex">
            <FilterIcon />
          </div>

          <div className="ml-auto mr-3">
            <SortData
              sortIsOpen={sortIsOpen}
              toggleDropdown={() => setSortIsOpen(!sortIsOpen)}
              onSort={handleSort}
            />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="hidden lg:block">
            <FilterPanel filters={filters} setFilters={setFilters} />
          </div>

          <DatasetGrid
            // datasets={filteredData.length > 0 ? filteredData : datasets}
            datasets={
              sortedData.length > 0
                ? sortedData
                : searchedDatasets.length > 0
                ? searchedDatasets
                : filteredData.length > 0
                ? filteredData
                : datasets
            }
            // datasets={searchedDatasets.length > 0 ? searchedDatasets : (filteredData.length > 0 ? filteredData : datasets)}
            handleSingleDataModal={handleSingleDataModal}
            handleDownloadDataClick={handleDownloadDataClick}
          />
        </div>
      </div>
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
