import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetCreatorKeys } from './query-keys';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import type { DatasetStatus } from '~/lib/types/dataset';
import type { Paginated } from '~/lib/types';
import type { MyDatasetInterface } from '~/features/my-datasets/types';

/** Fetch current user's creator application status. */
export const useCreatorApplication = () => {
  return useQuery({
    queryKey: datasetCreatorKeys.application(),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<BecomeDatasetCreatorType>>(
        '/auth/creator-requests/'
      );
      // // API may return paginated { data: [] }, array, or single object
      // if (Array.isArray(data.data)) return data.data[0] ?? null;
      // if (data.data && Array.isArray(data.data)) return data.data[0] ?? null;
      return data;
    },
  });
};

interface CreatorApplicationsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

/** Admin: fetch all creator applications with pagination. */
export const useCreatorApplications = (params?: CreatorApplicationsParams) => {
  const { status, ...apiParams } = params ?? {};
  // Only send status to API if it's not 'all'
  const queryParams = {
    ...apiParams,
    ...(status && status !== 'all' ? { status } : {}),
  };

  return useQuery({
    queryKey: datasetCreatorKeys.applications(queryParams),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<BecomeDatasetCreatorType>>(
        '/auth/review-requests/',
        { params: queryParams }
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
};

interface CreatorDatasetsParams {
  status?: DatasetStatus;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
  [key: string]: unknown;
}

/** Fetch creator's own datasets by status with pagination. */
export const useCreatorDatasets = (
  statusOrParams?: DatasetStatus | CreatorDatasetsParams
) => {
  const params: CreatorDatasetsParams =
    typeof statusOrParams === 'string'
      ? { status: statusOrParams }
      : (statusOrParams ?? {});

  const apiParams: Record<string, unknown> = { ...params };
  if (!apiParams.status || apiParams.status === 'all') {
    delete apiParams.status;
  }

  return useQuery({
    queryKey: datasetCreatorKeys.myDatasets(JSON.stringify(params)),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<MyDatasetInterface>>(
        '/my-datasets/',
        { params: apiParams }
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
};

interface AnalyticsOverview {
  total_views: number;
  total_downloads: number;
  total_datasets: number;
  datasets: {
    id: string;
    title: string;
    views_count: number;
    download_count: number;
  }[];
}

/** Fetch creator analytics overview. */
export const useCreatorAnalytics = (datasetId?: string) => {
  return useQuery({
    queryKey: datasetCreatorKeys.analytics(datasetId),
    queryFn: async (): Promise<AnalyticsOverview> => {
      const url = datasetId
        ? `/data/datasets-analytics/${datasetId}/`
        : '/data/datasets-analytics/';
      const { data } = await apiClient.get(url);
      return data;
    },
  });
};

interface CreatorReport {
  date: string;
  views: number;
  downloads: number;
}

/** Fetch creator reports with date range. */
export const useCreatorReports = (params?: {
  start_date?: string;
  end_date?: string;
  metrics?: string;
}) => {
  return useQuery({
    queryKey: datasetCreatorKeys.reports(),
    queryFn: async (): Promise<CreatorReport[]> => {
      const { data } = await apiClient.get('/data/reports/', { params });
      return data;
    },
    enabled: !!params,
  });
};
