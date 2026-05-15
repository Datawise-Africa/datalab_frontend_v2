import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { myDatasetKeys } from './query-keys';
import { workspaceKeys } from '~/features/workspaces/query-keys';
import { datasetKeys } from '~/features/datasets/query-keys';
import type { MyDatasetInterface } from './types';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';

/** Create a new dataset (POST /my-datasets/). */
export const useCreateMyDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: UploadDatasetFormValues
    ): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.post('/my-datasets/', input);
      return data;
    },
    onSuccess: (data, input) => {
      queryClient.invalidateQueries({ queryKey: myDatasetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: datasetKeys.all() });
      const workspaceId =
        (input as { workspace?: string | null })?.workspace ??
        (data as { workspace?: string | { id: string } | null })?.workspace;
      const wsId =
        typeof workspaceId === 'string'
          ? workspaceId
          : workspaceId && typeof workspaceId === 'object'
            ? workspaceId.id
            : null;
      if (wsId) {
        queryClient.invalidateQueries({
          queryKey: workspaceKeys.datasets(wsId),
        });
        queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(wsId) });
      }
      toastUtils.success('Dataset created', 'Your dataset is now available.');
    },
    onError: (error) => {
      toastUtils.error('Upload failed', extractError(error));
    },
  });
};

/** Update a dataset (PUT /my-datasets/{id}/). */
export const useUpdateMyDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UploadDatasetFormValues;
    }): Promise<MyDatasetInterface> => {
      const { data } = await apiClient.put(`/my-datasets/${id}/`, input);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: myDatasetKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: myDatasetKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: datasetKeys.all() });
      const workspaceField = (
        data as { workspace?: string | { id: string } | null }
      )?.workspace;
      const wsId =
        typeof workspaceField === 'string'
          ? workspaceField
          : workspaceField && typeof workspaceField === 'object'
            ? workspaceField.id
            : null;
      if (wsId) {
        queryClient.invalidateQueries({
          queryKey: workspaceKeys.datasets(wsId),
        });
        queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(wsId) });
      }
    },
    onError: (error) => {
      toastUtils.error('Update failed', extractError(error));
    },
  });
};

/** Change dataset status (PATCH /my-datasets/{id}/update-status/). */
export const useUpdateMyDatasetStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'PB' | 'DF' | 'AR';
    }): Promise<void> => {
      await apiClient.patch(`/my-datasets/${id}/update-status/`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: myDatasetKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: myDatasetKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toastUtils.error('Status change failed', extractError(error));
    },
  });
};

/** Delete a dataset (DELETE /my-datasets/{id}/). */
export const useDeleteMyDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/my-datasets/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myDatasetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: datasetKeys.all() });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all() });
    },
    onError: (error) => {
      toastUtils.error('Delete failed', extractError(error));
    },
  });
};
