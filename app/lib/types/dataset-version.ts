export interface DatasetVersion {
  id: string;
  version: string;
  description: string;
  is_latest: boolean;
  files: DatasetVersionFile[];
}

export interface DatasetVersionFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  checksum: string;
}

// ── Request Upload ──

/** File metadata sent to POST .../versions/{id}/request-upload/ */
export interface RequestUploadFileInput {
  file_name: string;
  file_size: number;
  file_type: string;
}

/** Single file entry in the presigned URL response. */
export interface PresignedFileEntry {
  file_name: string;
  file_size: number;
  file_type: string;
  s3_key: string;
  upload_url: string;
  method: string;
  content_type: string;
  expires_in: string;
}

/** Response from request-upload endpoint. */
export interface PresignedUploadResponse {
  files: PresignedFileEntry[];
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
