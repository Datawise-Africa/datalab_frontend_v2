import type { MinimalUser, MinimalWorkspace } from '~/lib/types/common';
import type { ProductValidation } from '~/lib/types/validation';

/**
 * Report types mirror the datasets API, not dashboards — reports have versions,
 * files, premium pricing and an S3 upload handshake.
 *
 * Shapes below are verified against a live staging payload (2026-07-16), not taken
 * from the OpenAPI spec, which is wrong in at least two places here:
 *   - it declares `access` as a single object; the API returns an array
 *   - it declares `authors[].user` as a string; reads return a nested user object
 *
 * Read and write shapes differ. `category` is a nested object on read but a bare id
 * on write; same for `authors[].user`. Write payload types are inferred from the Zod
 * schemas in `~/lib/schema/report-schema`.
 */

export type ReportStatus = 'DF' | 'PB' | 'AR';

export type ReportType =
  | 'research_paper'
  | 'market_report'
  | 'climate_assessment'
  | 'policy_brief'
  | 'technical_report'
  | 'white_paper'
  | 'other';

export type ReportAccessType = 'public' | 'private' | 'restricted';

export type ReportAuthorRole = 'creator' | 'author' | 'editor' | 'reviewer';

/** Confirmed live: POST /report-categories/ returns exactly these three fields. */
export interface ReportCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ReportAccess {
  access_type: ReportAccessType;
}

/** Read shape: `user` is expanded. On write it is a bare user id. */
export interface ReportAuthor {
  user: MinimalUser;
  role: ReportAuthorRole;
}

export interface ReportFile {
  id: string;
  file_name: string;
  file_format: string;
  mime_type: string;
  file_size: number;
  s3_key: string;
  checksum: string;
  created_at: string;
}

export interface ReportVersion {
  id: string;
  version: string;
  description?: string;
  is_latest: boolean;
  /** Unreliable — the server returns 0 even when `files` is non-empty. Prefer `fileCount()`. */
  file_count: number;
  size_bytes: number;
  checksum: string;
  files: ReportFile[];
  created_at: string;
}

/**
 * The real file count for a version. The server's `file_count` is stale (returns 0
 * even when files exist — verified live 2026-07-16), so the `files` array wins.
 */
export function fileCount(version: ReportVersion): number {
  return version.files?.length ?? version.file_count;
}

export interface Report {
  id: string;
  title: string;
  slug: string;
  description: string;
  abstract?: string;
  category: ReportCategory | null;
  report_type: ReportType;
  cover_image: string | null;
  owner: MinimalUser;
  workspace: MinimalWorkspace | null;
  is_private: boolean;
  is_premium: boolean;
  price?: string;
  status: ReportStatus;
  verification_status: string;
  validation: ProductValidation | null;
  /** Array, not a single object — the spec is wrong here. Verified live. */
  access: ReportAccess[];
  authors: ReportAuthor[];
  tags: string[];
  downloads_count: number;
  latest_version: ReportVersion | null;
  /** null until the report is published. */
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * One presigned file from POST /reports/{id}/request-download/. Identical to the
 * dataset download entry shape, which is why the ready-state rendering is shared
 * (`~/components/download-flow/download-ready-files`).
 */
export interface ReportDownloadFile {
  file_id: string;
  file_name: string;
  file_size: number;
  download_url: string;
  expires_in: number;
}

/**
 * Success body (HTTP 200) of POST /reports/{id}/request-download/.
 *
 * `files` only ever covers the LATEST version — the backend serializer filters
 * `versions.filter(is_latest=True)` — and comes back empty when no latest
 * version exists, so callers must handle a zero-length list. Premium reports
 * never reach here; they raise 403 (or 404 when no marketplace product exists).
 */
export interface ReportDownloadReadyResponse {
  status: 'download_ready';
  download_id: string;
  files: ReportDownloadFile[];
}

/** Row from GET /my-report-downloads/. Shape per spec — not yet observed live. */
export interface MyReportDownload {
  id: string;
  report: Report;
  download_country: string | null;
  download_date: string;
}

/**
 * Report uploads do NOT share the dataset upload shape. Verified live 2026-07-16:
 *   - request-upload requires `mime_type` (datasets send only file_name/file_size/file_type)
 *   - the response entry has `mime_type` + `file_format`, and no `file_type`
 * Do not swap these for the `dataset-version` equivalents.
 */
export interface ReportRequestUploadFileInput {
  file_name: string;
  file_size: number;
  file_type: string;
  mime_type: string;
}

export interface ReportPresignedFileEntry {
  file_name: string;
  file_size: number;
  mime_type: string;
  file_format: string;
  s3_key: string;
  upload_url: string;
  method: string;
  content_type: string;
  expires_in: string;
}

export interface ReportPresignedUploadResponse {
  files: ReportPresignedFileEntry[];
}

export interface ReportConfirmUploadFileInput {
  file_name: string;
  file_size: number;
  mime_type: string;
  s3_key: string;
  checksum?: string;
}

export interface ReportConfirmUploadInput {
  files: ReportConfirmUploadFileInput[];
}

/**
 * The server rejects anything outside this set with
 * "Unsupported report file type: <mime>". Verified live: pdf and docx pass;
 * image/jpeg, text/csv and text/plain are rejected.
 */
export const REPORT_ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

/** `accept` attribute for the report file drop zone. */
export const REPORT_ACCEPT_ATTR = '.pdf,.docx';

/**
 * Request payload types are inferred from the Zod schemas — see
 * `~/lib/schema/report-schema`. `slug` is server-generated and read-only
 * (confirmed live: "ZZ Temp Probe Category" -> "zz-temp-probe-category"),
 * so it never appears in a create or update payload.
 */
