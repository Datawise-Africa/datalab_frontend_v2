import { useState } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import type { Route } from './+types/my-downloads';
import { generateSEOTags } from '~/lib/utils/seo';
import {
  useDownloadHistory,
  useReviewDownload,
  type DownloadRecord,
} from '~/features/downloads';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '~/components/ui/empty';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import { Loader2, Download, Star, ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '~/lib/utils';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'My Downloads',
    description: 'Your download history',
  });
}

export default function MyDownloads() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [reviewTarget, setReviewTarget] = useState<DownloadRecord | null>(null);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useDownloadHistory({ page, limit });
  const downloads = response?.data ?? [];
  const total = response?.meta?.total_docs ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Downloads</h1>
          <p className="text-sm text-muted-foreground">
            Your download history and dataset reviews
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5"
        >
          <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {total.toLocaleString()}
              </span>{' '}
              {total === 1 ? 'download' : 'downloads'}
            </>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : downloads.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Download />
            </EmptyMedia>
            <EmptyTitle>No downloads yet</EmptyTitle>
            <EmptyDescription>
              Datasets you download will be listed here for reference.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {downloads.map((record) => (
              <DownloadCard
                key={record.id}
                record={record}
                onReview={() => setReviewTarget(record)}
              />
            ))}
          </div>

          <PaginationControls
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </>
      )}

      <ReviewDialog
        record={reviewTarget}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );
}

function DownloadCard({
  record,
  onReview,
}: Readonly<{
  record: DownloadRecord;
  onReview: () => void;
}>) {
  const { id: datasetId, name, dataset_type, is_premium } = record.dataset;
  return (
    <Card className="py-0">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/datasets/${datasetId}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
          >
            {name}
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            {dataset_type && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary text-xs"
              >
                {dataset_type.toUpperCase()}
              </Badge>
            )}
            {is_premium && (
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Downloaded {moment(record.download_date).fromNow()}
        </p>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={onReview}
        >
          <Star className="mr-1.5 h-3.5 w-3.5" />
          Leave a review
        </Button>
      </CardContent>
    </Card>
  );
}

function ReviewDialog({
  record,
  onClose,
}: Readonly<{
  record: DownloadRecord | null;
  onClose: () => void;
}>) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const reviewDownload = useReviewDownload();

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    onClose();
  };

  const handleSubmit = () => {
    if (!record || rating === 0) return;
    reviewDownload.mutate(
      {
        download_id: record.id,
        dataset_id: record.dataset.id,
        rating,
        comment,
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog
      open={!!record}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review dataset</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {record?.dataset.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Rating
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      'h-6 w-6 transition-colors',
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Comment
            </p>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this dataset..."
              rows={4}
              className="text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={reviewDownload.isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={rating === 0 || reviewDownload.isPending}
          >
            {reviewDownload.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
