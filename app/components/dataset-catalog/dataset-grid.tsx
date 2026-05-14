import { CardContent, CardHeader } from '~/components/ui/card';
import { DatasetCard } from '~/components/dataset-card';
import type { NormalizedDataset } from '~/lib/utils/dataset-adapter';
import { cn } from '~/lib/utils';

interface DatasetGridProps {
  datasets: NormalizedDataset[];
  className?: string;
  onDownload?: (dataset: NormalizedDataset) => void;
}

export function DatasetGrid({
  datasets,
  className,
  onDownload,
}: DatasetGridProps) {
  if (datasets.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          No datasets found
        </p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
            <DatasetCard.Badges />
            <DatasetCard.Menu />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
            <DatasetCard.Title />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <DatasetCard.Author />
              <DatasetCard.Rating className="ml-2" />
            </div>
            <DatasetCard.Description />
            <DatasetCard.Tags limit={3} />
            <DatasetCard.Audience />
            <DatasetCard.Meta />
          </CardContent>
          <DatasetCard.Actions onDownload={() => onDownload?.(dataset)} />
        </DatasetCard>
      ))}
    </div>
  );
}
