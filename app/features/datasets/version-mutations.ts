import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '~/lib/api/client';
import { datasetKeys } from './query-keys';
import type {
  DatasetVersion,
  RequestUploadFileInput,
  PresignedUploadUrl,
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
    }): Promise<PresignedUploadUrl[]> => {
      const { data } = await apiClient.post(
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
      presigned: PresignedUploadUrl;
      file: File;
      onProgress?: (percent: number) => void;
    }): Promise<{ file_id: string; file_name: string; s3_key: string }> => {
      // Build multipart form with S3 presigned fields + file
      const formData = new FormData();
      for (const [key, value] of Object.entries(presigned.fields)) {
        formData.append(key, value);
      }
      formData.append('file', file);

      await axios.post(presigned.upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      });

      // The s3_key is typically the "key" field from the presigned fields
      const s3Key = presigned.fields['key'] ?? presigned.file_name;

      return {
        file_id: presigned.file_id,
        file_name: presigned.file_name,
        s3_key: s3Key,
      };
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
