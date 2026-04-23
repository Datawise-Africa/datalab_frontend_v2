import { useMutation } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export interface RequestDownloadInput {
  dataset: string;
}

export const useRequestDownload = () => {
  return useMutation({
    mutationFn: async (input: RequestDownloadInput): Promise<void> => {
      await apiClient.post(`/datasets/${input.dataset}/request-download/`);
    },
    onError: (error) => {
      toastUtils.error('Download failed', extractError(error));
    },
  });
};

/** @deprecated Use useRequestDownload. Kept for compatibility until callers migrate. */
export const useTrackDownload = useRequestDownload;
