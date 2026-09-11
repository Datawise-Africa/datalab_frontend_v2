import { useState } from 'react';
import { formatBytes } from '~/lib/utils/format';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Progress } from '~/components/ui/progress';
import { DropZone } from '~/components/ui/drop-zone';
import { AppDialog } from '~/components/ui/app-dialog';
import {
  Loader2,
  Plus,
  FileText,
  GitBranch,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import {
  useMyDatasetVersions,
  useCreateVersion,
  useRequestPresignedUrls,
  useUploadToPresignedUrl,
  useConfirmUpload,
} from '~/features/my-datasets';
import type {
  DatasetVersion,
  PresignedFileEntry,
} from '~/lib/types/dataset-version';

/* ── Versions Tab ── */

export function VersionsTab({ datasetId }: Readonly<{ datasetId: string }>) {
  const {
    data: versions,
    isLoading,
    isError,
  } = useMyDatasetVersions(datasetId);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <GitBranch className="h-4 w-4 text-primary" />
          Versions
        </h3>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Create Version
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">Failed to load versions.</p>
        </div>
      )}

      {!isLoading && !isError && versions?.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <GitBranch className="mx-auto mb-3 h-8 w-8" />
          <p className="text-sm font-medium">No versions yet</p>
          <p className="text-xs mt-1">
            Create a version to start uploading files.
          </p>
        </div>
      )}

      {versions && versions.length > 0 && (
        <div className="space-y-3">
          {versions.map((version) => (
            <VersionCard
              key={version.id}
              version={version}
              datasetId={datasetId}
            />
          ))}
        </div>
      )}

      <CreateVersionDialog
        datasetId={datasetId}
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </div>
  );
}

/* ── Version Card ── */

