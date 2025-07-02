import { useAuth } from '@/context/AuthProvider';
import useApi from '@/hooks/use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import {
  useDatasetCreatorAnalyticsFilters,
  useSelectedDatasetId,
} from '@/store/dataset-creator-analytics-store';
import { useQuery } from '@tanstack/react-query';
import { datasetCreatorAnalyticsKeys } from './keys';
type OverviewAnalyticsType = {
  total_views: number;
  total_downloads: number;
  average_rating: number;
  total_datasets: number;
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
  daily_views: {
    view_date: string;
    views_count: number;
  }[];
};

type FormattedOverviewAnalyticsType = Record<
  string,
  {
    total: number;
    label: string;
  }
>;

type FormattedOverviewAnalyticsValueType =
  FormattedOverviewAnalyticsType[keyof FormattedOverviewAnalyticsType];

export const useDatasetCreatorAnalyticsQuery = () => {
  const { selectedDatasetId, setSelectedDatasetId } = useSelectedDatasetId();
  const { filters } = useDatasetCreatorAnalyticsFilters();
  const auth = useAuth();
  const { privateApi } = useApi();

  async function fetchDatasetCreatorAnalytics(): Promise<
    FormattedOverviewAnalyticsValueType[]
  > {
    try {
      const { data } = await privateApi.get<OverviewAnalyticsType>(
        `/data/datasets-analytics/`,
      );
      const f = Object.entries(data).reduce<FormattedOverviewAnalyticsType>(
        (acc, [key, value]) => {
          const formattedKey = key.replace(/_/g, ' ');
          acc[formattedKey] = {
            total: value as number,
            label: formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1),
          };
          return acc;
        },
        {},
      );
      return Object.values(f);
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
      const { data } = await privateApi.get<SingleDatasetViewsAnalyticsType>(
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
    enabled: !!selectedDatasetId && auth.isAuthenticated,
    refetchOnWindowFocus: false,
    placeholderData: [],
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
