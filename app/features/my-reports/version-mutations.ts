import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '~/lib/api/client';
import type {
  ReportVersion,
  ReportRequestUploadFileInput,
  ReportPresignedUploadResponse,
  ReportPresignedFileEntry,
  ReportConfirmUploadInput,
} from '~/lib/types/report';
import { myReportKeys } from './query-keys';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';

/**
 * The report upload handshake uses the same endpoint names as datasets but a
 * DIFFERENT payload shape. Verified live 2026-07-16:
 *   - request-upload requires `mime_type`; omitting it returns
 *     "files: {'mime_type': [...'This field is required.'...]}"
 *   - the response entry carries `mime_type` + `file_format` and has no `file_type`
 *   - only PDF and DOCX are accepted; anything else returns
 *     "Unsupported report file type: <mime>"
 * Do not refactor these onto the dataset upload types — they are not the same.
 *
 * Flow:
 *   1. useCreateMyReportVersion   — POST /my-reports/{pk}/versions/
 *   2. useRequestReportUploadUrls — POST .../versions/{id}/request-upload/
 *   3. useUploadReportFileToS3    — PUT to the returned presigned upload_url
 *   4. useConfirmReportUpload     — POST .../versions/{id}/confirm-upload/
 */

/** Step 2: request presigned upload URLs. */
export function useRequestReportUploadUrls() {
  return useMutation({
    mutationFn: async ({
      reportId,
      versionId,
      files,
    }: {
      reportId: string;
      versionId: string;
      files: ReportRequestUploadFileInput[];
    }): Promise<ReportPresignedUploadResponse> => {
      const { data } = await apiClient.post<ReportPresignedUploadResponse>(
        `/my-reports/${reportId}/versions/${versionId}/request-upload/`,
        { files }
      );
      return data;
    },
    onError: (error) => {
      toastUtils.error('Failed to get upload URLs', extractError(error));
    },
  });
}

/** Step 3: PUT the file straight to storage using the presigned URL. */
export function useUploadReportFileToS3() {
  return useMutation({
    mutationFn: async ({
      presigned,
      file,
      onProgress,
    }: {
      presigned: ReportPresignedFileEntry;
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
}

/** Step 4: confirm the upload so the server registers the file records. */
export function useConfirmReportUpload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      versionId,
      input,
    }: {
      reportId: string;
      versionId: string;
      input: ReportConfirmUploadInput;
    }): Promise<ReportVersion> => {
      const { data } = await apiClient.post<ReportVersion>(
        `/my-reports/${reportId}/versions/${versionId}/confirm-upload/`,
        input
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: myReportKeys.versions(variables.reportId),
      });
      queryClient.invalidateQueries({
        queryKey: myReportKeys.detail(variables.reportId),
      });
    },
    onError: (error) => {
      toastUtils.error('Upload confirmation failed', extractError(error));
    },
  });
}
