import { Download } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AsyncSelect } from '~/components/ui/async-select';
import { Label } from '~/components/ui/label';

interface StepDownloadProps {
  formats: string[];
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export function StepDownload({
  formats,
  selectedFormat,
  onFormatChange,
  onDownload,
  isDownloading,
}: StepDownloadProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Download className="h-6 w-6 text-primary" />
        </div>
        <p className="font-medium">Ready to download</p>
      </div>

      <div className="space-y-2">
        <Label>Select Format</Label>
        <AsyncSelect
          value={selectedFormat || null}
          onChange={(val) => onFormatChange(val ?? '')}
          options={formats.map((f) => ({ label: f, value: f }))}
          placeholder="Choose a format"
        />
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90"
        onClick={onDownload}
        disabled={!selectedFormat || isDownloading}
      >
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? 'Downloading...' : 'Download Dataset'}
      </Button>
    </div>
  );
}
