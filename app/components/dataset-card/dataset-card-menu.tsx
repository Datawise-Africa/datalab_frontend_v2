import { Link } from 'react-router';
import {
  MoreVertical,
  Heart,
  Share2,
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
import { shareLink } from '~/lib/utils/share';

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

  const handleShare = () => {
    const origin =
      typeof globalThis.window !== 'undefined'
        ? globalThis.window.location.origin
        : '';
    shareLink({
      title: dataset.name,
      text: dataset.description,
      url: `${origin}/datasets/${dataset.slug}`,
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
                ? 'Removing bookmark…'
                : 'Bookmarking…'
              : isBookmarked
                ? 'Bookmarked'
                : 'Bookmark'}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
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
