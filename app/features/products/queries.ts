import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { productKeys } from './query-keys';
import type { Product, ProductList } from '~/lib/schema';
import { productListSchema, productSchema } from '~/lib/schema';

// Fetch all products
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async (): Promise<ProductList> => {
      const { data } = await apiClient.get('/products', { params });
      return productListSchema.parse(data);
    },
  });
};

// Fetch a single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async (): Promise<Product> => {
      const { data } = await apiClient.get(`/products/${id}`);
      return productSchema.parse(data);
    },
    enabled: !!id,
  });
};

// Fetch products by category
export const useProductsByCategory = (
  categoryId: string,
  params?: {
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: [...productKeys.lists(), 'category', categoryId, params],
    queryFn: async (): Promise<ProductList> => {
      const { data } = await apiClient.get(`/products/category/${categoryId}`, {
        params,
      });
      return productListSchema.parse(data);
    },
    enabled: !!categoryId,
  });
};

// Fetch product by SKU
export const useProductBySku = (sku: string) => {
  return useQuery({
    queryKey: [...productKeys.details(), 'sku', sku],
    queryFn: async (): Promise<Product> => {
      const { data } = await apiClient.get(`/products/sku/${sku}`);
      return productSchema.parse(data);
    },
    enabled: !!sku,
  });
};
