import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetCreatorKeys } from './query-keys';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import type { IDataset, DatasetStatus } from '~/lib/types/dataset';

/** Fetch current user's creator application status. */
export const useCreatorApplication = () => {
  return useQuery({
    queryKey: datasetCreatorKeys.application(),
    queryFn: async (): Promise<BecomeDatasetCreatorType | null> => {
      const { data } = await apiClient.get('/users/become-dataset-creator/');
      // API may return paginated { data: [] }, array, or single object
      if (Array.isArray(data)) return data[0] ?? null;
      if (data.data && Array.isArray(data.data)) return data.data[0] ?? null;
      return data;
    },
  });
};

/** Admin: fetch all creator applications. */
export const useCreatorApplications = () => {
  return useQuery({
    queryKey: datasetCreatorKeys.applications(),
    queryFn: async (): Promise<BecomeDatasetCreatorType[]> => {
      const { data } = await apiClient.get('/users/become-dataset-creator/');
      // API may return paginated { data: [] } or plain array
      return Array.isArray(data) ? data : (data.data ?? []);
    },
  });
};

const statusEndpoints: Record<DatasetStatus | 'all', string> = {
  all: '/data/datasets/',
  PB: '/data/datasets-published',
  DF: '/data/datasets-drafts',
  AR: '/data/datasets-archived',
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
  // Normalize to params object
  const params: CreatorDatasetsParams =
    typeof statusOrParams === 'string'
      ? { status: statusOrParams }
      : (statusOrParams ?? {});

  const status = params.status ?? 'all';
  const endpoint =
    statusEndpoints[status as DatasetStatus | 'all'] ?? statusEndpoints.all;

  // Strip status from query params sent to API
  const { status: _status, ...apiParams } = params;

  return useQuery({
    queryKey: datasetCreatorKeys.myDatasets(JSON.stringify(params)),
    queryFn: async (): Promise<{ data: IDataset[]; total: number }> => {
      const { data } = await apiClient.get(endpoint, { params: apiParams });
      if (Array.isArray(data)) {
        return { data, total: data.length };
      }
      return {
        data: data.data ?? [],
        total: data.meta?.total_docs ?? data.data?.length ?? 0,
      };
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
