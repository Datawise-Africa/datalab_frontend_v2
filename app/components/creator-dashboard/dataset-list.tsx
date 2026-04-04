import { CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { DatasetCard } from '~/components/dataset-card';
import { normalizeMyDataset } from '~/lib/utils/dataset-adapter';
import type { MyDatasetInterface } from '~/features/my-datasets';
import {
  DATASET_STATUS_LABELS,
  DATASET_STATUS_VARIANTS,
} from '~/features/my-datasets/types';

interface DatasetListProps {
  datasets: MyDatasetInterface[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export function DatasetList({
  datasets,
  onEdit,
  onDelete,
  onArchive,
  onPreview,
}: Readonly<DatasetListProps>) {
  if (datasets.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          No datasets found
        </p>
        <p className="text-sm text-muted-foreground">
          Upload your first dataset to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {datasets.map((dataset) => {
        const normalized = normalizeMyDataset(dataset);
        return (
          <DatasetCard key={dataset.id} dataset={normalized}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
              <div className="flex items-center gap-1.5">
                <DatasetCard.Badges />
                <Badge
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[10px] font-medium border-0',
                    DATASET_STATUS_VARIANTS[dataset.status]
                  )}
                >
                  {DATASET_STATUS_LABELS[dataset.status]}
                </Badge>
              </div>
              <DatasetCard.Menu />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
              <DatasetCard.Title />
              <DatasetCard.Description lineClamp={1} />
              <DatasetCard.Meta />
            </CardContent>
            <DatasetCard.Actions
              variant="creator"
              onPreview={() => onPreview?.(dataset.id)}
              onEdit={() => onEdit?.(dataset.id)}
              onDelete={() => onDelete?.(dataset.id)}
              onArchive={() => onArchive?.(dataset.id)}
            />
          </DatasetCard>
        );
      })}
    </div>
  );
}
