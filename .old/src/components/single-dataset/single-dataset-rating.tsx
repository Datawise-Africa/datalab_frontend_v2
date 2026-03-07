import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/star-rating';
import { Star, User, Edit2, Save, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import type { IDataset, DatasetReviewType } from '@/lib/types/data-set';

interface SingleDatasetRatingProps {
  dataset: IDataset;
  onEditReview?: (reviewId: number, rating: number, comment: string) => Promise<void>;
}

export function SingleDatasetRating({
  dataset,
  onEditReview,
}: SingleDatasetRatingProps) {
  const { reviews, review_count, average_review } = dataset;
  const { user } = useAuthStore();
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditStart = (review: DatasetReviewType) => {
    setEditingReview(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const handleEditCancel = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment('');
  };

  const handleEditSubmit = async (reviewId: number) => {
    if (!onEditReview || editRating === 0) return;

    setIsSubmitting(true);
    try {
      await onEditReview(reviewId, editRating, editComment);
      setEditingReview(null);
      setEditRating(0);
      setEditComment('');
    } catch (error) {
      console.error('Failed to update review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canEditReview = (review: DatasetReviewType) => {
    return user && user.user_id === review.user.id;
  };



  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating rating={average_review} readonly size="md" />
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{average_review?.toFixed(1) ?? 0}</span> (
            {review_count} {review_count === 1 ? 'review' : 'reviews'})
          </div>
        </div>

        {/* Reviews List */}
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  {editingReview === review.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.user.first_name} {review.user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Rating
                          </label>
                          <StarRating
                            rating={editRating}
                            onRatingChange={setEditRating}
                            size="md"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Comment
                          </label>
                          <Textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Share your thoughts about this dataset..."
                            rows={3}
                            className="resize-none"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditSubmit(review.id)}
                            disabled={isSubmitting || editRating === 0}
                            size="sm"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleEditCancel}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user.first_name} {review.user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} readonly size="sm" />
                          {canEditReview(review) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStart(review)}
                              className="ml-2"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Star className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400">Be the first to review this dataset</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
