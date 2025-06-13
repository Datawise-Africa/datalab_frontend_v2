import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import { authorKeys } from '@/lib/features/author-keys';

export interface IAuthor {
  id: number;
  title: string | null; // Title can be null if not provided
  first_name: string;
  last_name: string;
  email: string;
  affiliation: string;
}

export function useAuthors() {
  const api = useApi().privateApi;
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await api.get<IAuthor[]>('/data/dataset-authors/');
      return response.data;
    } catch (error) {
      console.error('Error fetching licences:', error);
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, []);
  const authors = useQuery({
    queryKey: authorKeys.all,
    queryFn: fetchAuthors,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: true,
    initialData: [],
    refetchOnMount: true,
  });
  return authors;
}
