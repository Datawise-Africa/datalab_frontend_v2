import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { reviewKeys } from './query-keys';
import { datasetKeys } from '~/features/datasets/query-keys';
import type { DatasetReviewType } from '~/lib/types/dataset';

interface CreateReviewInput {
  dataset: string;
  rating: number;
  comment: string;
}

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: CreateReviewInput
    ): Promise<DatasetReviewType> => {
      const { data } = await apiClient.post('/data/reviews/', input);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.dataset),
      });
      queryClient.invalidateQueries({
        queryKey: datasetKeys.detail(variables.dataset),
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      rating,
      comment,
    }: {
      id: number;
      rating: number;
      comment: string;
      datasetId: string;
    }): Promise<DatasetReviewType> => {
      const { data } = await apiClient.patch(`/data/reviews/${id}/`, {
        rating,
        comment,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(variables.datasetId),
      });
      queryClient.invalidateQueries({
        queryKey: datasetKeys.detail(variables.datasetId),
      });
    },
  });
};
