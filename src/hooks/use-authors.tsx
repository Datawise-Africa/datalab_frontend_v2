import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import { authorKeys } from '@/lib/features/author-keys';

export interface IAuthor {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  affiliation: string;
}

const initial_authors: IAuthor[] = [
  {
    id: 1,
    title: 'Dr.',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    affiliation: 'Example University',
  },
  {
    id: 2,
    title: 'Prof.',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    affiliation: 'Example University',
  },
  {
    id: 3,
    title: 'Mr.',
    first_name: 'Alice',
    last_name: 'Johnson',
    email: 'alice.johnson@example.com',
    affiliation: 'Example University',
  },
  {
    id: 4,
    title: 'Ms.',
    first_name: 'Bob',
    last_name: 'Brown',
    email: 'bob.brown@example.com',
    affiliation: 'Example University',
  },
  {
    id: 5,
    title: 'Dr.',
    first_name: 'Charlie',
    last_name: 'Davis',
    email: 'charlie.davis@example.com',
    affiliation: 'Example University',
  },
  {
    id: 6,
    title: 'Prof.',
    first_name: 'Eve',
    last_name: 'Wilson',
    email: 'eve.wilson@example.com',
    affiliation: 'Example University',
  },
  {
    id: 7,
    title: 'Mr.',
    first_name: 'Frank',
    last_name: 'Garcia',
    email: 'frank.garcia@example.com',
    affiliation: 'Example University',
  },
  {
    id: 8,
    title: 'Ms.',
    first_name: 'Grace',
    last_name: 'Martinez',
    email: 'grace.martinez@example.com',
    affiliation: 'Example University',
  },
  {
    id: 9,
    title: 'Dr.',
    first_name: 'Hank',
    last_name: 'Lopez',
    email: 'hank.lopez@example.com',
    affiliation: 'Example University',
  },
  {
    id: 10,
    title: 'Prof.',
    first_name: 'Ivy',
    last_name: 'Gonzalez',
    email: 'ivy.gonzalez@example.com',
    affiliation: 'Example University',
  },
];

export function useAuthors() {
  const api = useApi().privateApi;
  const fetchAuthors = useCallback(async () => {
    try {
      const response = await api.get<IAuthor[]>('/data/authors/');
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
    initialData: initial_authors,
    refetchOnMount: true,
  });
  return authors;
}
