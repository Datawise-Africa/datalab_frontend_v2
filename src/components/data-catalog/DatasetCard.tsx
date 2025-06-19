import type { IDataset } from '@/lib/types/data-set';
import { Button } from '../ui/button';
import {
  Star,
  MoreVertical,
  Download,
  Eye,
  Bookmark,
  Link,
  Calendar,
  Database,
  Users,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import moment from 'moment';
import { getIntendedAudienceIcon } from '@/lib/get-intended-audience-icon';
import { cn } from '@/lib/utils';
type DatasetCardProps = {
  dataset: IDataset & { is_bookmarked?: boolean }; // ✅ NEW
  handleSingleDataModal: (dataset: IDataset) => void;
  handleDownloadDataClick: (dataset: IDataset) => void;
  handleShareDataset?: (dataset: IDataset) => void;
  handleBookmarkDataset?: (datasetId: IDataset['id']) => void;
  handleQuickDownload?: (dataset: IDataset) => void;
  isBookmarksLoading?: boolean;
  is_bookmarked?: boolean; // ✅ NEW
  onBookmarkToggle?: () => void; // ✅ NEW
};

const DatasetCard = ({
  dataset,
  handleSingleDataModal,
  handleDownloadDataClick,
  handleBookmarkDataset,
  handleShareDataset,
}: DatasetCardProps) => {
  const limitWordByBoundary = (text: string, limit: number = 100): string => {
    if (text.length <= limit) return text;
    const boundary = text.lastIndexOf(' ', limit);
    return boundary !== -1
      ? text.slice(0, boundary) + '...'
      : text.slice(0, limit) + '...';
  };
  const formattedDescription = limitWordByBoundary(dataset.description, 100);
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex flex-[1] items-start justify-between">
        <div className="flex items-center gap-2">
          {dataset.is_private ? (
            <span className="rounded bg-orange-100 px-2 py-1 text-sm font-medium text-orange-700">
              ${dataset.price}
            </span>
          ) : (
            <Badge className="rounded bg-green-100 px-2 text-sm font-medium text-green-700">
              Free
            </Badge>
          )}
          {dataset.is_private && (
            <div className="flex items-center gap-1 text-pink-600">
              <div className="flex h-3 w-3 items-center justify-center rounded-full border border-pink-600">
                <div className="h-1.5 w-1.5 rounded-full bg-pink-600"></div>
              </div>
              <span className="text-sm font-medium">Private</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="focus-ring-0 focus:outline-none"
            >
              <Button
                variant="ghost"
                className="border-0 bg-transparent p-1 shadow-none hover:bg-gray-50 focus:ring-0"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              sideOffset={5}
              className="border-primary/30 w-56 bg-white shadow-xl"
              avoidCollisions={true}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleBookmarkDataset?.(dataset.id)}
              >
                <Bookmark
                  className={cn(`mr-2 h-4 w-4`, {
                    'fill-yellow-500 text-yellow-500': dataset.is_bookmarked,
                  })}
                />
                {/* {dataset?.is_bookmarked.toString()} */}
                {dataset.is_bookmarked ? 'Remove Bookmark' : 'Save'}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleShareDataset?.(dataset)}
                className="cursor-pointer"
              >
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleSingleDataModal(dataset)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDownloadDataClick?.(dataset)}
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* {dataset.is_bookmarked && (
            <Bookmark
              className={cn(`h-5 w-5`, {
                'fill-yellow-500 text-yellow-500': dataset.is_bookmarked,
              })}
              role="button"
              aria-label={dataset.is_bookmarked ? 'Remove Bookmark' : 'Save'}
            />
          )} */}
        </div>
      </div>
      <div className="flex flex-[10] flex-col gap-1">
        {/* Title and Rating */}
        <h3 className="mb-2 text-lg leading-tight font-semibold text-gray-900">
          {dataset.title}
        </h3>
        {/* Author and rating */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <small>
            {dataset.authors.map((author) => (
              <span className="text-sm text-gray-600" key={author.id}>
                {author.first_name}
              </span>
            ))}
          </small>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">{1.2}K</span>
            <span className="text-xs text-gray-500">
              ({dataset.review_count ?? 0} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          {formattedDescription}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {dataset.tags.map((tag, index) => (
            <Badge
              key={index}
              variant={'outline'}
              className="border-primary/10 rounded-full bg-gray-100 px-2 py-[0.8px] text-xs text-gray-700 transition-colors hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Available To */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            Available to:
          </p>
          <div className="flex flex-wrap gap-2">
            {/* {availableTo.map((type, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm text-gray-600">{type}</span>
            </div>
          ))} */}
            {getIntendedAudienceIcon(dataset.intended_audience)}
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Updated: {moment(dataset.updated_at).format('LL')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Database className="h-4 w-4" />
            <span>
              {/* CSV,Shapefile,XLSX,PDF  */}
              {dataset.dataset_size}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="h-4 w-4" />
            <span>{dataset.download_count} downloads</span>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-[1] gap-2 justify-self-end">
        <Button
          variant={'outline'}
          onClick={() => handleSingleDataModal(dataset)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
        <Button
          variant={'default'}
          onClick={() => handleDownloadDataClick(dataset)}
          className="bg-primary hover:bg-primary/90 flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-white transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default DatasetCard;
