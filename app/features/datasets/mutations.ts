import { useMutation } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';

/** Fire-and-forget view tracking. */
export const useTrackDatasetView = () => {
  return useMutation({
    mutationFn: async (datasetId: string): Promise<void> => {
      await apiClient.post(`/datasets/${datasetId}/track-view/`);
    },
  });
};
