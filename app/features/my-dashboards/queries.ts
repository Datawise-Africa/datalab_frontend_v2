import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Dashboard, DashboardStatus } from '~/lib/types/dashboard';
import type { Paginated } from '~/lib/types';
import { myDashboardKeys } from './query-keys';

interface MyDashboardsParams {
  status?: DashboardStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
  workspace?: string;
}

export function useMyDashboards(
  params?: MyDashboardsParams,
  options?: { enabled?: boolean }
) {
  const apiParams: Record<string, unknown> = { ...params };
  if (!apiParams.status || apiParams.status === 'all') {
    delete apiParams.status;
  }
  return useQuery({
    queryKey: myDashboardKeys.list(apiParams),
    queryFn: async (): Promise<Paginated<Dashboard>> => {
      const { data } = await apiClient.get<Paginated<Dashboard>>(
        '/my-dashboards/',
        { params: apiParams }
      );
      return data;
    },
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyDashboard(id: string) {
  return useQuery({
    queryKey: myDashboardKeys.detail(id),
    queryFn: async (): Promise<Dashboard> => {
      const { data } = await apiClient.get<Dashboard>(`/my-dashboards/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
