import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import { datasetCategoriesKeys } from '@/lib/features/dataset-categories-keys';

export interface IDatasetCategory {
  id: number;
  title: string;
  // description: string;
}
export function useDatasetCategories() {
  const api = useApi().privateApi;
  const fetchDatasetCategories = useCallback(async () => {
    try {
      const response = await api.get<IDatasetCategory[]>(
        '/data/dataset-categories/',
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dataset categories:', error);
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, []);
  const datasetCategories = useQuery({
    queryKey: datasetCategoriesKeys.all,
    queryFn: fetchDatasetCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: true,
    initialData: [],
    refetchOnMount: true,
  });
  return datasetCategories;
}
