import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { extractCorrectErrorMessage } from '@/lib/error';
import { datasetCategoriesKeys } from '@/lib/features/dataset-categories-keys';
import { useAxios } from './use-axios';

export interface IDatasetCategory {
  id: number;
  title: string;
  // description: string;
}

export function useDatasetCategories() {
  const axiosClient = useAxios();

  const fetchDatasetCategories = useCallback(async (): Promise<
    IDatasetCategory[]
  > => {
    try {
      const { data } = await axiosClient.get<IDatasetCategory[]>(
        '/data/dataset-categories/',
      );
      return data;
    } catch (error) {
      console.error('Error fetching dataset categories:', error);
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, []);

  return useQuery({
    queryKey: datasetCategoriesKeys.all,
    queryFn: fetchDatasetCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes - more readable
    retry: 2, // Specific retry count instead of boolean
    select: (data) => data ?? [], // Handle undefined data gracefully
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: 'always', // More explicit than boolean
    placeholderData: [], // Provide an empty array as initial data
  });
}
