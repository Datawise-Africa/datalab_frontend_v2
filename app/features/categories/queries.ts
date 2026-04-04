import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { categoryKeys } from './query-keys';
import type { Category } from '~/lib/schema';
import { categorySchema } from '~/lib/schema';
import type { Paginated } from '~/lib/types';

// Fetch all categories
export const useCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<Category>>(
        '/dataset-categories/',
        { params }
      );
      return data;
    },
  });
};

// Fetch a single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async (): Promise<Category> => {
      const { data } = await apiClient.get(`/dataset-categories/${id}/`);
      return categorySchema.parse(data);
    },
    enabled: !!id,
  });
};

// Fetch category by slug
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...categoryKeys.details(), 'slug', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Category>(
        `/dataset-categories/slug/${slug}/`
      );
      return categorySchema.parse(data);
    },
    enabled: !!slug,
  });
};
