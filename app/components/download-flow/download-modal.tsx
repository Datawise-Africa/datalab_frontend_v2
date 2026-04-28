import { useEffect, useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useAppModal } from '~/store/slices/modal-slice';
import { useDatasetVersions } from '~/features/datasets';
import {
  useRequestDownload,
  type RequestDownloadResponse,
} from '~/features/downloads';

interface DownloadModalData {
  datasetId: string;
  datasetName: string;
  price: number | null;
  formats: string[];
  license: string;
}

declare module '~/store/slices/modal-slice' {
  interface ModalRegistry {
    download: DownloadModalData;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatExpiry(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hr${hours > 1 ? 's' : ''}`;
}

export function DownloadModal() {
  const { isOpen, data, close } = useAppModal('download');
  const requestDownload = useRequestDownload();
  const { data: versions, isLoading: versionsLoading } = useDatasetVersions(
    data?.datasetId ?? ''
  );

  const [intendedUse, setIntendedUse] = useState('');
  const [versionId, setVersionId] = useState<string>('');
  const [result, setResult] = useState<RequestDownloadResponse | null>(null);

  // Preselect the latest version (or the first) once versions load.
  useEffect(() => {
    if (!versions || versions.length === 0) return;
    setVersionId((current) => {
      if (current && versions.some((v) => v.id === current)) return current;
      const latest = versions.find((v) => v.is_latest) ?? versions[0];
      return latest.id;
    });
  }, [versions]);

  if (!data) return null;

  const versionOptions = versions ?? [];
  const hasMultipleVersions = versionOptions.length > 1;
  const showVersionPicker = versionsLoading || hasMultipleVersions;

  // A dataset is downloadable only if at least one version has files.
  const versionsResolved = !versionsLoading && versions !== undefined;
  const hasDownloadableFiles =
    versionsResolved && versionOptions.some((v) => (v.files?.length ?? 0) > 0);
  const isEmpty = versionsResolved && !hasDownloadableFiles;
  // Selected version has no files attached.
  const selectedVersion = versionOptions.find((v) => v.id === versionId);
  const selectedVersionHasFiles =
    !selectedVersion || (selectedVersion.files?.length ?? 0) > 0;

  const handleClose = () => {
    close();
    setIntendedUse('');
    setVersionId('');
    setResult(null);
    requestDownload.reset();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!intendedUse.trim()) return;
    requestDownload.mutate(
      {
        dataset: data.datasetId,
        intended_use: intendedUse.trim(),
        version: versionId || undefined,
      },
      { onSuccess: (response) => setResult(response) }
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-xl p-6 sm:p-8" dismissible={false}>
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg">
            Download: {data.datasetName}
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-6">
            <div className="rounded-md border border-success/30 bg-success/5 p-4 text-sm">
              <p className="font-medium text-success">Download ready</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your files are available below. Links expire after their listed
                window — re-request if they lapse.
              </p>
            </div>

            <ul className="space-y-3">
              {result.files.map((file) => (
                <li
                  key={file.file_id}
                  className="flex items-center gap-3 rounded-md border p-4"
                >
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {file.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)} · expires in{' '}
                      {formatExpiry(file.expires_in)}
                    </p>
                  </div>
                  <Button asChild size="sm">
                    <a
                      href={file.download_url}
                      download={file.file_name}
                      rel="noreferrer"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Download
                    </a>
                  </Button>
                </li>
              ))}
            </ul>

            <div className="flex justify-end pt-4">
              <Button type="button" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="space-y-6">
            <div className="rounded-md border border-dashed p-6 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">Nothing to download yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The creator hasn&apos;t uploaded any files for this dataset.
                Check back later.
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {showVersionPicker && (
              <div className="space-y-2">
                <Label htmlFor="version-select">Version</Label>
                {versionsLoading ? (
                  <div className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading versions…
                  </div>
                ) : (
                  <Select value={versionId} onValueChange={setVersionId}>
                    <SelectTrigger id="version-select" className="w-full">
                      <SelectValue placeholder="Select a version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versionOptions.map((v) => {
                        const fileCount = v.files?.length ?? 0;
                        return (
                          <SelectItem
                            key={v.id}
                            value={v.id}
                            disabled={fileCount === 0}
                          >
                            {v.version}
                            {v.is_latest ? ' (Latest)' : ''}
                            {fileCount > 0
                              ? ` · ${fileCount} file${fileCount === 1 ? '' : 's'}`
                              : ' · no files'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
                {!versionsLoading &&
                selectedVersion &&
                !selectedVersionHasFiles ? (
                  <p className="text-xs text-destructive">
                    This version has no files. Pick another version.
                  </p>
                ) : !versionsLoading ? (
                  <p className="text-xs text-muted-foreground">
                    Defaults to the latest version. You can pick an older one to
                    download its files instead.
                  </p>
                ) : null}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="intended-use">Intended Use</Label>
              <Textarea
                id="intended-use"
                placeholder="Describe how you plan to use this dataset..."
                rows={4}
                value={intendedUse}
                onChange={(e) => setIntendedUse(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={requestDownload.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !intendedUse.trim() ||
                  requestDownload.isPending ||
                  versionsLoading ||
                  !selectedVersionHasFiles
                }
              >
                {requestDownload.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Request Download
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
