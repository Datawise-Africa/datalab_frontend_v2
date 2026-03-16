import { CardContent, CardHeader } from '~/components/ui/card';
import { DatasetCard } from '~/components/dataset-card';
import { normalizeApiDataset } from '~/lib/utils/dataset-adapter';
import type { IDataset } from '~/lib/types/dataset';

interface DatasetListProps {
  datasets: IDataset[];
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
}: DatasetListProps) {
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
        const normalized = normalizeApiDataset(dataset);
        return (
          <DatasetCard key={dataset.id} dataset={normalized}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
              <DatasetCard.Badges />
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
