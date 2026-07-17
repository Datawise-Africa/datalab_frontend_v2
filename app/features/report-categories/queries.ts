import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { ReportCategory } from '~/lib/types/report';
import type { Paginated } from '~/lib/types/pagination';
import { reportCategoryKeys } from './query-keys';

/**
 * GET /report-categories/ accepts `page` and `limit` only — it has no `search`
 * param. Filtering is done client-side by the admin screen.
 */
interface ListParams {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export function useReportCategories(params?: ListParams) {
  return useQuery({
    queryKey: reportCategoryKeys.list(params),
    queryFn: async (): Promise<Paginated<ReportCategory>> => {
      const { data } = await apiClient.get<Paginated<ReportCategory>>(
        '/report-categories/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });
}

export function useReportCategory(id: string) {
  return useQuery({
    queryKey: reportCategoryKeys.detail(id),
    queryFn: async (): Promise<ReportCategory> => {
      const { data } = await apiClient.get<ReportCategory>(
        `/report-categories/${id}/`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
