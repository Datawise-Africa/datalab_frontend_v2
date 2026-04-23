import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { DatasetLicense } from '~/lib/types/license';
import type { Paginated } from '~/lib/types';
import { licenseKeys } from './query-keys';

export function useDatasetLicenses() {
  return useQuery({
    queryKey: licenseKeys.list(),
    queryFn: async (): Promise<DatasetLicense[]> => {
      const { data } = await apiClient.get<
        Paginated<DatasetLicense> | DatasetLicense[]
      >('/dataset-licenses/');
      return Array.isArray(data) ? data : (data.data ?? []);
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useDatasetLicense(id: string) {
  return useQuery({
    queryKey: licenseKeys.detail(id),
    queryFn: async (): Promise<DatasetLicense> => {
      const { data } = await apiClient.get<DatasetLicense>(
        `/dataset-licenses/${id}/`
      );
      return data;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}
