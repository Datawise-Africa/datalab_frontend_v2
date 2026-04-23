import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { DashboardCategory } from '~/lib/types/dashboard';
import type { Paginated } from '~/lib/types';
import { dashboardCategoryKeys } from './query-keys';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: unknown;
}

export function useDashboardCategories(params?: ListParams) {
  return useQuery({
    queryKey: dashboardCategoryKeys.list(params),
    queryFn: async (): Promise<Paginated<DashboardCategory>> => {
      const { data } = await apiClient.get<Paginated<DashboardCategory>>(
        '/dashboard-categories/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDashboardCategory(id: string) {
  return useQuery({
    queryKey: dashboardCategoryKeys.detail(id),
    queryFn: async (): Promise<DashboardCategory> => {
      const { data } = await apiClient.get<DashboardCategory>(
        `/dashboard-categories/${id}/`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
