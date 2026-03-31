export interface DatasetVersion {
  id: string;
  dataset: string;
  version: string;
  changelog: string;
  files: DatasetVersionFile[];
  created_at: string;
}

export interface DatasetVersionFile {
  id: string;
  file_name: string;
  file_size: number;
  file_size_display: string;
  file_type: string;
  s3_key: string;
  upload_status: 'pending' | 'uploading' | 'completed' | 'failed';
}

// ── Request Upload ──

/** File metadata sent to POST .../versions/{id}/request-upload/ */
export interface RequestUploadFileInput {
  file_name: string;
  file_size: number;
  file_type: string;
}

/** Single presigned URL entry returned by request-upload. */
export interface PresignedUploadUrl {
  file_id: string;
  file_name: string;
  /** The S3 presigned POST URL. */
  upload_url: string;
  /** S3 POST form fields to include with the upload. */
  fields: Record<string, string>;
}

// ── Confirm Upload ──

/** Single file entry sent to POST .../versions/{id}/confirm-upload/ */
export interface ConfirmUploadFileInput {
  file_name: string;
  file_size: number;
  file_type: string;
  /** The S3 object key where the file was uploaded. */
  s3_key: string;
  /** Optional file checksum for integrity verification. */
  checksum?: string;
}

/** Full payload for confirm-upload. */
export interface ConfirmUploadInput {
  files: ConfirmUploadFileInput[];
}