function VersionCard({
  version,
  datasetId,
}: Readonly<{ version: DatasetVersion; datasetId: string }>) {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <Card className="py-0">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-primary" />
                {version.version}
                {version.is_latest && (
                  <Badge variant="secondary" className="text-[10px] ml-1">
                    Latest
                  </Badge>
                )}
              </p>
              {version.description && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {version.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload Files
              </Button>
            </div>
          </div>

          {version.files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {version.files.map((file) => (
                <Badge
                  key={file.id}
                  variant="secondary"
                  className="text-xs gap-1"
                >
                  <FileText className="h-3 w-3" />
                  {file.file_name}
                  <span className="text-muted-foreground">
                    ({formatBytes(file.file_size)})
                  </span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UploadFilesDialog
        datasetId={datasetId}
        versionId={version.id}
        open={showUpload}
        onOpenChange={setShowUpload}
      />
    </>
  );
}

/* ── Create Version Dialog ── */

function CreateVersionDialog({
  datasetId,
  open,
  onOpenChange,
}: Readonly<{
  datasetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const createVersion = useCreateVersion();
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) return;

    createVersion.mutate(
      { datasetId, version: version.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setVersion('');
          setDescription('');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      closeMode="explicit"
      title="Create Version"
      description="Create a new version for this dataset. You can upload files after creating the version."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-version-form"
            disabled={createVersion.isPending}
          >
            {createVersion.isPending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </>
      }
    >
      <form
        id="create-version-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label htmlFor="version-input" className="text-sm font-medium">
            Version <span className="text-destructive">*</span>
          </label>
          <Input
            id="version-input"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 1.0.0"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description-input" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what changed in this version..."
            rows={3}
          />
        </div>
      </form>
    </AppDialog>
  );
}

/* ── Upload Files Dialog ── */

interface FileUploadItem {
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  /** Stored after presigned URL is received so failed uploads can retry. */
  presignedEntry?: PresignedFileEntry;
}

function UploadFilesDialog({
  datasetId,
  versionId,
  open,
  onOpenChange,
}: Readonly<{
  datasetId: string;
  versionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const requestUrls = useRequestPresignedUrls();
  const uploadFile = useUploadToPresignedUrl();
  const confirmUpload = useConfirmUpload();
  const [items, setItems] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddFiles = (fileList: FileList | File[] | File) => {
    const newFiles =
      fileList instanceof File ? [fileList] : Array.from(fileList);

    setItems((prev) => {
      const existingNames = new Set(prev.map((i) => i.file.name));
      const unique = newFiles.filter((f) => {
        if (existingNames.has(f.name)) return false;
        existingNames.add(f.name);
        return true;
      });
      return [
        ...prev,
        ...unique.map((file) => ({
          file,
          status: 'pending' as const,
          progress: 0,
        })),
      ];
    });
  };

  const removeFile = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, patch: Partial<FileUploadItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const handleUpload = async () => {
    const pendingItems = items.filter((i) => i.status === 'pending');
    if (pendingItems.length === 0) return;

    setIsUploading(true);

    try {
      // Step 1: Request presigned URLs
      const fileMeta = pendingItems.map((item) => ({
        file_name: item.file.name,
        file_size: item.file.size,
        file_type: item.file.type || item.file.name.split('.').pop() || '',
      }));

      const response = await requestUrls.mutateAsync({
        datasetId,
        versionId,
        files: fileMeta,
      });

      const presignedFiles = response.files;

      // Pair each item with its presigned entry. Persist on state so retries
      // can reuse the entries, and pass them explicitly to uploadFiles since
      // setItems doesn't flush synchronously.
      const pairs: { item: FileUploadItem; presigned: PresignedFileEntry }[] =
        [];
      for (const item of pendingItems) {
        const idx = items.indexOf(item);
        const entry = presignedFiles.find(
          (p) => p.file_name === item.file.name
        );
        if (entry) {
          updateItem(idx, { presignedEntry: entry });
          pairs.push({ item, presigned: entry });
        }
      }

      // Step 2: Upload each file to its presigned URL
      await uploadFiles(pairs);
    } catch {
      items.forEach((item, i) => {
        if (item.status === 'pending') {
          updateItem(i, {
            status: 'error',
            error: 'Failed to get upload URLs',
          });
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  /** Upload a list of items using their presigned entries. */
  const uploadFiles = async (
    toUpload: { item: FileUploadItem; presigned: PresignedFileEntry }[]
  ) => {
    const uploaded: { presigned: PresignedFileEntry; file: File }[] = [];

    for (const { item, presigned } of toUpload) {
      const itemIndex = items.indexOf(item);

      if (!presigned) {
        updateItem(itemIndex, {
          status: 'error',
          error: 'No upload URL received',
        });
        continue;
      }

      updateItem(itemIndex, { status: 'uploading', progress: 0 });

      try {
        await uploadFile.mutateAsync({
          presigned,
          file: item.file,
          onProgress: (percent) => updateItem(itemIndex, { progress: percent }),
        });
        updateItem(itemIndex, { status: 'done', progress: 100 });
        uploaded.push({ presigned, file: item.file });
      } catch {
        updateItem(itemIndex, { status: 'error', error: 'Upload failed' });
      }
    }

    // Step 3: Confirm uploads so backend creates file entries
    if (uploaded.length > 0) {
      await confirmUpload.mutateAsync({
        datasetId,
        versionId,
        input: {
          files: uploaded.map(({ presigned, file }) => ({
            file_name: presigned.file_name,
            file_size: file.size,
            file_type: presigned.file_type,
            s3_key: presigned.s3_key,
            mime_type:
              presigned.content_type || file.type || 'application/octet-stream',
          })),
        },
      });
    }
  };

  /** Retry all failed uploads that have a presigned URL. */
  const handleRetry = async () => {
    const retryable = items
      .filter(
        (i): i is FileUploadItem & { presignedEntry: PresignedFileEntry } =>
          i.status === 'error' && !!i.presignedEntry
      )
      .map((i) => ({ item: i, presigned: i.presignedEntry }));
    if (retryable.length === 0) return;

    setIsUploading(true);
    try {
      await uploadFiles(retryable);
    } finally {
      setIsUploading(false);
    }
  };

  const allDone = items.length > 0 && items.every((i) => i.status === 'done');
  const hasPending = items.some((i) => i.status === 'pending');
  const hasRetryable = items.some(
    (i) => i.status === 'error' && i.presignedEntry
  );

  const handleClose = () => {
    if (!isUploading) {
      setItems([]);
      onOpenChange(false);
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={isUploading ? undefined : handleClose}
      size="md"
      closeMode={isUploading ? 'none' : 'explicit'}
      title="Upload Files"
      description="Add files to this version. Files will be uploaded to storage."
      bodyClassName="space-y-4"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            {allDone ? 'Done' : 'Cancel'}
          </Button>
          {hasRetryable && !isUploading && (
            <Button variant="outline" onClick={handleRetry}>
              <RotateCw className="mr-1.5 h-4 w-4" />
              Retry Failed
            </Button>
          )}
          {hasPending && (
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-4 w-4" />
                  Upload {
                    items.filter((i) => i.status === 'pending').length
                  }{' '}
                  {items.filter((i) => i.status === 'pending').length === 1
                    ? 'file'
                    : 'files'}
                </>
              )}
            </Button>
          )}
        </>
      }
    >
      <DropZone
        onFiles={handleAddFiles}
        disabled={isUploading}
        hint="Drag & drop files or click to browse"
      />

      {items.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map((item, i) => (
            <div
              key={`${item.file.name}-${i}`}
              className="flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.file.name}</p>
                {item.status === 'uploading' && (
                  <Progress value={item.progress} className="mt-1 h-1.5" />
                )}
                {item.status === 'error' && (
                  <p className="text-xs text-destructive mt-0.5">
                    {item.error}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {item.status === 'pending' && !isUploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {item.status === 'uploading' && (
                  <span className="text-xs text-muted-foreground">
                    {item.progress}%
                  </span>
                )}
                {item.status === 'done' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {item.status === 'error' &&
                  item.presignedEntry &&
                  !isUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        const presigned = item.presignedEntry;
                        if (!presigned) return;
                        (async () => {
                          setIsUploading(true);
                          try {
                            await uploadFiles([{ item, presigned }]);
                          } finally {
                            setIsUploading(false);
                          }
                        })();
                      }}
                      className="text-muted-foreground hover:text-primary"
                      title="Retry upload"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  )}
                {item.status === 'error' &&
                  (!item.presignedEntry || isUploading) && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppDialog>
  );
}
