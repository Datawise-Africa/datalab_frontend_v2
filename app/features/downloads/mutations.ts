import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';
import { downloadKeys } from './queries';
import { reviewKeys } from '~/features/reviews/query-keys';
import { datasetKeys } from '~/features/datasets/query-keys';
import type { DatasetReviewType } from '~/lib/types/dataset';

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

/**
 * Backend uses two synonymous "files unlocked" statuses:
 *   - `download_ready`   — initial request hit (free or already-paid)
 *   - `download_resumed` — resume-download after Paystack webhook cleared
 * Both carry the same shape. Modal treats them identically.
 */
export interface DownloadReadyResponse {
  status: 'download_ready' | 'download_resumed';
  download_id: string;
  files: DownloadFile[];
}

export interface PaymentRequiredResponse {
  status: 'payment_required';
  authorization_url: string;
  pending_id: string;
}

export type RequestDownloadResponse =
  | DownloadReadyResponse
  | PaymentRequiredResponse;

// Treat 402 (payment_required) as a non-error response so the union returns
// to the caller instead of going through onError.
const acceptPaymentRequired = (status: number) =>
  (status >= 200 && status < 300) || status === 402;

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
        body,
        { validateStatus: acceptPaymentRequired }
      );
      return data;
    },
    onError: (error) => {
      toastUtils.error('Download failed', extractError(error));
    },
  });
};

/**
 * Resume a paid download once Paystack has confirmed payment.
 * Returns `download_ready` once the webhook has cleared the pending request.
 * 404 means the pending record cannot be matched (still unpaid, expired, or
 * already consumed) — surfaced via onError so callers can re-prompt the user.
 */
export const useResumeDownload = () => {
  return useMutation({
    mutationFn: async (input: {
      pending_id: string;
    }): Promise<RequestDownloadResponse> => {
      const { data } = await apiClient.post<RequestDownloadResponse>(
        '/datasets/resume-download/',
        { pending_id: input.pending_id },
        { validateStatus: acceptPaymentRequired }
      );
      return data;
    },
  });
};

/** @deprecated Use useRequestDownload. Kept for compatibility until callers migrate. */
export const useTrackDownload = useRequestDownload;

interface ReviewDownloadInput {
  download_id: string;
  /** Dataset id is only used for cache invalidation, not the request body. */
  dataset_id?: string;
  rating: number;
  comment: string;
}

/**
 * POST /my-dataset-downloads/{download_id}/review/ — submit a review for a
 * downloaded dataset. Server links the review to the dataset via the download.
 */
export const useReviewDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: ReviewDownloadInput
    ): Promise<DatasetReviewType> => {
      const { download_id, rating, comment } = input;
      const { data } = await apiClient.post(
        `/my-dataset-downloads/${download_id}/review/`,
        { rating, comment }
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: downloadKeys.all() });
      if (variables.dataset_id) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.list(variables.dataset_id),
        });
        queryClient.invalidateQueries({
          queryKey: datasetKeys.detail(variables.dataset_id),
        });
      }
    },
    onError: (error) => {
      toastUtils.error('Review failed', extractError(error));
    },
  });
};
