import { useMutation } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export interface TrackDownloadInput {
  dataset: string;
  intended_use: string;
  project_description: string;
  intended_audience: string;
  email_address: string;
}

export const useTrackDownload = () => {
  return useMutation({
    mutationFn: async (input: TrackDownloadInput): Promise<void> => {
      await apiClient.post('/data/dataset_downloads/', input);
    },
    onError: (error) => {
      toastUtils.error('Download failed', extractError(error));
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      await apiClient.post('/data/generate-otp/', { email });
    },
    onError: (error) => {
      toastUtils.error('Failed to send OTP', extractError(error));
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({
      email,
      code,
    }: {
      email: string;
      code: string;
    }): Promise<{ verified: boolean }> => {
      const { data } = await apiClient.post('/data/verify-otp/', {
        email,
        code,
      });
      return data;
    },
    onError: (error) => {
      toastUtils.error('Verification failed', extractError(error));
    },
  });
};
