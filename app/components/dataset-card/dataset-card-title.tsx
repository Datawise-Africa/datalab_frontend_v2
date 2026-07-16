import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardTitleProps {
  className?: string;
  lineClamp?: number;
}

export function DatasetCardTitle({
  className,
  lineClamp = 2,
}: Readonly<DatasetCardTitleProps>) {
  const { dataset } = useDatasetCard();

  return (
    <h3
      className={cn(
        'text-base font-semibold leading-snug text-foreground',
        lineClamp === 1 && 'line-clamp-1',
        lineClamp === 2 && 'line-clamp-2',
        lineClamp === 3 && 'line-clamp-3',
        className
      )}
    >
      {dataset.name}
    </h3>
  );
}
