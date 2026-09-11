import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { CreditCard, Download, FileText, Loader2 } from 'lucide-react';
import { AppDialog } from '~/components/ui/app-dialog';
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
  useResumeDownload,
  type DownloadReadyResponse,
  type PaymentRequiredResponse,
} from '~/features/downloads';
import { DownloadReadyFiles } from '~/components/download-flow/download-ready-files';
import { formatPrice } from '~/lib/utils/format';
import { extractAccessCode, loadPaystackPop } from '~/lib/utils/paystack-pop';
import { toastUtils } from '~/lib/utils/toast';

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

export function DownloadModal() {
  const { isOpen, data, close } = useAppModal('download');
  const requestDownload = useRequestDownload();
  const resumeDownload = useResumeDownload();
  const { data: versions, isLoading: versionsLoading } = useDatasetVersions(
    data?.datasetId ?? ''
  );

  const [intendedUse, setIntendedUse] = useState('');
  const [versionId, setVersionId] = useState<string>('');
  const [ready, setReady] = useState<DownloadReadyResponse | null>(null);
  const [pending, setPending] = useState<PaymentRequiredResponse | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [checkoutOpening, setCheckoutOpening] = useState(false);
  // True while the Paystack overlay is mounted. We drop our Dialog into
  // non-modal mode for that window so Radix doesn't keep `pointer-events:
  // none` on the body — otherwise the Paystack iframe receives no clicks.
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  // Latest pending_id captured for the polling interval — avoids re-creating
  // the timer on every mutation state change.
  const pendingIdRef = useRef<string | null>(null);
  pendingIdRef.current = pending?.pending_id ?? null;

  // Preselect the latest version (or the first) once versions load.
  useEffect(() => {
    if (!versions || versions.length === 0) return;
    setVersionId((current) => {
      if (current && versions.some((v) => v.id === current)) return current;
      const latest = versions.find((v) => v.is_latest) ?? versions[0];
      return latest.id;
    });
  }, [versions]);

  // Keep mutate fn in a ref so the polling effect doesn't re-create on every
  // mutation state change.
  const resumeMutateRef = useRef(resumeDownload.mutate);
  resumeMutateRef.current = resumeDownload.mutate;

  // Auto-poll resume-download once we're in payment_required state. Stops
  // when the response flips to download_ready (modal stays open on ready
  // view so the user can grab files manually), the modal is closed, or we
  // hit the 10-minute cap.
  useEffect(() => {
    if (!isOpen || !pending || pollingTimedOut || ready) return;
    let attempts = 0;
    const MAX_ATTEMPTS = 150; // 10 min @ 4s
    const id = setInterval(() => {
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(id);
        setPollingTimedOut(true);
        toastUtils.warning(
          'Stopped checking for payment',
          'Click "I\'ve paid" once your payment clears.'
        );
        return;
      }
      const pid = pendingIdRef.current;
      if (!pid) return;
      resumeMutateRef.current(
        { pending_id: pid },
        {
          onSuccess: (response) => {
            if (response.status !== 'payment_required') {
              setReady(response);
              setPending(null);
            }
          },
        }
      );
    }, 4000);
    return () => clearInterval(id);
  }, [isOpen, pending, pollingTimedOut, ready]);

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
    setReady(null);
    setPending(null);
    setPollingTimedOut(false);
    setCheckoutOpening(false);
    setCheckoutVisible(false);
    requestDownload.reset();
    resumeDownload.reset();
  };

  const handleRequestResponse = (
    response: DownloadReadyResponse | PaymentRequiredResponse
  ) => {
    if (response.status === 'payment_required') {
      setPending(response);
      setReady(null);
    } else {
      setReady(response);
      setPending(null);
    }
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
      { onSuccess: handleRequestResponse }
    );
  };

  const handleOpenCheckout = async () => {
    if (!pending || checkoutOpening) return;
    setCheckoutOpening(true);
    try {
      const PaystackPop = await loadPaystackPop();
      const popup = new PaystackPop();
      popup.resumeTransaction(extractAccessCode(pending.authorization_url), {
        onLoad: () => setCheckoutVisible(true),
        onSuccess: () => {
          setCheckoutVisible(false);
          // Backend webhook will mark the pending request paid; auto-poll
          // will then fetch download_ready and swap to the ready view.
          toastUtils.success('Payment received', 'Fetching your files now…');
        },
        onCancel: () => {
          setCheckoutVisible(false);
          toastUtils.info(
            'Checkout cancelled',
            'You can resume payment any time.'
          );
        },
        onError: () => {
          setCheckoutVisible(false);
          toastUtils.error(
            'Checkout failed to load',
            'Please try again or contact support.'
          );
        },
      });
    } catch {
      setCheckoutVisible(false);
      toastUtils.error(
        'Could not open checkout',
        'Paystack failed to load. Check your connection and retry.'
      );
    } finally {
      setCheckoutOpening(false);
    }
  };

  const handleResume = () => {
    if (!pending) return;
    resumeDownload.mutate(
      { pending_id: pending.pending_id },
      {
        onSuccess: handleRequestResponse,
        onError: (error) => {
          // 404 from resume-download means payment hasn't cleared yet.
          if (isAxiosError(error) && error.response?.status === 404) {
            toastUtils.info(
              'Payment still processing',
              'Give it a moment after completing checkout, then try again.'
            );
            return;
          }
          toastUtils.error(
            'Could not fetch download',
            'Please retry, or contact support if payment was completed.'
          );
        },
      }
    );
  };

  return (
    <AppDialog
      open={isOpen}
      modal={!checkoutVisible}
      title={`Download: ${data.datasetName}`}
      size="md"
      closeMode="none"
    >
      {ready ? (
        <div className="space-y-6">
          <DownloadReadyFiles files={ready.files} />

          <div className="flex justify-end pt-4">
            <Button type="button" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : pending ? (
        <div className="space-y-6">
          <div className="rounded-md border border-warning/30 bg-warning/5 p-4 text-sm">
            <p className="font-medium text-warning">Payment required</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.price
                ? `Complete a ${formatPrice(data.price)} payment via Paystack to unlock this download.`
                : 'Complete payment via Paystack to unlock this download.'}
            </p>
          </div>

          <ol className="space-y-2 text-xs text-muted-foreground">
            <li>1. Tap &ldquo;Pay now&rdquo; — Paystack opens right here.</li>
            <li>
              2. Files unlock automatically once payment clears — usually within
              seconds.
            </li>
          </ol>

          {!pollingTimedOut ? (
            // "Watching for payment confirmation…" indicator hidden so users
            // don't see the background poll; polling still runs.
            <></>
          ) : (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-muted-foreground">
              Stopped checking automatically. Use &ldquo;I&apos;ve paid&rdquo;
              once payment has cleared.
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={resumeDownload.isPending}
            >
              Cancel
            </Button>
            {pollingTimedOut ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleResume}
                disabled={resumeDownload.isPending}
              >
                {resumeDownload.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                I&apos;ve paid
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={handleOpenCheckout}
              disabled={checkoutOpening}
            >
              {checkoutOpening ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              Pay now
            </Button>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="space-y-6">
          <div className="rounded-md border border-dashed p-6 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">Nothing to download yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The creator hasn&apos;t uploaded any files for this dataset. Check
              back later.
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

          {data.price ? (
            <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
              This is a paid dataset. After requesting, you&apos;ll be prompted
              to complete a {formatPrice(data.price)} payment via Paystack.
            </div>
          ) : null}

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
              {data.price ? 'Continue to Payment' : 'Request Download'}
            </Button>
          </div>
        </form>
      )}
    </AppDialog>
  );
}
