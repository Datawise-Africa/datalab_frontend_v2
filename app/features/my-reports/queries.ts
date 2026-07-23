import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Report, ReportVersion } from '~/lib/types/report';
import type { MyReportDownload } from '~/lib/types/report';
import type { Paginated } from '~/lib/types/pagination';
import { myReportKeys } from './query-keys';

/** GET /my-reports/ accepts `page` and `limit` only. Includes drafts. */
interface MyReportListParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export function useMyReports(params?: MyReportListParams) {
  return useQuery({
    queryKey: myReportKeys.list(params),
    queryFn: async (): Promise<Paginated<Report>> => {
      const { data } = await apiClient.get<Paginated<Report>>('/my-reports/', {
        params,
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyReport(id: string) {
  return useQuery({
    queryKey: myReportKeys.detail(id),
    queryFn: async (): Promise<Report> => {
      const { data } = await apiClient.get<Report>(`/my-reports/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Returns a bare array, NOT the `{meta,data}` envelope the list endpoints use.
 * Verified live 2026-07-16 — do not wrap this in Paginated<>.
 */
export function useMyReportVersions(reportId: string) {
  return useQuery({
    queryKey: myReportKeys.versions(reportId),
    queryFn: async (): Promise<ReportVersion[]> => {
      const { data } = await apiClient.get<ReportVersion[]>(
        `/my-reports/${reportId}/versions/`
      );
      return data;
    },
    enabled: !!reportId,
  });
}

export function useMyReportDownloads(params?: MyReportListParams) {
  return useQuery({
    queryKey: myReportKeys.downloads(params),
    queryFn: async (): Promise<Paginated<MyReportDownload>> => {
      const { data } = await apiClient.get<Paginated<MyReportDownload>>(
        '/my-report-downloads/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
}
