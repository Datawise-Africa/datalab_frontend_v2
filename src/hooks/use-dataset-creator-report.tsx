import { useAuth } from '@/store/auth-store';
import { useDatasetCreatorDatasets } from './use-dataset-creator-datasets';
import {
  useDatasetCreatorReportFiltersStore,
  type DatasetCreatorReportFilters,
} from '@/store/dataset-creator-report-filters';
import { useQuery } from '@tanstack/react-query';
import { useAxios } from './use-axios';

const reportKeys = {
  datasets: ['ds-reports'] as const,
  filtered: (filters: DatasetCreatorReportFilters, session_id: string) =>
    [reportKeys.datasets, filters, session_id] as const,
};

export default function useDatasetCreatorReport() {
  const { filters, getEncodedURLParams } =
    useDatasetCreatorReportFiltersStore();
  const { data } = useDatasetCreatorDatasets('PB');
  const auth = useAuth();
  const api = useAxios();

  async function fetchReports() {
    // This function can be used to fetch reports based on the current filters
    // For now, it just returns the datasets
    const { data } = await api.get('data/reports/?' + getEncodedURLParams());
    return data;
  }

  const {
    data: reports,
    isLoading: isReportsLoading,
    isError: isReportsError,
  } = useQuery({
    queryKey: reportKeys.filtered(filters, auth.session_id || ''),
    queryFn: fetchReports,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: auth.is_authenticated && filters.dataset.length > 0,
  });

  return {
    datasets: data || [],
    reports,
    isReportsLoading,
    isReportsError,
    filters,
  };
}
