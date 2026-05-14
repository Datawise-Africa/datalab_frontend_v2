import { cn } from '~/lib/utils';
import { DatasetDefaultIllustration } from '~/components/illustrations/dataset-default';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardImageProps {
  className?: string;
}

export function DatasetCardImage({
  className,
}: Readonly<DatasetCardImageProps>) {
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
        'aspect-video w-full overflow-hidden bg-primary/5',
        className
      )}
    >
      <DatasetDefaultIllustration />
    </div>
  );
}
