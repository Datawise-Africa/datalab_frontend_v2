import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetCreatorKeys } from './query-keys';
import type { BecomeDatasetCreatorInput } from '~/lib/schema/dataset-creator-schema';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

/** Submit a creator application. */
export const useSubmitCreatorApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: BecomeDatasetCreatorInput
    ): Promise<BecomeDatasetCreatorType> => {
      const { data } = await apiClient.post('/auth/creator-requests/', input, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.application(),
      });
    },
    onError: (error) => {
      toastUtils.error('Application failed', extractError(error));
    },
  });
};

/** Admin: update application status (approve/reject). */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: string;
    }): Promise<void> => {
      await apiClient.put(`/auth/review-requests/${id}/`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.applications(),
      });
    },
    onError: (error) => {
      toastUtils.error('Status update failed', extractError(error));
    },
  });
};

// Re-export dataset mutations for backward compatibility
export {
  useCreateDataset,
  useUpdateDataset,
  useDeleteDataset,
  useUpdateDatasetStatus,
} from '~/features/datasets/mutations';
