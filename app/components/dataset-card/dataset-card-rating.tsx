import { Star } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardRatingProps {
  className?: string;
}

export function DatasetCardRating({
  className,
}: Readonly<DatasetCardRatingProps>) {
  const { dataset } = useDatasetCard();

  return (
    <span className={cn('flex items-center gap-1 shrink-0', className)}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-sm text-foreground">
        {dataset.rating}
      </span>
      <span className="text-xs text-muted-foreground">
        ({dataset.reviewCount} reviews)
      </span>
    </span>
  );
}
