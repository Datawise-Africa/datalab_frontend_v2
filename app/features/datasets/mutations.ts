import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetKeys } from './query-keys';
import { datasetCreatorKeys } from '~/features/dataset-creator/query-keys';
import type { IDataset } from '~/lib/types/dataset';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';

/** Create a new dataset (POST /datasets/). */
export const useCreateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UploadDatasetFormValues): Promise<IDataset> => {
      const { data } = await apiClient.post('/datasets/', input, {
        // headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.myDatasets(),
      });
      queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Upload failed', extractError(error));
    },
  });
};

/** Update a dataset (PUT /datasets/{id}/). */
export const useUpdateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UploadDatasetFormValues;
    }): Promise<IDataset> => {
      const { data } = await apiClient.put(`/datasets/${id}/`, input, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.myDatasets(),
      });
      queryClient.invalidateQueries({
        queryKey: datasetKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
};

/** Change dataset status (PATCH /datasets/{id}/update-status/). */
export const useUpdateDatasetStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'PB' | 'DF' | 'AR';
    }): Promise<void> => {
      await apiClient.patch(`/datasets/${id}/update-status/`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.myDatasets(),
      });
      queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Status change failed', extractError(error));
    },
  });
};

/** Delete a dataset. */
export const useDeleteDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/data/datasets-update/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.myDatasets(),
      });
      queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
};
