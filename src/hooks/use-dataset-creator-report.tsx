import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/store/auth-store';
import { useDatasetCreatorDatasets } from './use-dataset-creator-datasets';
import {
  useDatasetCreatorReportFiltersStore,
  type DatasetCreatorReportFilters,
} from '@/store/dataset-creator-report-filters';
import { useAxios } from './use-axios';

const reportKeys = {
  datasets: ['ds-reports'] as const,
  filtered: (filters: DatasetCreatorReportFilters, session_id: string) =>
    [...reportKeys.datasets, filters, session_id] as const,
};

const queryParamSchema = z.object({
  dataset: z.array(z.string()).min(1, 'Please select at least one dataset'),
  date_range: z
    .enum(['past_month', 'past_quarter', 'past_year'])
    .default('past_month'),
  metrics: z
    .array(z.enum(['views', 'downloads', 'messages', 'ratings']))
    .min(1, 'Please select at least one metric'),
});

const defaultFormValues = {
  dataset: [],
  date_range: 'past_month' as const,
  metrics: [],
};
export type ReportsResponseData = {
  views?: number;
  downloads?: number;
  ratings?: number;
  comments?: number;
};
export default function useDatasetCreatorReport() {
  const auth = useAuth();
  const api = useAxios();
  const queryClient = useQueryClient();
  const { filters } = useDatasetCreatorReportFiltersStore();
  const { data: datasets = [] } = useDatasetCreatorDatasets('PB');

  const form = useForm({
    defaultValues: defaultFormValues,
    resolver: zodResolver(queryParamSchema),
    mode: 'all',
  });

  const fetchReports = useCallback(async () => {
    const { dataset, date_range, metrics } = form.getValues();
    const urlParams = new URLSearchParams();

    dataset.forEach((ds) => urlParams.append('dataset', ds));
    urlParams.append('date_range', date_range!);
    metrics.forEach((metric) => urlParams.append('metrics', metric));

    const { data } = await api.get<ReportsResponseData>(
      `data/reports/?${urlParams.toString()}`,
    );
    return data;
  }, [api, form]);

  const {
    data: reports,
    isLoading: isReportsLoading,
    isError: isReportsError,
    // refetch: refetchReports,
  } = useQuery({
    queryKey: reportKeys.filtered(filters, auth.session_id || ''),
    queryFn: fetchReports,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: auth.is_authenticated && form.formState.isValid,
  });

  const watchFormChanges = useCallback(() => {
    const values = form.getValues();
    useDatasetCreatorReportFiltersStore.getState().setFilters(values);
    // form.trigger();
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(watchFormChanges);
    return () => subscription.unsubscribe();
  }, [form, watchFormChanges]);

  const submitForm = form.handleSubmit((data) => {
    useDatasetCreatorReportFiltersStore.getState().setFilters(data);
  });

  const selectedDatasets = useMemo(() => {
    if (!datasets || datasets.length === 0) return [];
    return datasets.filter((ds) => filters.dataset.includes(ds.id));
  }, [datasets, filters]);

  const refreshReports = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: reportKeys.filtered(filters, auth.session_id || ''),
    });
  }, [queryClient, filters, auth.session_id]);
  return {
    datasets,
    reports,
    form,
    isReportsLoading,
    isReportsError,
    filters,
    submitForm,
    selectedDatasets,
    refreshReports,
  };
}
