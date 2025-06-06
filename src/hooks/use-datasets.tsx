import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import React, { useCallback, useEffect, useMemo } from 'react';
import useApi from './use-api';
import { datasetFiltersToSearchParams } from '@/lib/utils/dataset-filter-options-to-params';

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

  const activeFilters = useMemo(
    () => Object.values(filters).reduce((acc, val) => acc + val.length, 0),
    [filters],
  );
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
    setFilteredDatasets([]);
    if (activeFilters === 0) {
      return;
    }
    setIsFilteredDataLoading(true);
    try {
      const filtersM = datasetFiltersToSearchParams(filters);
      const { data } = await api.get<IDataset[]>(
        '/data/filter/?' + filtersM.toString(),
      );

      if (data && data.length > 0) {
        setFilteredDatasets(data);
      }
    } catch (error) {
      const noDataMessage = `No data available under this category yet`;
      console.error('Error fetching filtered data:', error);
      showModal(noDataMessage);
    } finally {
      setIsFilteredDataLoading(false);
    }
  }, [datasets, filters, api]);
  const data = useMemo(() => {
    const sortFuntion = (data: IDataset[]) => {
      return data.sort((a, b) => {
        if (sort === 'Popular') {
          return b.download_count - a.download_count;
        } else if (sort === 'Most Recent') {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });
    };

    if (activeFilters > 0) return sortFuntion(filteredDatasets);
    const dataToReturn =
      searchedDatasets.length > 0 ? searchedDatasets : datasets;
    return sortFuntion(dataToReturn);
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
  console.log({ searchedDatasets, filteredDatasets, datasets });

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
