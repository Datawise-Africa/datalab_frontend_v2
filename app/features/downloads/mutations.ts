import { useMutation } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';

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
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      await apiClient.post('/data/generate-otp/', { email });
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
  });
};
