import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { reviewKeys } from './query-keys';
import { datasetKeys } from '~/features/datasets/query-keys';
import type { DatasetReviewType } from '~/lib/types/dataset';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

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
      const { dataset, ...body } = input;
      const { data } = await apiClient.post(
        `/datasets/${dataset}/reviews/`,
        body
      );
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
    onError: (error) => {
      toastUtils.error('Review failed', extractError(error));
    },
  });
};

// TODO: Review edit/delete not available in OpenAPI spec.
