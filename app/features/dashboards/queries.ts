import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { IEdukenDataStructure } from '~/lib/types/edu-ken';
import { dashboardQueryKeys } from './query-keys';

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
