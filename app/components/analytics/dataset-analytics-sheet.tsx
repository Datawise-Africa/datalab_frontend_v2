import { useDataset } from '~/features/datasets';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { DatasetAnalyticsPanels } from './dataset-analytics-panels';

interface Props {
  datasetId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function DatasetAnalyticsSheet({
  datasetId,
  onOpenChange,
}: Readonly<Props>) {
  const { data: dataset } = useDataset(datasetId ?? '');
  const open = !!datasetId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-6 sm:max-w-3xl sm:p-8"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="truncate text-lg">
            {dataset?.name ?? 'Dataset analytics'}
          </SheetTitle>
          <SheetDescription>
            Views, downloads, geography and intended uses for this dataset.
          </SheetDescription>
        </SheetHeader>

        {datasetId && <DatasetAnalyticsPanels datasetId={datasetId} />}
      </SheetContent>
    </Sheet>
  );
}
