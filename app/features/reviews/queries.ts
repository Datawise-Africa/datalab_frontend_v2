import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { reviewKeys } from './query-keys';
import type { DatasetReviewType } from '~/lib/types/dataset';
import type { Paginated } from '~/lib/types';

export const useReviews = (datasetId?: string) => {
  return useQuery({
    queryKey: reviewKeys.list(datasetId),
    queryFn: async (): Promise<DatasetReviewType[]> => {
      const { data } = await apiClient.get<
        Paginated<DatasetReviewType> | DatasetReviewType[]
      >(`/datasets/${datasetId}/reviews/`);
      return Array.isArray(data) ? data : (data.data ?? []);
    },
    enabled: Boolean(datasetId),
  });
};
