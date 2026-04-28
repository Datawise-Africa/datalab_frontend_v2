import { useMutation } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export interface RequestDownloadInput {
  dataset: string;
  intended_use: string;
  /** Optional version id; backend defaults to latest when omitted. */
  version?: string;
}

export interface DownloadFile {
  file_id: string;
  file_name: string;
  file_size: number;
  download_url: string;
  expires_in: number;
}

export interface RequestDownloadResponse {
  download_id: string;
  files: DownloadFile[];
}

export const useRequestDownload = () => {
  return useMutation({
    mutationFn: async (
      input: RequestDownloadInput
    ): Promise<RequestDownloadResponse> => {
      const body: Record<string, unknown> = {
        intended_use: input.intended_use,
      };
      if (input.version) body.version = input.version;
      const { data } = await apiClient.post<RequestDownloadResponse>(
        `/datasets/${input.dataset}/request-download/`,
        body
      );
      return data;
    },
    onError: (error) => {
      toastUtils.error('Download failed', extractError(error));
    },
  });
};

/** @deprecated Use useRequestDownload. Kept for compatibility until callers migrate. */
export const useTrackDownload = useRequestDownload;
