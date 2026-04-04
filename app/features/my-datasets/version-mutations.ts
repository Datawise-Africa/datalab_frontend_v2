import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '~/lib/api/client';
import { myDatasetKeys } from './query-keys';
import type {
  DatasetVersion,
  RequestUploadFileInput,
  PresignedUploadResponse,
  PresignedFileEntry,
  ConfirmUploadInput,
} from '~/lib/types/dataset-version';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

export type { PresignedFileEntry };

const transformFilTypePreUploadRequest = (files: RequestUploadFileInput[]) =>
  files.map((f) => ({ ...f, file_type: f.file_type.split('/')[1] }));

/* ── Interfaces ── */

interface CreateVersionInput {
  readonly datasetId: string;
  readonly version: string;
  readonly description: string;
}

interface RequestPresignedUrlsInput {
  readonly datasetId: string;
  readonly versionId: string;
  readonly files: readonly RequestUploadFileInput[];
}

interface UploadToPresignedUrlInput {
  readonly presigned: PresignedFileEntry;
  readonly file: File;
  readonly onProgress?: (percent: number) => void;
}

interface ConfirmUploadMutationInput {
  readonly datasetId: string;
  readonly versionId: string;
  readonly input: ConfirmUploadInput;
}

/* ── Mutations ── */

/**
 * Step 1: Create a version record.
 * POST /my-datasets/{dataset_pk}/versions/
 */
export const useCreateVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      datasetId,
      version,
      description,
    }: CreateVersionInput): Promise<DatasetVersion> => {
      const { data } = await apiClient.post(
        `/my-datasets/${datasetId}/versions/`,
        { version, description }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: myDatasetKeys.versions(variables.datasetId),
      });
    },
    onError: (error) => {
      toastUtils.error('Version creation failed', extractError(error));
    },
  });
};

/**
 * Step 2: Request presigned upload URLs.
 * POST /my-datasets/{dataset_pk}/versions/{id}/request-upload/
 */
export const useRequestPresignedUrls = () => {
  return useMutation({
    mutationFn: async ({
      datasetId,
      versionId,
      files,
    }: RequestPresignedUrlsInput): Promise<PresignedUploadResponse> => {
      const { data } = await apiClient.post<PresignedUploadResponse>(
        `/my-datasets/${datasetId}/versions/${versionId}/request-upload/`,
        { files: transformFilTypePreUploadRequest([...files]) }
      );
      return data;
    },
    onError: (error) => {
      toastUtils.error('Failed to get upload URLs', extractError(error));
    },
  });
};

/**
 * Upload a single file to the presigned URL.
 */
export const useUploadToPresignedUrl = () => {
  return useMutation({
    mutationFn: async ({
      presigned,
      file,
      onProgress,
    }: UploadToPresignedUrlInput): Promise<{ file_name: string }> => {
      const contentType =
        presigned.content_type ?? file.type ?? 'application/octet-stream';

      await axios.put(presigned.upload_url, file, {
        headers: {
          'Content-Type': contentType,
        },
        onUploadProgress: (event) => {
          if (!event.total || !onProgress) return;

          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
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
 * POST /my-datasets/{dataset_pk}/versions/{id}/confirm-upload/
 */
export const useConfirmUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      datasetId,
      versionId,
      input,
    }: ConfirmUploadMutationInput): Promise<DatasetVersion> => {
      const { data } = await apiClient.post(
        `/my-datasets/${datasetId}/versions/${versionId}/confirm-upload/`,
        input
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: myDatasetKeys.versions(variables.datasetId),
      });
      queryClient.invalidateQueries({
        queryKey: myDatasetKeys.detail(variables.datasetId),
      });
    },
    onError: (error) => {
      toastUtils.error('Upload confirmation failed', extractError(error));
    },
  });
};
