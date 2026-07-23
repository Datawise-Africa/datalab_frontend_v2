import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardDescriptionProps {
  className?: string;
  lineClamp?: number;
}

export function DatasetCardDescription({
  className,
  lineClamp = 2,
}: Readonly<DatasetCardDescriptionProps>) {
  const { dataset } = useDatasetCard();

  return (
    <p
      className={cn(
        'text-sm leading-relaxed text-muted-foreground',
        lineClamp === 1 && 'line-clamp-1',
        lineClamp === 2 && 'line-clamp-2',
        lineClamp === 3 && 'line-clamp-3',
        className
      )}
    >
      {dataset.description}
    </p>
  );
}
