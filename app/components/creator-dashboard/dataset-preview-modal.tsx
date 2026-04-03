import moment from 'moment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { Loader2, User, Calendar, BookOpen, Eye, MapPin } from 'lucide-react';
import { useDataset } from '~/features/datasets';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import {
  DATASET_STATUS_LABELS,
  DATASET_STATUS_VARIANTS,
} from '~/features/my-datasets/types';

interface DatasetPreviewModalProps {
  datasetId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetPreviewModal({
  datasetId,
  open,
  onOpenChange,
}: Readonly<DatasetPreviewModalProps>) {
  const { data: dataset, isLoading } = useDataset(datasetId ?? '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Dataset Preview
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading preview...
            </span>
          </div>
        )}

        {!isLoading && !dataset && (
          <div className="py-12 text-center text-muted-foreground">
            Dataset not found.
          </div>
        )}

        {dataset && <PreviewContent dataset={dataset} />}
      </DialogContent>
    </Dialog>
  );
}

function PreviewContent({
  dataset,
}: Readonly<{ dataset: MyDatasetInterface }>) {
  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].user.first_name} ${dataset.authors[0].user.last_name}`
      : 'Unknown';

  const regions = dataset.origin_region
    ? dataset.origin_region
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium border-0',
              DATASET_STATUS_VARIANTS[dataset.status]
            )}
          >
            {DATASET_STATUS_LABELS[dataset.status]}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {dataset.dataset_type}
          </Badge>
          {dataset.is_premium && (
            <Badge className="bg-primary text-white">Premium</Badge>
          )}
          {dataset.is_private && (
            <Badge variant="outline" className="text-muted-foreground">
              Private
            </Badge>
          )}
        </div>
        <h2 className="text-xl font-bold tracking-tight">{dataset.name}</h2>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Updated: {moment(dataset.updated_at).format('YYYY-MM-DD')}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {dataset.description}
        </p>
      </div>

      {/* Tags */}
      {dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {dataset.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Origin Regions */}
      {regions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Origin Regions
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {regions.map((r) => (
              <Badge key={r} variant="secondary" className="text-xs">
                {r}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Category + Access */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          Category: {dataset.category.name}
        </span>
        <span className="capitalize">Access: {dataset.access.access_type}</span>
        {dataset.workspace && <span>Workspace: {dataset.workspace.name}</span>}
      </div>

      {dataset.access.access_instructions && (
        <div className="rounded-md border p-3">
          <p className="text-xs font-medium mb-1">Access Instructions</p>
          <p className="text-xs text-muted-foreground">
            {dataset.access.access_instructions}
          </p>
        </div>
      )}

      <Separator />

      {/* License */}
      {dataset.license && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Usage License</h3>
          <p className="text-xs text-muted-foreground">
            {dataset.license.name}
            {dataset.license.description && (
              <span className="block mt-1">{dataset.license.description}</span>
            )}
          </p>
        </div>
      )}

      <Separator />

      {/* Authors */}
      {dataset.authors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Authors</h3>
          <div className="space-y-2">
            {dataset.authors.map((author) => (
              <div key={author.user.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {author.user.first_name} {author.user.last_name}
                  </p>
                  {author.user.email && (
                    <p className="text-xs text-muted-foreground">
                      {author.user.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground capitalize">
                    {author.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <Separator />
      <div className="flex gap-6 text-xs text-muted-foreground">
        <span>Created: {moment(dataset.created_at).format('YYYY-MM-DD')}</span>
        <span>Updated: {moment(dataset.updated_at).format('YYYY-MM-DD')}</span>
      </div>
    </div>
  );
}
