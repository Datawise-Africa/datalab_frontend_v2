import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type { Paginated } from '~/lib/types/pagination';
import type { ProductValidation } from '~/lib/types/validation';
import { validationKeys } from './query-keys';

export function useValidations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: validationKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<ProductValidation>>(
        '/admin/validations/',
        { params }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
}
