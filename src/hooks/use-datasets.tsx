import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import React, { useCallback, useEffect, useMemo } from 'react';
import useApi from './use-api';
import { datasetFiltersToSearchParams } from '@/lib/utils/dataset-filter-options-to-params';
import { useAuth } from '@/context/AuthProvider';

export type DatasetSortOptions = 'Popular' | 'Most Recent';
interface BookmarkResponse {
  id: string;
  dataset_id: string;
  user_id: string;
  created_at: string;
}
type FetchMode = 'Bookmarks' | 'Datasets';

export default function useDatasets(mode: FetchMode = 'Datasets') {
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
  const [bookmarkedDatasets, setBookmarkedDatasets] = React.useState<string[]>(
    [],
  );
  const [isBookmarksLoading, setIsBookmarksLoading] = React.useState(false);
  const { publicApi, privateApi } = useApi();
  const auth = useAuth();
  const api = auth.isAuthenticated ? privateApi : publicApi;

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsDatasetModalOpen(true);
  };

  const activeFilters = useMemo(
    () => Object.values(filters).reduce((acc, val) => acc + val.length, 0),
    [filters],
  );
  const fetchDatasets = useCallback(async () => {
    if (mode !== 'Datasets') return;
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

  // const data = useMemo(() => {
  //   const sortFuntion = (data: IDataset[]) => {
  //     return data.sort((a, b) => {
  //       if (sort === 'Popular') {
  //         return b.download_count - a.download_count;
  //       } else if (sort === 'Most Recent') {
  //         return (
  //           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //         );
  //       }
  //       return 0;
  //     });
  //   };

  //   if (activeFilters > 0) return sortFuntion(filteredDatasets);
  //   const dataToReturn =
  //     searchedDatasets.length > 0 ? searchedDatasets : datasets;
  //   return sortFuntion(dataToReturn);
  // }, [datasets, filteredDatasets, sort, searchedDatasets]);
  const handleSearchResults = (results: IDataset[]) => {
    setSearchedDatasets(results);
    setHasSearched(true);
    if (results.length === 0) {
      showModal('No datasets found for your search');
    }
  };
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

    if (mode === 'Bookmarks') {
      const bookmarked = datasets.filter((dataset) =>
        bookmarkedDatasets.includes(dataset.id.toString()),
      );
      return sortFuntion(bookmarked);
    }

    if (activeFilters > 0) return sortFuntion(filteredDatasets);
    const dataToReturn =
      searchedDatasets.length > 0 ? searchedDatasets : datasets;
    return sortFuntion(dataToReturn);
  }, [
    datasets,
    filteredDatasets,
    sort,
    searchedDatasets,
    bookmarkedDatasets,
    mode,
  ]);

  const handleSearchReset = () => {
    if (searchedDatasets.length === 0) {
      return;
    }
    setSearchedDatasets([]);
    setHasSearched(false);
  };

  // const handleBookmarkDataset = useCallback(
  //   async (datasetId: string) => {
  //     if (!auth.isAuthenticated) {
  //       alert('Please log in to bookmark datasets.');
  //       return;
  //     }

  //     const isBookmarked = bookmarkedDatasets.includes(datasetId);
  //     try {
  //       if (isBookmarked) {
  //         await privateApi.delete(`/data/saved-datasets/${datasetId}/`);
  //         setBookmarkedDatasets((prev) =>
  //           prev.filter((id) => id !== datasetId),
  //         );
  //         console.log(`✅ Bookmark removed for dataset ${datasetId}`);
  //       } else {
  //         await privateApi.post(`/data/saved-datasets/`, {
  //           dataset: datasetId,
  //         });
  //         setBookmarkedDatasets((prev) => [...prev, datasetId]);
  //         console.log(`✅ Bookmark added for dataset ${datasetId}`);
  //       }
  //     } catch (err) {
  //       console.error('Bookmark error:', err);
  //     }
  //   },
  //   [auth.isAuthenticated, bookmarkedDatasets, privateApi],
  // );
  const handleBookmarkDataset = useCallback(
    async (datasetId: string) => {
      if (!auth.isAuthenticated) {
        alert('Please log in to save datasets.');
        return;
      }
  
      if (bookmarkedDatasets.includes(datasetId)) {
        alert('This dataset is already saved.');
        return;
      }
  
      try {
        await privateApi.post(`/data/saved-datasets/`, { dataset: datasetId });
        setBookmarkedDatasets((prev) => [...prev, datasetId]);
        console.log(`✅ Bookmark added for dataset ${datasetId}`);
      } catch (err: any) {
        console.error('Bookmark error:', err);
        alert('Something went wrong while bookmarking.');
      }
    },
    [auth.isAuthenticated, bookmarkedDatasets, privateApi]
  );
  
  
  
  // Fetch user's bookmarks from backend
  const fetchBookmarks = useCallback(async () => {
    if (!auth.isAuthenticated || mode !== 'Bookmarks') return;
    setIsBookmarksLoading(true);
    try {
      const response = await privateApi.get<BookmarkResponse[]>(
        '/data/saved-datasets/',
      );
      const bookmarkIds = response.data.map((bookmark) => bookmark.dataset_id);
      setBookmarkedDatasets(bookmarkIds);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarkedDatasets([]);
    } finally {
      setIsBookmarksLoading(false);
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleShareDataset = useCallback(async (dataset: IDataset) => {
    const shareData = {
      title: `Dataset: ${dataset.title}`,
      text: `Check out this dataset: ${dataset.description.slice(0, 100)}...`,
      url: `${window.location.origin}/datasets/${dataset.id}`, // Adjust URL as needed
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        showModal('Dataset shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showModal('Dataset link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing dataset:', error);
      showModal(`Share this dataset: ${shareData.url}`);
    }
  }, []);

  // Check if dataset is bookmarked
  const isDatasetBookmarked = useCallback(
    (datasetId: string | number) => {
      return bookmarkedDatasets.includes(datasetId.toString());
    },
    [bookmarkedDatasets],
  );

  // Get bookmarked datasets
  const getBookmarkedDatasets = useMemo(() => {
    return datasets.filter((dataset) =>
      bookmarkedDatasets.includes(dataset.id.toString()),
    );
  }, [datasets, bookmarkedDatasets]);

  // Fetch bookmarked datasets from backend with full dataset details
  // const fetchBookmarkedDatasetsWithDetails = useCallback(async () => {
  //   try {
  //     const response = await api.get<IDataset[]>('/data/saved-datasets/');
  //     const data = response.data 
  //     console.log("Bookmarked datasets",data)
  //     return data;

  //   } catch (error) {
  //     console.error('Error fetching bookmarked datasets:', error);
  //     return [];
  //   }
  // }, [api]);
  // Fetch bookmarked datasets (for Bookmark mode)
  const fetchBookmarkedDatasetsWithDetails = useCallback(async () => {
    if (!auth.isAuthenticated || mode !== 'Bookmarks') return;
    setIsLoading(true);
    try {
      const response = await privateApi.get<IDataset[]>('/data/saved-datasets/');
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching bookmarked datasets:', error);
      setDatasets([]);
      console.log("Saved datasets state updated:", data);

    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, mode, privateApi]);
  
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
    handleBookmarkDataset,
    getBookmarkedDatasets,
    fetchBookmarkedDatasetsWithDetails,
    fetchBookmarks,
    isDatasetBookmarked,
    handleShareDataset,
    bookmarkedDatasets,
    isBookmarksLoading,
  };
}
