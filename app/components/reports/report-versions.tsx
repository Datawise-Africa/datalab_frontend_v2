import { useState } from 'react';
import { Loader2, Plus, Trash2, FileText } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { AppDialog } from '~/components/ui/app-dialog';
import { DropZone } from '~/components/ui/drop-zone';
import { useFileUpload } from '~/hooks/use-file-upload';
import {
  useMyReportVersions,
  useCreateMyReportVersion,
  useDeleteMyReportVersion,
  useRequestReportUploadUrls,
  useUploadReportFileToS3,
  useConfirmReportUpload,
} from '~/features/my-reports';
import { formatBytes } from '~/lib/utils/format';
import { toastUtils } from '~/lib/utils/toast';
import {
  REPORT_ACCEPT_ATTR,
  fileCount,
  type ReportVersion,
} from '~/lib/types/report';

interface ReportVersionsProps {
  reportId: string;
}

export function ReportVersions({ reportId }: Readonly<ReportVersionsProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ReportVersion | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    files: managedFiles,
    addFiles,
    removeAt,
    clear: clearFiles,
  } = useFileUpload({ multiple: true });
  const files = managedFiles.map((m) => m.file);

  const { data: versionsData, isLoading } = useMyReportVersions(reportId);
  const createVersion = useCreateMyReportVersion();
  const deleteVersion = useDeleteMyReportVersion();
  const requestUrls = useRequestReportUploadUrls();
  const uploadToS3 = useUploadReportFileToS3();
  const confirmUpload = useConfirmReportUpload();

  const versions = versionsData ?? [];

  const reset = () => {
    setVersionLabel('');
    clearFiles();
    setDialogOpen(false);
  };

  /**
   * Four-step handshake, mirroring the dataset upload flow:
   * create version -> request presigned URLs -> PUT each file -> confirm.
   */
  const handleCreate = async () => {
    if (!versionLabel.trim() || files.length === 0) return;
    setUploading(true);
    try {
      const version = await createVersion.mutateAsync({
        reportId,
        input: { version: versionLabel.trim() },
      });

      // `mime_type` is required by the report request-upload serializer — omitting
      // it 400s. This is where reports diverge from the dataset upload payload.
      const presigned = await requestUrls.mutateAsync({
        reportId,
        versionId: version.id,
        files: files.map((f) => ({
          file_name: f.name,
          file_size: f.size,
          file_type: f.type || 'application/octet-stream',
          mime_type: f.type || 'application/octet-stream',
        })),
      });

      for (const entry of presigned.files) {
        const match = files.find((f) => f.name === entry.file_name);
        if (!match) continue;
        await uploadToS3.mutateAsync({ presigned: entry, file: match });
      }

      await confirmUpload.mutateAsync({
        reportId,
        versionId: version.id,
        input: {
          files: presigned.files.map((entry) => ({
            file_name: entry.file_name,
            file_size: entry.file_size,
            mime_type: entry.mime_type,
            s3_key: entry.s3_key,
          })),
        },
      });

      toastUtils.success('Version uploaded', `v${versionLabel.trim()}`);
      reset();
    } catch {
      // Each mutation surfaces its own toast via extractError.
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const label = deleteTarget.version;
    deleteVersion.mutate(
      { reportId, versionId: deleteTarget.id },
      {
        onSuccess: () => {
          toastUtils.success('Deleted version', `v${label}`);
          setDeleteTarget(null);
        },
      }
    );
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Versions</h2>
          <p className="text-sm text-muted-foreground">
            Upload the report&apos;s files as a version
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          New version
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : versions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <FileText className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">No versions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            A report needs at least one version before it can be downloaded.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {versions.map((version) => (
            <li
              key={version.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  v{version.version}
                  {version.is_latest && (
                    <Badge variant="secondary">Latest</Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {/* Trust files.length — the server's file_count is stale (returns 0
                      even when files exist). Verified live 2026-07-16. */}
                  {fileCount(version)} file{fileCount(version) === 1 ? '' : 's'}{' '}
                  · {formatBytes(version.size_bytes)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteTarget(version)}
                aria-label="Delete version"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <AppDialog
        open={dialogOpen}
        onOpenChange={(open) =>
          !uploading && (open ? setDialogOpen(true) : reset())
        }
        title="New version"
        description="Give the version a label and attach its files."
        size="md"
        closeMode="explicit"
        footer={
          <>
            <Button variant="outline" onClick={reset} disabled={uploading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={uploading || !versionLabel.trim() || files.length === 0}
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload version
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-version-label">Version</Label>
            <Input
              id="report-version-label"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              placeholder="e.g. 1.0"
              disabled={uploading}
            />
          </div>

          {/* Server accepts PDF and DOCX only — anything else 400s on request-upload. */}
          <DropZone
            onFiles={addFiles}
            accept={REPORT_ACCEPT_ATTR}
            multiple
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground">PDF or DOCX only.</p>

          {managedFiles.length > 0 && (
            <ul className="space-y-1">
              {managedFiles.map((managed, index) => (
                <li
                  key={managed.key}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span className="truncate">{managed.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatBytes(managed.file.size)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAt(index)}
                      disabled={uploading}
                      aria-label={`Remove ${managed.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AppDialog>

      <AppDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete version?"
        description={
          <>This permanently removes v{deleteTarget?.version} and its files.</>
        }
        size="sm"
        closeMode="explicit"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteVersion.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteVersion.isPending}
            >
              {deleteVersion.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </>
        }
      />
    </section>
  );
}
