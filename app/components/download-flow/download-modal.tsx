import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { useAppModal } from '~/store/slices/modal-slice';
import { useRequestDownload } from '~/features/downloads';
import { StepOverview, type OverviewData } from './step-overview';
import { StepLicense } from './step-license';
import { StepPayment } from './step-payment';
import { StepDownload } from './step-download';

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

type Step = 'overview' | 'license' | 'payment' | 'download';

export function DownloadModal() {
  const { isOpen, data, close } = useAppModal('download');
  const requestDownload = useRequestDownload();

  const [step, setStep] = useState<Step>('overview');
  const [overview, setOverview] = useState<OverviewData>({
    intendedUse: '',
    projectDescription: '',
    institutionType: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedLicense, setAcceptedLicense] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');

  if (!data) return null;

  const isPremium = data.price !== null && data.price > 0;

  const steps: Step[] = isPremium
    ? ['overview', 'license', 'payment', 'download']
    : ['overview', 'license', 'download'];

  const currentIdx = steps.indexOf(step);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === steps.length - 1;

  const canProceed = (): boolean => {
    switch (step) {
      case 'overview':
        return !!(
          overview.intendedUse &&
          overview.projectDescription &&
          overview.institutionType
        );
      case 'license':
        return acceptedTerms && acceptedLicense;
      case 'payment':
        return true;
      case 'download':
        return !!selectedFormat;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setStep(steps[currentIdx + 1]);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setStep(steps[currentIdx - 1]);
    }
  };

  const handleDownload = () => {
    requestDownload.mutate(
      { dataset: data.datasetId },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    close();
    setStep('overview');
    setOverview({
      intendedUse: '',
      projectDescription: '',
      institutionType: '',
    });
    setAcceptedTerms(false);
    setAcceptedLicense(false);
    setSelectedFormat('');
  };

  const stepLabels: Record<Step, string> = {
    overview: 'Overview',
    license: 'License',
    payment: 'Payment',
    download: 'Download',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download: {data.datasetName}</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1 rounded-full ${
                  i <= currentIdx ? 'bg-primary' : 'bg-muted'
                }`}
              />
              <p className="mt-1 text-xs text-muted-foreground text-center">
                {stepLabels[s]}
              </p>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {step === 'overview' && (
            <StepOverview data={overview} onChange={setOverview} />
          )}
          {step === 'license' && (
            <StepLicense
              licenseTitle={data.license || 'Standard License'}
              acceptedTerms={acceptedTerms}
              acceptedLicense={acceptedLicense}
              onAcceptTerms={setAcceptedTerms}
              onAcceptLicense={setAcceptedLicense}
            />
          )}
          {step === 'payment' && (
            <StepPayment
              price={data.price ?? 0}
              datasetName={data.datasetName}
            />
          )}
          {step === 'download' && (
            <StepDownload
              formats={data.formats}
              selectedFormat={selectedFormat}
              onFormatChange={setSelectedFormat}
              onDownload={handleDownload}
              isDownloading={requestDownload.isPending}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isFirst}>
            Back
          </Button>
          {!isLast && (
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
