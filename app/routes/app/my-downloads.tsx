import { useState } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import type { Route } from './+types/my-downloads';
import { generateSEOTags } from '~/lib/utils/seo';
import { useDownloadHistory } from '~/features/downloads';
import { useCreateReview } from '~/features/reviews';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '~/components/ui/empty';
import { Loader2, Download, Star, ExternalLink } from 'lucide-react';
import { cn } from '~/lib/utils';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'My Downloads',
    description: 'Your download history',
  });
}

export default function MyDownloads() {
  const { data: response, isLoading } = useDownloadHistory();
  const downloads = response?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Downloads</h1>
        <p className="text-sm text-muted-foreground">
          Your download history and dataset reviews
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !downloads || downloads.length === 0 ? (
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {downloads.map((record) => (
            <DownloadCard
              key={record.id}
              datasetId={record.dataset.id}
              datasetTitle={record.dataset.title}
              format={record.format}
              downloadedAt={record.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DownloadCard({
  datasetId,
  datasetTitle,
  format,
  downloadedAt,
}: {
  datasetId: string;
  datasetTitle: string;
  format: string;
  downloadedAt: string;
}) {
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const createReview = useCreateReview();

  const handleSubmitReview = () => {
    if (rating === 0) return;
    createReview.mutate(
      { dataset: datasetId, rating, comment },
      {
        onSuccess: () => {
          setShowReview(false);
          setRating(0);
          setComment('');
        },
      }
    );
  };

  return (
    <Card className="py-0">
      <CardContent className="p-5 space-y-3">
        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/datasets/${datasetId}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
          >
            {datasetTitle}
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </Link>
          {format && (
            <Badge
              variant="secondary"
              className="shrink-0 bg-primary/10 text-primary text-xs"
            >
              {format.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Downloaded date */}
        <p className="text-xs text-muted-foreground">
          Downloaded {moment(downloadedAt).fromNow()}
        </p>

        {/* Review toggle */}
        {!showReview ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setShowReview(true)}
          >
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Leave a review
          </Button>
        ) : (
          <div className="space-y-3 rounded-lg border p-3">
            {/* Star rating */}
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
                      'h-5 w-5 transition-colors',
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

            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this dataset..."
              rows={2}
              className="text-sm"
            />

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={handleSubmitReview}
                disabled={rating === 0 || createReview.isPending}
              >
                {createReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowReview(false);
                  setRating(0);
                  setComment('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
