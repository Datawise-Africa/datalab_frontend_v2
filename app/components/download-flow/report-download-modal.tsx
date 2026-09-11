import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { FileText, Loader2, RefreshCw } from 'lucide-react';
import { AppDialog } from '~/components/ui/app-dialog';
import { Button } from '~/components/ui/button';
import { DownloadReadyFiles } from '~/components/download-flow/download-ready-files';
import { useAppModal } from '~/store/slices/modal-slice';
import { useRequestReportDownload } from '~/features/reports';
import type { ReportDownloadReadyResponse } from '~/lib/types/report';
import { extractError } from '~/lib/utils/extract-error';

interface ReportDownloadModalData {
  reportId: string;
  reportName: string;
}

declare module '~/store/slices/modal-slice' {
  interface ModalRegistry {
    reportDownload: ReportDownloadModalData;
  }
}

/**
 * Report downloads are a single request/response — no intended-use form, no
 * payment branch, and deliberately no version picker: the backend only ever
 * presigns the latest version, so offering a choice would promise something the
 * API cannot serve.
 */
export function ReportDownloadModal() {
  const { isOpen, data, close } = useAppModal('reportDownload');
  const requestDownload = useRequestReportDownload();
  const [ready, setReady] = useState<ReportDownloadReadyResponse | null>(null);

  const reportId = data?.reportId ?? '';

  // Keep mutate/reset in refs so the auto-request effect doesn't re-run on
  // every mutation state change.
  const mutateRef = useRef(requestDownload.mutate);
  mutateRef.current = requestDownload.mutate;
  const resetRef = useRef(requestDownload.reset);
  resetRef.current = requestDownload.reset;

  // The server records a download on every 200, so this must fire exactly once
  // per open — a re-render must never re-request and inflate `downloads_count`.
  const requestedForRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isOpen || !reportId) {
      requestedForRef.current = null;
      return;
    }
    if (requestedForRef.current === reportId) return;
    requestedForRef.current = reportId;
    resetRef.current();
    setReady(null);
    mutateRef.current(reportId, { onSuccess: setReady });
  }, [isOpen, reportId]);

  if (!data) return null;

  const handleClose = () => {
    close();
    setReady(null);
    requestDownload.reset();
  };

  const handleRetry = () => {
    requestDownload.reset();
    setReady(null);
    requestDownload.mutate(reportId, { onSuccess: setReady });
  };

  const { error } = requestDownload;
  const errorStatus = isAxiosError(error) ? error.response?.status : undefined;
  // 403 = premium report (downloads not enabled yet); 404 = no marketplace
  // product behind it. Neither is retryable, so we explain instead of looping.
  const isAccessError = errorStatus === 403 || errorStatus === 404;
  const isEmpty = ready !== null && ready.files.length === 0;

  const renderBody = () => {
    if (requestDownload.isPending) {
      return (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Preparing your download…
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-6">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-medium text-destructive">
              {isAccessError ? 'Download not available' : 'Download failed'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {extractError(error, 'Please try again in a moment.')}
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
            {!isAccessError && (
              <Button type="button" onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            )}
          </div>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="space-y-6">
          <div className="rounded-md border border-dashed p-6 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">Nothing to download yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              This report has no files on its latest version. Check back later.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      );
    }

    if (ready) {
      return (
        <div className="space-y-6">
          <DownloadReadyFiles files={ready.files} />
          <div className="flex justify-end pt-4">
            <Button type="button" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AppDialog
      open={isOpen}
      title={`Download: ${data.reportName}`}
      size="md"
      closeMode="none"
    >
      {renderBody()}
    </AppDialog>
  );
}
