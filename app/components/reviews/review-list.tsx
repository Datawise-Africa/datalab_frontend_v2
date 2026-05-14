import { useState } from 'react';
import { Star, ThumbsUp, Loader2 } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { cn } from '~/lib/utils';
import moment from 'moment';

interface Review {
  id: string | number;
  user: {
    first_name: string;
    last_name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
  helpful_count?: number;
}

interface ReviewListProps {
  reviews: Review[];
  showForm?: boolean;
  onSubmitReview?: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

function StarRating({
  rating,
  interactive,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-muted-foreground/30',
            interactive &&
              'cursor-pointer hover:text-amber-400 hover:fill-amber-400 transition-colors'
          )}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

export function ReviewList({
  reviews,
  showForm,
  onSubmitReview,
  isSubmitting,
}: ReviewListProps) {
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState('');

  const handleSubmit = () => {
    if (formRating > 0 && formComment.trim()) {
      onSubmitReview?.(formRating, formComment.trim());
      setFormRating(0);
      setFormComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Write a review form */}
      {showForm && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <h4 className="text-sm font-medium">Write a Review</h4>
            <StarRating
              rating={formRating}
              interactive
              onRate={setFormRating}
            />
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder="Share your thoughts about this dataset..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              onClick={handleSubmit}
              disabled={formRating === 0 || !formComment.trim() || isSubmitting}
              size="sm"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No reviews yet. Be the first to leave a review.
        </p>
      ) : (
        reviews.map((review) => {
          const initials =
            `${review.user.first_name?.[0] ?? ''}${review.user.last_name?.[0] ?? ''}`.toUpperCase();

          return (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {review.user.first_name} {review.user.last_name}
                      </span>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {moment(review.created_at).fromNow()}
                      </span>
                      {review.helpful_count !== undefined && (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Helpful ({review.helpful_count})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
