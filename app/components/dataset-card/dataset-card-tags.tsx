import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardTagsProps {
  className?: string;
  limit?: number;
}

export function DatasetCardTags({
  className,
  limit = 3,
}: Readonly<DatasetCardTagsProps>) {
  const { dataset } = useDatasetCard();
  const visible = dataset.tags.slice(0, limit);
  const overflow = Math.max(0, dataset.tags.length - limit);

  if (visible.length === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-nowrap items-center gap-1.5 overflow-hidden',
        className
      )}
    >
      {visible.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="max-w-[10rem] shrink-0 truncate rounded-md text-xs font-normal capitalize"
          title={tag}
        >
          {tag}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge
          variant="secondary"
          className="shrink-0 rounded-md text-xs font-normal"
          title={dataset.tags.slice(limit).join(', ')}
        >
          +{overflow}
        </Badge>
      )}
    </div>
  );
}
