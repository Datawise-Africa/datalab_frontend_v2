import { Link } from 'react-router';
import {
  Eye,
  Download,
  Pencil,
  Trash2,
  Archive,
  Heart,
  Loader2,
} from 'lucide-react';
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
  isBookmarkPending?: boolean;
  onPreview?: () => void;
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
  isBookmarkPending = false,
  onPreview,
  onEdit,
  onDelete,
  onArchive,
}: Readonly<DatasetCardActionsProps>) {
  const { dataset } = useDatasetCard();

  if (variant === 'creator') {
    return (
      <CardFooter className={cn('gap-2 border-t px-5 py-3', className)}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 min-w-0"
          onClick={onPreview}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Preview
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onEdit}
          title="Edit"
          aria-label="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onArchive}
          title="Archive"
          aria-label="Archive"
        >
          <Archive className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
          onClick={onDelete}
          title="Delete"
          aria-label="Delete"
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
            className={cn(
              'h-8 w-8 shrink-0',
              isBookmarked && 'border-red-500 text-red-500'
            )}
            onClick={onBookmark}
            disabled={isBookmarkPending}
            aria-pressed={isBookmarked}
            aria-busy={isBookmarkPending}
            aria-label={isBookmarked ? 'Remove from saved' : 'Save dataset'}
            title={isBookmarked ? 'Remove from saved' : 'Save dataset'}
          >
            {isBookmarkPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  'h-3.5 w-3.5',
                  isBookmarked && 'fill-red-500 text-red-500'
                )}
              />
            )}
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
