import { useState, useCallback } from 'react';
import {
  useCreateVersion,
  useRequestPresignedUrls,
  useUploadToS3,
  useConfirmUpload,
} from '~/features/datasets/version-mutations';
import type { PresignedUploadUrl } from '~/lib/types/dataset-version';
import { toastUtils } from '~/lib/utils/toast';

export type UploadStep =
  | 'idle'
  | 'creating-version'
  | 'requesting-urls'
  | 'uploading'
  | 'confirming'
  | 'done'
  | 'error';

interface FileProgress {
  file_name: string;
  percent: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

/**
 * Orchestrates the full versioned presigned-URL upload flow:
 *
 * 1. POST .../versions/              → create version record
 * 2. POST .../versions/{id}/request-upload/  → get presigned S3 POST URLs
 * 3. POST each file to S3 via presigned URL  → direct upload
 * 4. POST .../versions/{id}/confirm-upload/  → register DatasetFile records
 */
export function useVersionedUpload() {
  const [step, setStep] = useState<UploadStep>('idle');
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([]);
  const [overallPercent, setOverallPercent] = useState(0);

  const createVersion = useCreateVersion();
  const requestUrls = useRequestPresignedUrls();
  const uploadToS3 = useUploadToS3();
  const confirmUpload = useConfirmUpload();

  const isPending = step !== 'idle' && step !== 'done' && step !== 'error';

  const reset = useCallback(() => {
    setStep('idle');
    setFileProgress([]);
    setOverallPercent(0);
  }, []);

  const start = useCallback(
    async ({
      datasetId,
      version,
      changelog,
      files,
    }: {
      datasetId: string;
      version: string;
      changelog: string;
      files: File[];
    }) => {
      if (files.length === 0) {
        toastUtils.error('No files', 'Please select at least one file.');
        return;
      }

      try {
        // Step 1: Create version record
        setStep('creating-version');
        const versionResult = await createVersion.mutateAsync({
          datasetId,
          version,
          changelog,
        });

        // Step 2: Request presigned S3 POST URLs
        setStep('requesting-urls');
        const fileMeta = files.map((f) => ({
          file_name: f.name,
          file_size: f.size,
          file_type: f.name.split('.').pop() ?? 'bin',
        }));

        const presignedUrls = await requestUrls.mutateAsync({
          datasetId,
          versionId: versionResult.id,
          files: fileMeta,
        });

        // Map file_name → presigned URL
        const urlMap = new Map<string, PresignedUploadUrl>();
        for (const p of presignedUrls) {
          urlMap.set(p.file_name, p);
        }

        // Step 3: Upload files directly to S3
        setStep('uploading');
        setFileProgress(
          files.map((f) => ({
            file_name: f.name,
            percent: 0,
            status: 'pending',
          }))
        );

        const confirmFiles: {
          file_name: string;
          file_size: number;
          file_type: string;
          s3_key: string;
          checksum?: string;
        }[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const presigned = urlMap.get(file.name);

          if (!presigned) {
            setFileProgress((prev) =>
              prev.map((p, idx) => (idx === i ? { ...p, status: 'error' } : p))
            );
            continue;
          }

          setFileProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: 'uploading' } : p
            )
          );

          const result = await uploadToS3.mutateAsync({
            presigned,
            file,
            onProgress: (percent) => {
              setFileProgress((prev) =>
                prev.map((p, idx) => (idx === i ? { ...p, percent } : p))
              );
              setOverallPercent(
                Math.round(((i * 100 + percent) / (files.length * 100)) * 100)
              );
            },
          });

          confirmFiles.push({
            file_name: result.file_name,
            file_size: file.size,
            file_type: file.name.split('.').pop() ?? 'bin',
            s3_key: result.s3_key,
          });

          setFileProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, percent: 100, status: 'done' } : p
            )
          );
        }

        // Step 4: Confirm uploads — register DatasetFile records
        setStep('confirming');
        await confirmUpload.mutateAsync({
          datasetId,
          versionId: versionResult.id,
          input: { files: confirmFiles },
        });

        setOverallPercent(100);
        setStep('done');
        toastUtils.success(
          'Upload complete',
          `Version ${version} published with ${confirmFiles.length} file(s).`
        );
      } catch {
        setStep('error');
      }
    },
    [createVersion, requestUrls, uploadToS3, confirmUpload]
  );

  return {
    step,
    isPending,
    fileProgress,
    overallPercent,
    start,
    reset,
  };
}
