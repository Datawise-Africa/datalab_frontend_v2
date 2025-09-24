import type { IDataset } from '@/lib/types/data-set';
import { Button } from '../ui/button';
import {
  Bookmark,
  Calendar,
  Database,
  Download,
  Eye,
  Heart,
  Link,
  Loader,
  MoreVertical,
  Users,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import moment from 'moment';
import { getIntendedAudienceIcon } from '@/lib/get-intended-audience-icon';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/use-bookmarked-datasets';
import { shareDataset } from '@/lib/utils/share-dataset.tsx';
import { useNavigate } from 'react-router-dom';

type DatasetCardProps<T = IDataset> = {
  dataset: T;
  handleSingleDataModal: (dataset: T) => void;
  handleDownloadDataClick: (dataset: T) => void;
  mode: 'bookmark' | 'default';
};

type BookmarkedDatasetType = IDataset & {
  is_bookmarked?: boolean;
};

const DatasetCard = <T = IDataset,>({
  dataset: dSet,
  handleSingleDataModal,
  handleDownloadDataClick,
  mode = 'default',
}: DatasetCardProps<T>) => {
  const dataset = dSet as BookmarkedDatasetType;
  const limitWordByBoundary = (text: string, limit: number = 100): string => {
    if (text.length <= limit) return text;
    const boundary = text.lastIndexOf(' ', limit);
    return boundary !== -1
      ? text.slice(0, boundary) + '...'
      : text.slice(0, limit) + '...';
  };

  const formattedDescription = limitWordByBoundary(dataset.description, 100);
  const { addBookmarkMutation, removeBookmarkMutation, isAddingBookmark } =
    useBookmarks();

  const handleToggleBookmark = async (datasetId: IDataset['id']) => {
    if (dataset.is_bookmarked) {
      await removeBookmarkMutation.mutateAsync(datasetId);
    } else {
      await addBookmarkMutation.mutateAsync(datasetId);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="group flex w-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        {/* Header - Price/Status and Actions */}
        <div className="mb-3 flex items-start justify-between sm:mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {dataset.is_private ? (
              <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 sm:text-sm">
                ${dataset.price}
              </span>
            ) : (
              <Badge className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 sm:text-sm">
                Free
              </Badge>
            )}
            {dataset.is_private && (
              <div className="flex items-center gap-1 text-pink-600">
                <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-pink-600 sm:h-3 sm:w-3">
                  <div className="h-1 w-1 rounded-full bg-pink-600 sm:h-1.5 sm:w-1.5"></div>
                </div>
                <span className="text-xs font-medium sm:text-sm">Private</span>
              </div>
            )}
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="focus-ring-0 focus:outline-none"
            >
              <Button
                variant="ghost"
                className="h-8 w-8 border-0 bg-transparent p-1 shadow-none hover:bg-gray-50 focus:ring-0"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={5}
              className="border-primary/30 w-48 bg-white shadow-xl sm:w-56"
              avoidCollisions={true}
            >
              <DropdownMenuLabel className="border-primary/10 text-primary border-b px-3 py-2 text-sm font-semibold">
                Dataset Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className={cn(
                  'hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150',
                  {
                    'cursor-progress opacity-50': isAddingBookmark,
                  },
                )}
                onClick={() => handleToggleBookmark(dataset.id)}
                disabled={
                  isAddingBookmark ||
                  (dataset.is_bookmarked && mode === 'default')
                }
                role="button"
              >
                {isAddingBookmark ? (
                  <Loader className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                ) : mode === 'bookmark' ? (
                  <Bookmark
                    className={cn(`mr-2 h-3 w-3 sm:h-4 sm:w-4`, {
                      'fill-yellow-500 text-yellow-500': dataset.is_bookmarked,
                    })}
                  />
                ) : (
                  <Heart
                    className={cn(`mr-2 h-3 w-3 sm:h-4 sm:w-4`, {
                      'fill-red-500 text-red-500': dataset.is_bookmarked,
                    })}
                  />
                )}
                {mode === 'bookmark'
                  ? dataset.is_bookmarked
                    ? 'Remove Bookmark'
                    : 'Save'
                  : dataset.is_bookmarked
                    ? 'Saved'
                    : 'Save bookmark'}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => shareDataset(dataset)}
                className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
              >
                <Link className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Copy Link
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleSingleDataModal(dataset as T)}
                className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
              >
                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDownloadDataClick?.(dataset as T)}
                className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
              >
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title - Responsive text size */}
        <h3 className="mb-2 line-clamp-2 text-base leading-tight font-semibold text-gray-900 sm:mb-3 sm:text-lg lg:text-xl">
          {dataset.title}
        </h3>

        {/* Author and Rating */}
        <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
          <div className="min-w-0 flex-1">
            {dataset.authors.map((author) => (
              <span
                className="truncate text-xs text-gray-600 sm:text-sm"
                key={author.id}
              >
                {author.first_name}
              </span>
            ))}
          </div>
          <div className="flex flex-shrink-0 items-center gap-1 text-xs">
            <span className="text-xs font-medium text-gray-700">
              <Eye className="inline h-3 w-3 text-gray-500 mr-1" />
              {dataset.views_count} view(s)</span>
            {/* <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> */}
            <span className="hidden text-xs text-gray-500 sm:inline">
              ({dataset.reviews.length ?? 0} reviews)
            </span>
            <span className="text-xs text-gray-500 sm:hidden">
              ({dataset.reviews.length ?? 0})
            </span>
          </div>
        </div>

        {/* Description - Responsive and expandable */}
        <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-gray-600 sm:mb-4 sm:line-clamp-4 sm:text-sm">
          {formattedDescription}
        </p>

        {/* Tags - Responsive wrapping */}
        <div className="mb-3 flex flex-wrap gap-1 sm:mb-4 sm:gap-2">
          {dataset.tags.slice(0, 4).map((tag, index) => (
            <Badge
              key={index}
              variant={'outline'}
              className="border-primary/10 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 transition-colors hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
          {dataset.tags.length > 4 && (
            <Badge
              variant={'outline'}
              className="border-primary/10 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
            >
              +{dataset.tags.length - 4}
            </Badge>
          )}
        </div>

        {/* Available To - Compact on mobile */}
        <div className="mb-3 sm:mb-4">
          <p className="mb-1 text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
            Available to:
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {getIntendedAudienceIcon(dataset.intended_audience)}
          </div>
        </div>

        {/* Metadata - Stack on mobile, grid on larger screens */}
        <div className="mb-4 space-y-1 sm:mb-6 sm:space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">
              <span className="hidden sm:inline">Updated: </span>
              {moment(dataset.updated_at).format('MMM DD, YYYY')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Database className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">{dataset.dataset_size}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
            <span>
              {dataset.download_count}
              <span className="hidden sm:inline"> downloads</span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions - Always at bottom, responsive button layout */}
      <div className="border-t border-gray-100 p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant={'outline'}
            onClick={() => {
              navigate(`/datasets/${dataset.id}`);
              // If you want to handle the modal instead of navigation, uncomment below
              // handleSingleDataModal(dataset as T)
            }}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border border-gray-300 px-2 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-50 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </Button>
          <Button
            variant={'default'}
            onClick={() => handleDownloadDataClick(dataset as T)}
            className="bg-primary hover:bg-primary/90 flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-2 text-xs text-white transition-colors sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;
