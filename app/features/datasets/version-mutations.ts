import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '~/lib/api/client';
import { datasetKeys } from './query-keys';
import type {
  DatasetVersion,
  RequestUploadFileInput,
  PresignedUploadResponse,
  PresignedFileEntry,
  ConfirmUploadInput,
} from '~/lib/types/dataset-version';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

/**
 * Step 1: Create a version record.
 * POST /datasets/{dataset_pk}/versions/
 */
export const useCreateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      datasetId,
      version,
      changelog,
    }: {
      datasetId: string;
      version: string;
      changelog: string;
    }): Promise<DatasetVersion> => {
      const { data } = await apiClient.post(
        `/datasets/${datasetId}/versions/`,
        { version, changelog }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: datasetKeys.detail(variables.datasetId),
      });
    },
    onError: (error) => {
      toastUtils.error('Version creation failed', extractError(error));
    },
  });
};

/**
 * Step 2: Request presigned S3 POST URLs.
 * POST /datasets/{dataset_pk}/versions/{id}/request-upload/
 *
 * Request:  { files: [{ file_name, file_size, file_type }] }
 * Response: [{ file_id, file_name, upload_url, fields }]
 */
export const useRequestPresignedUrls = () => {
  return useMutation({
    mutationFn: async ({
      datasetId,
      versionId,
      files,
    }: {
      datasetId: string;
      versionId: string;
      files: RequestUploadFileInput[];
    }): Promise<PresignedUploadResponse> => {
      const { data } = await apiClient.post<PresignedUploadResponse>(
        `/datasets/${datasetId}/versions/${versionId}/request-upload/`,
        { files }
      );
      return data;
    },
    onError: (error) => {
      toastUtils.error('Failed to get upload URLs', extractError(error));
    },
  });
};

/**
 * Upload a single file directly to S3 using a presigned POST URL.
 * Uses FormData with the S3 fields + file blob.
 */
export const useUploadToS3 = () => {
  return useMutation({
    mutationFn: async ({
      presigned,
      file,
      onProgress,
    }: {
      presigned: PresignedFileEntry;
      file: File;
      onProgress?: (percent: number) => void;
    }): Promise<{ file_name: string }> => {
      await axios.put(presigned.upload_url, file, {
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        onUploadProgress: (e) => {
          if (e.total && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      });

      return { file_name: presigned.file_name };
    },
    onError: (error) => {
      toastUtils.error('File upload failed', extractError(error));
    },
  });
};

/**
 * Step 3: Confirm uploads — register DatasetFile records.
 * POST /datasets/{dataset_pk}/versions/{id}/confirm-upload/
 *
 * Request: { files: [{ file_name, file_size, file_type, s3_key, checksum? }] }
 */
export const useConfirmUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      datasetId,
      versionId,
      input,
    }: {
      datasetId: string;
      versionId: string;
      input: ConfirmUploadInput;
    }): Promise<DatasetVersion> => {
      const { data } = await apiClient.post(
        `/datasets/${datasetId}/versions/${versionId}/confirm-upload/`,
        input
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: datasetKeys.detail(variables.datasetId),
      });
    },
    onError: (error) => {
      toastUtils.error('Upload confirmation failed', extractError(error));
    },
  });
};
