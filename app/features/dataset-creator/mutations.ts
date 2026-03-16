import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { datasetCreatorKeys } from './query-keys';
import { datasetKeys } from '~/features/datasets/query-keys';
import type { BecomeDatasetCreatorInput } from '~/lib/schema/dataset-creator-schema';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import type { IDataset } from '~/lib/types/dataset';

/** Submit a creator application. */
export const useSubmitCreatorApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: BecomeDatasetCreatorInput
    ): Promise<BecomeDatasetCreatorType> => {
      const { data } = await apiClient.post(
        '/users/become-dataset-creator/',
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.application(),
      });
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
      await apiClient.put(`/users/become-dataset-creator/${id}/`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.applications(),
      });
    },
  });
};

/** Create a new dataset (POST /data/datasets/). */
export const useCreateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FormData): Promise<IDataset> => {
      const { data } = await apiClient.post('/data/datasets/', input, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.myDatasets(),
      });
      queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
    },
  });
};

/** Update a dataset (PUT /data/datasets/{id}/). */
export const useUpdateDataset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: FormData;
    }): Promise<IDataset> => {
      const { data } = await apiClient.put(`/data/datasets/${id}/`, input, {
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
  });
};

/** Change dataset status (PATCH /data/datasets/{id}/update-status/). */
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
      await apiClient.patch(`/data/datasets/${id}/update-status/`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datasetCreatorKeys.myDatasets(),
      });
      queryClient.invalidateQueries({ queryKey: datasetKeys.lists() });
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
  });
};
