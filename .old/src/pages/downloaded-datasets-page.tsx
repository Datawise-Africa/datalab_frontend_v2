import {
  useUserDownloadedDatasets,
  type DownloadedDatasetType,
} from '@/hooks/use-user-dataset-downloads';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Calendar,
  User,
  Target,
  FileText,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import moment from 'moment';
import { useSidebar } from '@/store/use-sidebar-store';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAxios } from '@/hooks/use-axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/store/auth-store';
import { type SubmitReviewSchemaType } from '@/lib/schema/upload-dataset-schema';
import { DatasetReviewModal } from '@/components/Modals/DataModals/DatasetReviewModal';

type ReviewType = {
  id: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  dataset: string;
  rating: number;
  comment: string;
  created_at: string;
};

// Star Rating Component
function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'sm',
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            'transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
          )}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        >
          <Star
            className={cn(
              sizeClasses[size],
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300',
            )}
          />
        </button>
      ))}
    </div>
  );
}

// Review Component
function ReviewCard({
  review,
  // onVote,
}: {
  review: ReviewType;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (user: ReviewType['user']) => {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  };

  return (
    <div className="space-y-3 rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xs">
              {getInitials(review.user)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.user.email}</p>
            <div className="flex items-center space-x-2">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-xs text-gray-500">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-gray-700">{review.comment}</p>

      {/* <div className="flex items-center space-x-4 pt-2">
        <span className="text-xs text-gray-500">Was this helpful?</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2',
              review.userVote === 'helpful' && 'bg-green-100 text-green-700',
            )}
            // onClick={() => onVote(review.id, 'helpful')}
          >
            <ThumbsUp className="mr-1 h-3 w-3" />
            {review.helpful}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 px-2',
              review.userVote === 'not-helpful' && 'bg-red-100 text-red-700',
            )}
            // onClick={() => onVote(review.id, 'not-helpful')}
          >
            <ThumbsDown className="mr-1 h-3 w-3" />
            {review.notHelpful}
          </Button>
        </div>
      </div> */}
    </div>
  );
}

// Reviews Section Component
function ReviewsSection({
  datasetId,
  datasetName,
}: {
  datasetId: string;
  datasetName: string;
}) {
  const { session_id } = useAuth();
  const queryKeys = {
    all: ['dataset-reviews'] as const,
    reviews: (session_id: string, datasetId: string) =>
      [...queryKeys.all, 'list', session_id, datasetId] as const,
  };

  const apiClient = useAxios();
  const reviewsQuery = useQuery({
    queryKey: queryKeys.reviews(session_id!, datasetId),
    queryFn: async () => {
      const { data } = await apiClient.get<ReviewType[]>(`/data/reviews/`);
      return data;
    },
  });

  const reviewMutation = useMutation({
    mutationKey: ['submit-review'],
    mutationFn: (data: SubmitReviewSchemaType) => {
      return apiClient.post(`/data/reviews/`, data);
    },
    onSuccess: () => {
      reviewsQuery.refetch();
    },
  });

  const [showAllReviews, setShowAllReviews] = useState(false);

  // const handleVote = (reviewId: number, vote: 'helpful' | 'not-helpful') => {
  //   setReviews((prev) =>
  //     prev.map((review) => {
  //       if (review.id === reviewId) {
  //         const newReview = { ...review };

  //         // Remove previous vote if exists
  //         if (review.userVote === 'helpful') {
  //           newReview.helpful -= 1;
  //         } else if (review.userVote === 'not-helpful') {
  //           newReview.notHelpful -= 1;
  //         }

  //         // Add new vote if different from current
  //         if (review.userVote !== vote) {
  //           if (vote === 'helpful') {
  //             newReview.helpful += 1;
  //           } else {
  //             newReview.notHelpful += 1;
  //           }
  //           newReview.userVote = vote;
  //         } else {
  //           newReview.userVote = null;
  //         }

  //         return newReview;
  //       }
  //       return review;
  //     }),
  //   );
  // };

  const averageRating = useMemo(() => {
    if (reviewsQuery.data && reviewsQuery.data.length > 0) {
      return (
        reviewsQuery.data.reduce((sum, review) => sum + review.rating, 0) /
        reviewsQuery.data.length
      );
    }
    return 0;
  }, [reviewsQuery.data]);

  const reviews = useMemo(
    () => (reviewsQuery.data || []).filter((rv) => rv.dataset === datasetId),
    [reviewsQuery.data],
  );

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium">Reviews ({reviews.length})</h3>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2">
              <StarRating
                rating={Math.round(averageRating)}
                readonly
                size="sm"
              />
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} average
              </span>
            </div>
          )}
        </div>
        <DatasetReviewModal
          datasetId={datasetId}
          datasetName={datasetName}
          onSubmitReview={reviewMutation.mutateAsync}
        />
      </div>

      {reviews.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm">
            No reviews yet. Be the first to review this dataset!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {reviews.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full"
            >
              {showAllReviews
                ? 'Show Less'
                : `Show ${reviews.length - 2} More Reviews`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Loading Skeleton Component
function DatasetCardSkeleton() {
  return (
    <Card className="w-full border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="border-primary/10 space-y-4 border bg-white">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

// Dataset Card Component
function DatasetCard({ dataset }: { dataset: DownloadedDatasetType }) {
  // const [rating, setRating] = useState(0)
  // const [isRated, setIsRated] = useState(false)
  const [showReviews, setShowReviews] = useState(false);

  // const handleRatingChange = (newRating: number) => {
  //   setRating(newRating)
  //   setIsRated(true)
  //   // Here you would typically send the rating to your backend
  //   console.log(`Rated dataset ${dataset.id} with ${newRating} stars`)
  // }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   })
  // }

  const getLocationString = () => {
    if (dataset.download_country) {
      return `${dataset.download_country}, ${dataset.download_continent}`;
    }
    return dataset.download_continent;
  };

  return (
    <Card className="border-primary/10 w-full bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900">
              {dataset.dataset.title}
            </CardTitle>
            <p>
              <Badge className="text-sm text-gray-600" variant={'outline'}>
                {dataset.dataset.category.title}
              </Badge>
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              Downloaded on {moment(dataset.download_date).format('LL')}
            </div>
          </div>
          {/* <Badge variant="secondary" className="ml-4">
            ID: {dataset.id}
          </Badge> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 border border-gray-100 bg-white whitespace-pre-wrap">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Intended Use
                </p>
                <p className="text-sm text-gray-600">{dataset.intended_use}</p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Target Audience
                </p>
                <p className="text-sm text-gray-600">
                  {dataset.intended_audience}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Download Location
                </p>
                <p className="text-sm text-gray-600">{getLocationString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Project Description
                </p>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {dataset.project_description}
                </p>
              </div>
            </div>

            {/* <div className="flex items-start space-x-2">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Contact</p>
                <p className="text-sm text-gray-600">{dataset.email_address}</p>
              </div>
            </div> */}

            {/* <div className="flex items-start space-x-2">
              <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Downloaded by
                </p>
                <p className="text-sm text-gray-600">{fullName}</p>
              </div>
            </div> */}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          {/* <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Rate this dataset:</span>
            <StarRating rating={rating} onRatingChange={handleRatingChange} readonly={false} />
            {isRated && <span className="text-sm text-green-600 ml-2">Thanks for rating!</span>}
          </div> */}

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 flex items-center"
              size="sm"
              onClick={() => setShowReviews(!showReviews)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {showReviews ? 'Hide Reviews' : 'View Reviews'}
            </Button>
            {/* <Button variant="outline" size="sm">
              View Details
            </Button> */}
          </div>
        </div>

        {showReviews && (
          <>
            <Separator />
            <ReviewsSection
              datasetId={dataset.dataset.id}
              datasetName={dataset.dataset.title}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DownloadedDatasetsPage() {
  const { data, error, isLoading } = useUserDownloadedDatasets();
  const { isMobile, isCollapsed } = useSidebar();

  // Calculate grid columns based on sidebar state and available space
  const getGridColumns = () => {
    if (isMobile) {
      return 'grid-cols-1 min-[480px]:grid-cols-2';
    }

    if (isCollapsed) {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4 text-center">
            <Skeleton className="mx-auto h-10 w-64" />
            <Skeleton className="mx-auto h-6 w-96" />
          </div>

          <div className={cn('grid gap-2', getGridColumns())}>
            {Array.from({ length: 4 }).map((_, index) => (
              <DatasetCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Error Loading Datasets
          </h2>
          <p className="max-w-md text-gray-600">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <FileText className="text-primary h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            No Downloaded Datasets
          </h2>
          <p className="max-w-md text-gray-600">
            You haven't downloaded any datasets yet. Start exploring our dataset
            collection to find data for your projects.
          </p>
          <Link
            to={'/'}
            className="bg-primary hover:bg-preimary/90 inline-block rounded px-4 py-2 text-white"
          >
            Browse Datasets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
            Downloaded Datasets
          </h1>
          <p className="text-gray-600 md:text-lg">
            Manage, rate, and review your downloaded datasets ({data.length}{' '}
            total)
          </p>
        </div>

        <div className={cn('grid gap-2', getGridColumns())}>
          {data.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </div>
    </div>
  );
}
