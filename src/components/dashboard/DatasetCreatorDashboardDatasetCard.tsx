import { getIntendedAudienceIcon } from '@/lib/get-intended-audience-icon';
import type { IDataset } from '@/lib/types/data-set';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Calendar,
  Download,
  Eye,
  FileText,
  Lock,
  MoreHorizontal,
} from 'lucide-react';
import moment from 'moment';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type DatasetCardProps = {
  dataset: IDataset;
  onEdit: (dataset: IDataset) => void;
  onDelete: (dataset: IDataset) => void;
};
export default function DatasetCreatorDashboardDatasetCard({
  dataset,
  onEdit,
  onDelete,
}: DatasetCardProps) {
  // const extractIntendedAudience = (audience:) => {}
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {!dataset.is_premium ? (
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              Free
            </span>
          ) : (
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
              $ {dataset.price ?? 0}
            </span>
          )}
          {dataset.status && (
            <span
              className={cn(
                'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium',
                getStatusLabelColor(dataset.status),
              )}
            >
              <Calendar className="h-3 w-3" />
              {dataset.status === 'PB'
                ? 'Published'
                : dataset.status === 'AR'
                  ? 'Archived'
                  : 'Draft'}
            </span>
          )}
          {dataset.is_private && (
            <span className="flex items-center gap-1 rounded bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700">
              <Lock className="h-3 w-3" />
              Private
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {/* <Button variant="outline"> */}{' '}
              <MoreHorizontal className="h-5 w-5" />
              {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="border-primary/30 w-56 bg-white shadow-lg"
              align="center"
            >
              <DropdownMenuLabel className="border-primary/30 border-b">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(dataset)}>
                  Edit
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(dataset)}>
                  Delete
                  <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  View Details
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Actions</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="border-primary/30 w-48 border bg-white shadow-lg">
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem>Draft</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Publish</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {/* <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </button>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {dataset.title}
      </h3>
      <p className="mb-1 text-sm text-gray-600">
        {/* Dr {dataset.author} •{' '}
        <span className="text-blue-600">★ {dataset.reviews}</span> */}
        {dataset.authors.map((author, index) => (
          <span key={index}>
            {author.first_name} {author.last_name}
            {index < dataset.authors.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>

      <p className="mb-4 line-clamp-2 text-sm text-gray-700">
        {dataset.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {dataset.tags.map((tag, index) => (
          <span
            key={index}
            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs text-gray-600">Available to:</p>
        <div className="flex flex-wrap gap-2">
          {getIntendedAudienceIcon(dataset.intended_audience)}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated: {moment(dataset.updated_at).fromNow()}
          </span>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {/* {dataset.formats.join(', ')} ({dataset.size}) */}
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {dataset.download_count}
          </span>
        </div>
      </div>

      <div className="flex gap-2 text-sm whitespace-nowrap">
        <Button
          variant={'outline'}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
        <Button
          type="button"
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}
function getStatusLabelColor(status: IDataset['status']) {
  switch (status) {
    case 'PB':
      return 'bg-green-100 text-green-800';
    case 'DF':
      return 'bg-yellow-100 text-yellow-800';
    case 'AR':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
