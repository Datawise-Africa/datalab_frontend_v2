import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Eye, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import useDatasetCreatorReport from '@/hooks/use-dataset-creator-report';
import useDownloadReportsPdf from '@/hooks/use-download-pdf';

export function ReportPreviewSheet() {
  const { generateReportAndDownloadPDF, isDownloading } =
    useDownloadReportsPdf();
  const { reports, selectedDatasets, filters } = useDatasetCreatorReport();

  const reportsData = useMemo(() => {
    return (
      reports || {
        views: 0,
        downloads: 0,
        ratings: 0,
        comments: 0,
      }
    );
  }, [reports]);

  return (
    <SheetContent
      side="right"
      className="w-full overflow-y-auto bg-white p-4 sm:max-w-2xl sm:rounded-l-sm sm:border sm:border-gray-200 md:p-6"
    >
      <SheetHeader>
        <SheetTitle>Report Preview</SheetTitle>
        <SheetDescription>
          A summary of your generated report based on current selections.
        </SheetDescription>
      </SheetHeader>

      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4 text-center">
          {Object.entries(reportsData).map(([key, value]) => (
            <div key={key}>
              <div className="text-3xl font-bold text-blue-600">{value}</div>
              <div className="text-sm text-gray-500">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-2 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold">
            Datasets Included ({selectedDatasets.length})
          </h3>
          {selectedDatasets.map((dataset) => (
            <div key={dataset.id} className="flex items-center gap-2">
              <span className="font-medium">{dataset.title}</span>
              <Badge variant="secondary">{dataset.category.title}</Badge>
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Filters Applied</h3>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-gray-700">
            <div className="font-medium">Date Range:</div>
            <div>{filters.date_range}</div>
            <div className="font-medium">Metrics:</div>
            <div>{filters.metrics.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-green-600 bg-transparent text-green-600 hover:bg-green-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            Close Preview
          </Button>

          <Button
            variant="outline"
            className="flex-1 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
            onClick={() =>
              generateReportAndDownloadPDF({
                reportsData: reportsData,
                selectedDatasets: selectedDatasets,
                filters: filters,
              })
            }
            disabled={isDownloading }
          >
            <Printer className="mr-2 h-4 w-4" />
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
