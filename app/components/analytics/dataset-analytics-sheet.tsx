import { useDataset } from '~/features/datasets';
import { AppSheet } from '~/components/ui/app-sheet';
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
    <AppSheet
      open={open}
      onOpenChange={onOpenChange}
      side="right"
      size="lg"
      className="sm:max-w-3xl"
      bodyClassName="p-6 sm:p-8"
      title={
        <span className="block truncate text-lg">
          {dataset?.name ?? 'Dataset analytics'}
        </span>
      }
      description="Views, downloads, geography and intended uses for this dataset."
    >
      {datasetId && <DatasetAnalyticsPanels datasetId={datasetId} />}
    </AppSheet>
  );
}
