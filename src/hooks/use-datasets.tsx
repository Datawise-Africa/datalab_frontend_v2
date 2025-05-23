import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import React, { useCallback, useEffect, useMemo } from 'react';
import useApi from './use-api';
import { datasetFilterOptions } from '@/lib/data/dataset-filter-options';

export type DatasetSortOptions = 'Popular' | 'Most Recent';

export default function useDatasets() {
  const [datasets, setDatasets] = React.useState<IDataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = React.useState<IDataset[]>(
    [],
  );
  const [searchedDatasets, setSearchedDatasets] = React.useState<IDataset[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFilteredDataLoading, setIsFilteredDataLoading] =
    React.useState(false);
  const [_, setHasSearched] = React.useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<DatasetFilterOptions>({
    accessLevel: [],
    dataType: [],
    region: [],
    timeframe: [],
  });
  const [sort, setSort] = React.useState<DatasetSortOptions>('Most Recent');
  const [modalMessage, setModalMessage] = React.useState<string>('');

  const api = useApi().publicApi;

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsDatasetModalOpen(true);
  };
  const fetchDatasets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<IDataset[]>('/data/datasets/');
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFilteredDatasets = React.useCallback(async () => {
    setIsFilteredDataLoading(true);
    try {
      let _filteredData = datasets;

      // Correct API endpoints for each category
      const endpoints: Record<string, string> = {
        accessLevel: '/data/filter/access-level/',
        dataType: '/data/filter/datatype/',
        region: '/data/filter/region/',
        timeframe: '/data/filter/timeframe/',
      };

      // Correct query parameter mappings
      const queryKeys: Record<string, string> = {
        accessLevel: 'access_level',
        dataType: 'datatype',
        region: 'region',
        timeframe: 'timeframe',
      };

      for (const [category, values] of Object.entries(filters)) {
        if (values.length > 0) {
          const queryKey = queryKeys[category];

          // Reverse map user-friendly values back to original values
          const originalValues = values.map((userFriendlyValue) => {
            const mapping = Object.entries(
              (datasetFilterOptions as unknown as Record<string, string>)[
                category
              ] || {},
            ).find(([, value]) => value === userFriendlyValue);
            return mapping ? mapping[0] : userFriendlyValue;
          });

          const queryString = originalValues
            .map((value) => `${queryKey}=${encodeURIComponent(value)}`)
            .join('&');

          const url = `${endpoints[category]}?${queryString}`;

          const { data } = await api.get<IDataset[]>(url);

          if (data && data.length > 0) {
            _filteredData = _filteredData.filter((item) =>
              data.some((responseDataItem) => {
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

      // setFilteredData(filteredData.length > 0 ? filteredData : datasets);
      setFilteredDatasets(_filteredData);
    } catch (error) {
      const noDataMessage = `No data available under this category yet`;
      console.error('Error fetching filtered data:', error);
      showModal(noDataMessage);
    } finally {
      setIsFilteredDataLoading(false);
    }
  }, [datasets, filters, api]);
  const data = useMemo(() => {
    const dataToReturn =
      searchedDatasets.length > 0
        ? searchedDatasets
        : filteredDatasets.length > 0
          ? filteredDatasets
          : datasets;
    if (sort) {
      return dataToReturn.sort((a, b) => {
        if (sort === 'Popular') {
          return b.download_count - a.download_count;
        } else if (sort === 'Most Recent') {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });
    }
    return dataToReturn;
  }, [datasets, filteredDatasets, sort, searchedDatasets]);
  const handleSearchResults = (results: IDataset[]) => {
    setSearchedDatasets(results);
    setHasSearched(true);
    if (results.length === 0) {
      showModal('No datasets found for your search');
    }
  };
  const handleSearchReset = () => {
    if (searchedDatasets.length === 0) {
      return;
    }
    setSearchedDatasets([]);
    setHasSearched(false);
  };
  const pageIsLoading = useMemo(() => {
    return isLoading || isFilteredDataLoading;
  }, [isLoading, isFilteredDataLoading]);
  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);
  useEffect(() => {
    fetchFilteredDatasets();
  }, [filters]);
  // console.log({ searchedDatasets, filteredDatasets, datasets });

  return {
    data,
    isLoading: pageIsLoading,
    handleSearchResults,
    handleSearchReset,
    isDatasetModalOpen,
    setIsDatasetModalOpen,
    modalMessage,
    setSort,
    setFilters,
    filters,
    sort,
  };
}
