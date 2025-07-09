import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SingleDatasetRatingProps {
  datasetId: string;
  currentRating?: number;
  reviewCount: number;
  averageRating: number;
  onRatingSubmit?: (rating: number, comment?: string) => Promise<void>;
}

export function SingleDatasetRating({
  currentRating = 0,
  reviewCount,
  averageRating,
  onRatingSubmit,
}: SingleDatasetRatingProps) {
  const [rating, setRating] = useState(currentRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
    setShowCommentBox(true);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onRatingSubmit?.(rating, comment);
      setShowCommentBox(false);
      setComment('');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Rate this dataset
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Rating Display */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'h-6 w-6',
                  star <= averageRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300',
                )}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{averageRating ?? 0}</span> (
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </div>
        </div>

        {/* Rating Input */}
        <div className="space-y-4">
          <p className="font-medium text-gray-700">Your rating:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="rounded-full p-1 transition-colors hover:bg-gray-100"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingClick(star)}
              >
                <Star
                  className={cn(
                    'h-8 w-8 cursor-pointer transition-all duration-200',
                    {
                      'scale-110 fill-yellow-400 text-yellow-400':
                        star <= (hoverRating || rating),
                      'text-gray-300 hover:text-yellow-300':
                        star > (hoverRating || rating),
                    },
                  )}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-sm text-gray-600">
              {rating === 1 && 'Poor - Not useful'}
              {rating === 2 && 'Fair - Somewhat useful'}
              {rating === 3 && 'Good - Useful'}
              {rating === 4 && 'Very Good - Very useful'}
              {rating === 5 && 'Excellent - Extremely useful'}
            </p>
          )}
        </div>

        {/* Comment Box */}
        {showCommentBox && (
          <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Add a comment (optional)
              </label>
            </div>
            <Textarea
              placeholder="Share your thoughts about this dataset..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentBox(false);
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
