import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

export function DatasetCardBadges({ className }: { className?: string }) {
  const { dataset } = useDatasetCard();
  const isFree = dataset.price === null || dataset.price === 0;

  return (
    <Badge
      className={cn(
        'rounded-md px-2.5 py-0.5 text-xs font-semibold',
        isFree
          ? 'border-primary/20 bg-primary/5 text-primary'
          : 'border-amber-200 bg-amber-50 text-amber-700',
        className
      )}
    >
      {isFree ? 'Free' : `$${dataset.price}`}
    </Badge>
  );
}
