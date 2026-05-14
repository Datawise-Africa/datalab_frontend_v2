import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { IEdukenDataStructure } from '~/lib/types/edu-ken';
import type { Dashboard } from '~/lib/types/dashboard';
import type { Paginated } from '~/lib/types';
import { dashboardQueryKeys } from './query-keys';

interface DashboardListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  workspace?: string;
  [key: string]: unknown;
}

export function useDashboards(params?: DashboardListParams) {
  return useQuery({
    queryKey: dashboardQueryKeys.list(params),
    queryFn: async (): Promise<Paginated<Dashboard>> => {
      const { data } = await apiClient.get<Paginated<Dashboard>>(
        '/dashboards/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboard(id: string) {
  return useQuery({
    queryKey: dashboardQueryKeys.detail(id),
    queryFn: async (): Promise<Dashboard> => {
      const { data } = await apiClient.get<Dashboard>(`/dashboards/${id}/`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

function uppercaseCountyKeys(data: IEdukenDataStructure): IEdukenDataStructure {
  return {
    qualifications_per_county: Object.fromEntries(
      Object.entries(data.qualifications_per_county).map(([k, v]) => [
        k.toUpperCase(),
        v,
      ])
    ),
    institutions_per_county: Object.fromEntries(
      Object.entries(data.institutions_per_county).map(([k, v]) => [
        k.toUpperCase(),
        v,
      ])
    ),
    categories_per_county: Object.fromEntries(
      Object.entries(data.categories_per_county).map(([k, v]) => [
        k.toUpperCase(),
        v,
      ])
    ),
  };
}

export function useEdukenData() {
  return useQuery({
    queryKey: dashboardQueryKeys.eduken(),
    queryFn: async () => {
      const { data } = await apiClient.get<IEdukenDataStructure>(
        '/data/edu_dashboard_data/'
      );
      return uppercaseCountyKeys(data);
    },
  });
}
