import { useAuth } from '@/store/auth-store';
import { useDatasetCreatorDatasets } from './use-dataset-creator-datasets';
import {
  useDatasetCreatorReportFiltersStore,
  type DatasetCreatorReportFilters,
} from '@/store/dataset-creator-report-filters';
import { useQuery } from '@tanstack/react-query';

const reportKeys = {
  datasets: ['ds-reports'] as const,
  filtered: (filters: DatasetCreatorReportFilters, session_id: string) =>
    [reportKeys.datasets, filters, session_id] as const,
};

export default function useDatasetCreatorReport() {
  const { filters, } = useDatasetCreatorReportFiltersStore();
  const { data } = useDatasetCreatorDatasets('PB');
  const auth = useAuth();

  function fetchReports() {
    // This function can be used to fetch reports based on the current filters
    // For now, it just returns the datasets
    return [];
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
    enabled: auth.is_authenticated,
  });

  return {
    datasets: data || [],
    reports,
    isReportsLoading,
    isReportsError,
    filters,
  };
}
