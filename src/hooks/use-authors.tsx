import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import { authorKeys } from '@/lib/features/author-keys';

export interface IFormAuthor {
  id: number;
  title: string | null;
  first_name: string;
  last_name: string;
  email: string;
  affiliation: string;
}

export function useAuthors() {
  const { api } = useApi();

  const fetchAuthors = useCallback(async (): Promise<IFormAuthor[]> => {
    try {
      const { data } = await api.get<IFormAuthor[]>('/data/dataset-authors/');
      return data;
    } catch (error) {
      // Fixed typo: "licences" -> "authors"
      console.error('Error fetching authors:', error);
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, [api]);

  return useQuery({
    queryKey: authorKeys.all,
    queryFn: fetchAuthors,
    staleTime: 5 * 60 * 1000, // 5 minutes - more readable
    retry: 2, // Specific retry count instead of boolean
    select: (data) => data ?? [], // Handle undefined data gracefully
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: 'always', // More explicit than boolean
    placeholderData: [], // Provide an empty array as initial data
  });
}
