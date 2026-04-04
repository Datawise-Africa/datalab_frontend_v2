import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardImageProps {
  className?: string;
  fallbackColor?: string;
}

export function DatasetCardImage({
  className,
  fallbackColor = 'bg-primary/10',
}: DatasetCardImageProps) {
  const { dataset } = useDatasetCard();

  if (dataset.image) {
    return (
      <div className={cn('aspect-video w-full overflow-hidden', className)}>
        <img
          src={dataset.image}
          alt={dataset.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex aspect-video w-full items-center justify-center',
        fallbackColor,
        className
      )}
    >
      <span className="text-2xl font-bold text-primary/30">
        {dataset.category}
      </span>
    </div>
  );
}
