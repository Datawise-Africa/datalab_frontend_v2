import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Report, ReportVersion } from '~/lib/types/report';
import type { Paginated } from '~/lib/types/pagination';
import { reportKeys } from './query-keys';

/**
 * GET /reports/ accepts `page` and `limit` only — no search, category or ordering,
 * unlike /datasets/. Do not add filter params here until the backend supports them;
 * they are silently ignored.
 *
 * Only published (status `PB`) reports appear here. Drafts are visible via
 * /my-reports/ to their owner. Verified live 2026-07-16.
 */
interface ReportListParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export function useReports(params?: ReportListParams) {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: async (): Promise<Paginated<Report>> => {
      const { data } = await apiClient.get<Paginated<Report>>('/reports/', {
        params,
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

/** Resolves by id. Slug lookup is not supported by the API. */
export function useReport(id: string) {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: async (): Promise<Report> => {
      const { data } = await apiClient.get<Report>(`/reports/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/** Returns a bare array, not a `{meta,data}` envelope. Verified live 2026-07-16. */
export function useReportVersions(reportId: string) {
  return useQuery({
    queryKey: reportKeys.versions(reportId),
    queryFn: async (): Promise<ReportVersion[]> => {
      const { data } = await apiClient.get<ReportVersion[]>(
        `/reports/${reportId}/versions/`
      );
      return data;
    },
    enabled: !!reportId,
  });
}

/**
 * One row of GET /reports/my-bookmarks/. The report is nested under `report`,
 * mirroring `BookmarkedDataset` in `~/features/bookmarks`.
 */
export interface BookmarkedReport {
  id: string;
  user: string;
  report: Report;
}

/**
 * GET /reports/my-bookmarks/ — the user's bookmarked reports.
 *
 * Returns a **bare array**, not the `{meta,data}` envelope the rest of the
 * reports API uses, and each row wraps the report rather than being one.
 * Verified live 2026-07-23; the OpenAPI spec declares a DRF
 * `{count,results}` page here and is wrong.
 *
 * Gated on auth: anonymous users have no bookmarks and the endpoint 401s.
 */
export function useBookmarkedReports(
  params?: ReportListParams,
  isAuthenticated: boolean = false
) {
  return useQuery({
    queryKey: [...reportKeys.bookmarks(), params],
    queryFn: async (): Promise<BookmarkedReport[]> => {
      const { data } = await apiClient.get<BookmarkedReport[]>(
        '/reports/my-bookmarks/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    enabled: !!isAuthenticated,
  });
}
