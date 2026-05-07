import { Link } from 'react-router';
import {
  MoreVertical,
  Heart,
  LinkIcon,
  Eye,
  Download,
  Loader2,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useDatasetCard } from './use-dataset-card';
import { cn } from '~/lib/utils';

interface DatasetCardMenuProps {
  onBookmark?: () => void;
  onDownload?: () => void;
  isBookmarked?: boolean;
  isBookmarkPending?: boolean;
  showBookmark?: boolean;
}

export function DatasetCardMenu({
  onBookmark,
  onDownload,
  isBookmarked = false,
  isBookmarkPending = false,
  showBookmark = false,
}: Readonly<DatasetCardMenuProps>) {
  const { dataset } = useDatasetCard();

  const handleCopyLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/datasets/${dataset.slug}`;
    navigator.clipboard.writeText(url).catch(() => {
      // silently fail
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {showBookmark && (
          <DropdownMenuItem
            onClick={onBookmark}
            disabled={isBookmarkPending}
            aria-busy={isBookmarkPending}
          >
            {isBookmarkPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  'mr-2 h-4 w-4',
                  isBookmarked && 'fill-red-500 text-red-500'
                )}
              />
            )}
            {isBookmarkPending
              ? isBookmarked
                ? 'Removing…'
                : 'Saving…'
              : isBookmarked
                ? 'Saved'
                : 'Save'}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/datasets/${dataset.slug}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        {onDownload && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
