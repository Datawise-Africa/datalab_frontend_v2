import { Card } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export default function DatasetCardSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="h-full">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card className="h-full overflow-hidden p-5">
      {/* Header with price and private tag */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-14 bg-gray-300" />
          <Skeleton className="h-7 w-20 bg-gray-300" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full bg-gray-300" />
      </div>

      {/* Title */}
      <Skeleton className="mb-1 h-7 w-4/5 bg-gray-300" />
      <Skeleton className="mb-4 h-7 w-3/5 bg-gray-300" />

      {/* Author and rating */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-1/3 bg-gray-300" />
        <Skeleton className="h-5 w-1/4 bg-gray-300" />
      </div>

      {/* Description */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-5 w-full bg-gray-300" />
        <Skeleton className="h-5 w-full bg-gray-300" />
        <Skeleton className="h-5 w-2/3 bg-gray-300" />
      </div>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-8 w-24 bg-gray-300" />
        <Skeleton className="h-8 w-20 bg-gray-300" />
        <Skeleton className="h-8 w-32 bg-gray-300" />
      </div>

      {/* Available to */}
      <div className="mb-2">
        <Skeleton className="mb-2 h-5 w-24 bg-gray-300" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Skeleton className="h-8 w-full bg-gray-300" />
          <Skeleton className="h-8 w-full bg-gray-300" />
          <Skeleton className="h-8 w-full bg-gray-300" />
          <Skeleton className="h-8 w-full bg-gray-300" />
        </div>
      </div>

      {/* Updated date */}
      <Skeleton className="mb-2 h-5 w-40 bg-gray-300" />

      {/* File formats */}
      <Skeleton className="mb-2 h-5 w-full bg-gray-300" />

      {/* Downloads */}
      <Skeleton className="mb-4 h-5 w-32 bg-gray-300" />

      {/* Buttons */}
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-10 w-32 bg-gray-300" />
        <Skeleton className="h-10 w-32 bg-gray-300" />
      </div>
    </Card>
  );
}
