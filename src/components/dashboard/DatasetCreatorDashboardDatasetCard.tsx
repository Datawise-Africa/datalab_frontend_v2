import { getIntendedAudienceIcon } from '@/lib/get-intended-audience-icon';
import type { DatasetStatus, IDataset } from '@/lib/types/data-set';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  ChevronRight,
  Edit,
  FileText,
  Lock,
  MoreHorizontal,
  Settings,
  Share2,
  Trash2,
} from 'lucide-react';
import moment from 'moment';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useDatasetMutations } from '@/hooks/use-dataset-creator-datasets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { shareDataset } from '@/lib/utils/share-dataset';
import { toast } from 'sonner';

type DatasetCardProps = {
  dataset: IDataset;
  onEdit: (dataset: IDataset) => void;
  onDelete: (dataset: IDataset['id']) => void;
};
export default function DatasetCreatorDashboardDatasetCard({
  dataset,
  onEdit,
  onDelete,
}: DatasetCardProps) {
  const mut = useDatasetMutations();
  const changeStatus = async (datasetId: string, status: DatasetStatus) => {
    await mut.changeDatasetStatus.mutateAsync([datasetId, status], {
      onSuccess: () => {
        toast.success(`Dataset status changed to ${status}`);
      },
      onError: (error) => {
        // setError(extractCorrectErrorMessage(error));
        // toast.error(
        //   `Failed to change status: ${extractCorrectErrorMessage(error)}`,
        // );
        // setIsLoading(false);
        toast.error(
          `Failed to change status: ${extractCorrectErrorMessage(error, 'Unknown error')}`,
        );
      },
      onSettled: () => {},
    });
  };
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
          <DatasetActionsMenu
            dataset={dataset}
            onEdit={onEdit}
            // onViewDetails={() => {}}
            // onDuplicate={() => {}}
            onDelete={onDelete}
            changeStatus={changeStatus}
          />
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
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {/* {fileSize} */}
          {dataset.dataset_size}
        </span>
      </div>

      {/* <div className="flex gap-2 text-sm whitespace-nowrap">
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
      </div> */}
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

interface DatasetActionsMenuProps {
  dataset: any;
  onEdit: (dataset: any) => void;
  // onViewDetails: (dataset: any) => void;
  // onDuplicate?: (dataset: any) => void;
  onShare?: (dataset: any) => void;
  onDelete: (datasetId: string) => void;
  changeStatus?: (datasetId: string, status: DatasetStatus) => void;
}

export function DatasetActionsMenu({
  dataset,
  onEdit,
  // onViewDetails,
  // onDuplicate,
  onDelete,
  changeStatus,
}: DatasetActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-primary/10 hover:text-primary h-8 w-8 p-0 transition-colors duration-200"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="border-primary/20 w-64 rounded-lg border bg-white p-1 shadow-xl"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="border-primary/10 border-b px-3 py-2 text-sm font-semibold text-gray-900">
          Dataset Actions
        </DropdownMenuLabel>

        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            onClick={() => onEdit(dataset)}
            className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Dataset</span>
            {/* <DropdownMenuShortcut className="text-primary/60">
              ⇧⌘E
            </DropdownMenuShortcut> */}
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            onClick={() => onViewDetails(dataset)}
            className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
            <DropdownMenuShortcut className="text-primary/60">
              ⌘V
            </DropdownMenuShortcut>
          </DropdownMenuItem> */}

          {/* <DropdownMenuItem
            onClick={() => onDuplicate?.(dataset)}
            className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
          >
            <Copy className="h-4 w-4" />
            <span>Duplicate</span>
            <DropdownMenuShortcut className="text-primary/60">
              ⌘D
            </DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-primary/10 my-1" />

        <DropdownMenuGroup className="py-1">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150">
              <Settings className="h-4 w-4" />
              <span>Change Status</span>
              <ChevronRight className="ml-auto h-3 w-3" />
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="border-primary/20 ml-1 w-48 rounded-lg border bg-white p-1 shadow-xl">
                <DropdownMenuItem
                  onClick={() => changeStatus?.(dataset.id, 'PB')}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-green-50 hover:text-green-700"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Publish</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-green-100 text-xs text-green-700"
                  >
                    Live
                  </Badge>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => changeStatus?.(dataset.id, 'DF')}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span>Draft</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-yellow-100 text-xs text-yellow-700"
                  >
                    Draft
                  </Badge>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => changeStatus?.(dataset.id, 'AR')}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-gray-50 hover:text-gray-700"
                >
                  <div className="h-2 w-2 rounded-full bg-gray-500" />
                  <span>Archive</span>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-gray-100 text-xs text-gray-700"
                  >
                    Archived
                  </Badge>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem
            onClick={() => shareDataset(dataset)}
            className="hover:bg-primary/5 hover:text-primary focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Dataset</span>
            {/* <DropdownMenuShortcut className="text-primary/60">
              ⌘S
            </DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-primary/10 my-1" />

        <DropdownMenuGroup className="py-1">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Dataset</span>
                {/* <DropdownMenuShortcut className="text-red-500/60">
                  ⌘⌫
                </DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent className="border-primary/20 border bg-white shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Dataset
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to delete "{dataset.title}"? This action
                  cannot be undone and will permanently remove all associated
                  data and files.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel className="transition-colors duration-150 hover:bg-gray-50">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(dataset.id)}
                  className="bg-red-600 text-white transition-colors duration-150 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Dataset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
