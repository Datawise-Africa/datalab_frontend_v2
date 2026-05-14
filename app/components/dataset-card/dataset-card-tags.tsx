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
}: DatasetCardTagsProps) {
  const { dataset } = useDatasetCard();
  const tags = dataset.tags.slice(0, limit);

  if (tags.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="rounded-md text-xs font-normal capitalize"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
