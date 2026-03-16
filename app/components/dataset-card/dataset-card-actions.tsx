import { Link } from 'react-router';
import { Eye, Download, Pencil, Trash2, Archive, Bookmark } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CardFooter } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

type ActionVariant = 'default' | 'compact' | 'creator';

interface DatasetCardActionsProps {
  className?: string;
  variant?: ActionVariant;
  onDownload?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
}

export function DatasetCardActions({
  className,
  variant = 'default',
  onDownload,
  onBookmark,
  isBookmarked = false,
  onEdit,
  onDelete,
  onArchive,
}: DatasetCardActionsProps) {
  const { dataset } = useDatasetCard();

  if (variant === 'creator') {
    return (
      <CardFooter className={cn('gap-2 border-t px-5 py-3', className)}>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/datasets/${dataset.slug}`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onArchive}>
          <Archive className="mr-1.5 h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    );
  }

  if (variant === 'compact') {
    return (
      <CardFooter className={cn('gap-3 border-t px-5 py-3', className)}>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/datasets/${dataset.slug}`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Details
          </Link>
        </Button>
        {onBookmark && (
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onBookmark}
          >
            <Bookmark
              className={cn(
                'h-3.5 w-3.5',
                isBookmarked && 'fill-primary text-primary'
              )}
            />
          </Button>
        )}
      </CardFooter>
    );
  }

  return (
    <CardFooter className={cn('gap-3 border-t px-5 py-3', className)}>
      <Button asChild variant="outline" size="sm" className="flex-1">
        <Link to={`/datasets/${dataset.slug}`}>
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          View Details
        </Link>
      </Button>
      <Button
        size="sm"
        className="flex-1 bg-primary text-white hover:bg-primary/90"
        onClick={onDownload}
      >
        <Download className="mr-1.5 h-3.5 w-3.5" />
        Download
      </Button>
    </CardFooter>
  );
}
