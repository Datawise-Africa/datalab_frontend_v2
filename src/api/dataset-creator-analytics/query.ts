import { useAuth } from '@/context/AuthProvider';
import useApi from '@/hooks/use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import {
  useDatasetCreatorAnalyticsFilters,
  useSelectedDatasetId,
} from '@/store/dataset-creator-analytics-store';
import { useQuery } from '@tanstack/react-query';
import { datasetCreatorAnalyticsKeys } from './keys';
export type DatasetCreatorOverviewAnalyticsType = {
  total_views: number;
  total_downloads: number;
  average_rating: number;
  total_datasets: number;
  views_growth: number;
  downloads_growth: number;
  ratings_growth: number;
  new_datasets_growth: number;
  top_performing_datasets: {
    id: string;
    title: string;
    category: string;
    views_count: number;
    download_count: number;
    average_rating: number;
    created_at: string;
  }[];
};

export type SingleDatasetViewsAnalyticsType = {
  dataset_id: string;
  title: string;
  views: number;
  downloads: number;
  average_rating: number;
  review_count: number;
  range_start: string;
  range_end: string;
  daily_views: { view_date: string; views_count: number }[];
  daily_downloads: { download_date: string; downloads_count: number }[];
  total_comments: number;
  views_growth: number;
  downloads_growth: number;
  ratings_growth: number;
  comments_growth: number;
  intended_use_distribution: {
    label: string;
    count: number;
    percent: number;
  }[];
};

export const useDatasetCreatorAnalyticsQuery = () => {
  const { selectedDatasetId, setSelectedDatasetId } = useSelectedDatasetId();
  const { filters } = useDatasetCreatorAnalyticsFilters();
  const auth = useAuth();
  const { api } = useApi();

  async function fetchDatasetCreatorAnalytics() {
    try {
      const { data } = await api.get<DatasetCreatorOverviewAnalyticsType>(
        `/data/datasets-analytics/`,
      );

      return data;
    } catch (error) {
      throw new Error(
        extractCorrectErrorMessage(
          error,
          'Something went wrong while fetching dataset creator analytics',
        ),
      );
    }
  }

  async function fetchSelectedDatasetAnalytics() {
    try {
      const { data } = await api.get<SingleDatasetViewsAnalyticsType>(
        `/data/datasets-analytics/${selectedDatasetId}/`,
      );
      return data;
    } catch (error) {
      throw new Error(
        extractCorrectErrorMessage(
          error,
          'Something went wrong while fetching selected dataset analytics',
        ),
      );
    }
  }

  const datasetOverviewQuery = useQuery({
    queryKey: [datasetCreatorAnalyticsKeys.overview],
    queryFn: fetchDatasetCreatorAnalytics,
    enabled: auth.isAuthenticated,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
  const selectedDatasetQuery = useQuery({
    queryKey: [
      datasetCreatorAnalyticsKeys.individual(selectedDatasetId!, filters),
    ],
    queryFn: fetchSelectedDatasetAnalytics,
    enabled: !!selectedDatasetId && auth.isAuthenticated,
    refetchOnWindowFocus: false,
  });

  return {
    datasetOverviewQuery,
    selectedDatasetQuery,
    ds: {
      setSelectedDatasetId,
      selectedDatasetId,
    },
  };
};
