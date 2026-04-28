import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetAnalyticsKeys } from './query-keys';

/* ── Response types ── */

export interface TopPerformingDataset {
  id: string;
  name: string;
  slug: string;
  total_downloads: number;
  total_bookmarks: number;
  total_reviews: number;
}

export interface DatasetOverview {
  total_views: number;
  total_downloads: number;
  average_rating: number;
  total_reviews: number;
  total_bookmarks: number;
}

export interface GeographyEntry {
  download_country: string | null;
  total: number;
}

export interface IntendedUseEntry {
  intended_use: string;
  total: number;
}

export interface TrendsResponse {
  views: { view_date: string; total: number }[];
  downloads: { download_day: string; total: number }[];
}

/* ── Hooks ── */

interface TopPerformingParams extends Record<string, unknown> {
  workspace?: string;
  limit?: number;
}

/**
 * Top performing datasets (downloads/bookmarks/reviews leaderboard).
 * Pass `workspace` to scope to a specific workspace.
 */
export function useTopPerformingDatasets(params?: TopPerformingParams) {
  return useQuery({
    queryKey: datasetAnalyticsKeys.topPerforming(params),
    queryFn: async (): Promise<TopPerformingDataset[]> => {
      const { data } = await apiClient.get<TopPerformingDataset[]>(
        '/dataset-analytics/top_performing/',
        { params }
      );
      return data;
    },
    staleTime: 60 * 1000,
  });
}

export function useDatasetOverview(datasetId: string | undefined) {
  return useQuery({
    queryKey: datasetAnalyticsKeys.overview(datasetId ?? ''),
    queryFn: async (): Promise<DatasetOverview> => {
      const { data } = await apiClient.get<DatasetOverview>(
        `/dataset-analytics/${datasetId}/overview/`
      );
      return data;
    },
    enabled: !!datasetId,
    staleTime: 60 * 1000,
  });
}

export function useDatasetGeography(datasetId: string | undefined) {
  return useQuery({
    queryKey: datasetAnalyticsKeys.geography(datasetId ?? ''),
    queryFn: async (): Promise<GeographyEntry[]> => {
      const { data } = await apiClient.get<GeographyEntry[]>(
        `/dataset-analytics/${datasetId}/geography/`
      );
      return data;
    },
    enabled: !!datasetId,
    staleTime: 60 * 1000,
  });
}

export function useDatasetIntendedUse(datasetId: string | undefined) {
  return useQuery({
    queryKey: datasetAnalyticsKeys.intendedUse(datasetId ?? ''),
    queryFn: async (): Promise<IntendedUseEntry[]> => {
      const { data } = await apiClient.get<IntendedUseEntry[]>(
        `/dataset-analytics/${datasetId}/intended_use/`
      );
      return data;
    },
    enabled: !!datasetId,
    staleTime: 60 * 1000,
  });
}

export function useDatasetTrends(datasetId: string | undefined) {
  return useQuery({
    queryKey: datasetAnalyticsKeys.trends(datasetId ?? ''),
    queryFn: async (): Promise<TrendsResponse> => {
      const { data } = await apiClient.get<TrendsResponse>(
        `/dataset-analytics/${datasetId}/trends/`
      );
      return data;
    },
    enabled: !!datasetId,
    staleTime: 60 * 1000,
  });
}
