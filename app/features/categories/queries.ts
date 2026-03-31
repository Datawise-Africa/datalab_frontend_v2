import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { categoryKeys } from './query-keys';
import type { Category, CategoryList } from '~/lib/schema';
import { categoryListSchema, categorySchema } from '~/lib/schema';

// Fetch all categories
export const useCategories = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async (): Promise<CategoryList> => {
      const { data } = await apiClient.get('/dataset-categories', { params });
      return categoryListSchema.parse(data);
    },
  });
};

// Fetch a single category by ID
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async (): Promise<Category> => {
      const { data } = await apiClient.get(`/dataset-categories/${id}`);
      return categorySchema.parse(data);
    },
    enabled: !!id,
  });
};

// Fetch category by slug
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...categoryKeys.details(), 'slug', slug],
    queryFn: async (): Promise<Category> => {
      const { data } = await apiClient.get(`/dataset-categories/slug/${slug}`);
      return categorySchema.parse(data);
    },
    enabled: !!slug,
  });
};
