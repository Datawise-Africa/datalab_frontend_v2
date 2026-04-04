import { useQuery } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { reviewKeys } from './query-keys';
import type { DatasetReviewType } from '~/lib/types/dataset';

export const useReviews = (datasetId?: string) => {
  return useQuery({
    queryKey: reviewKeys.list(datasetId),
    queryFn: async (): Promise<DatasetReviewType[]> => {
      const params = datasetId ? { dataset: datasetId } : {};
      const { data } = await apiClient.get('/data/reviews/', { params });
      return data;
    },
  });
};
