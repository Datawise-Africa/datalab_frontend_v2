import { Card } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export default function DatasetCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
    <Card className="overflow-hidden p-5 h-full">
      {/* Header with price and private tag */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-14 bg-gray-300" />
          <Skeleton className="h-7 w-20 bg-gray-300" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full bg-gray-300" />
      </div>

      {/* Title */}
      <Skeleton className="h-7 w-4/5 mb-1 bg-gray-300" />
      <Skeleton className="h-7 w-3/5 mb-4 bg-gray-300" />

      {/* Author and rating */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-1/3 bg-gray-300" />
        <Skeleton className="h-5 w-1/4 bg-gray-300" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-5 w-full bg-gray-300" />
        <Skeleton className="h-5 w-full bg-gray-300" />
        <Skeleton className="h-5 w-2/3 bg-gray-300" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-8 w-24 bg-gray-300" />
        <Skeleton className="h-8 w-20 bg-gray-300" />
        <Skeleton className="h-8 w-32 bg-gray-300" />
      </div>

      {/* Available to */}
      <div className="mb-2">
        <Skeleton className="h-5 w-24 mb-2 bg-gray-300" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Skeleton className="h-8 w-full bg-gray-300" />
          <Skeleton className="h-8 w-full bg-gray-300" />
          <Skeleton className="h-8 w-full bg-gray-300" />
          <Skeleton className="h-8 w-full bg-gray-300" />
        </div>
      </div>

      {/* Updated date */}
      <Skeleton className="h-5 w-40 mb-2 bg-gray-300" />

      {/* File formats */}
      <Skeleton className="h-5 w-full mb-2 bg-gray-300" />

      {/* Downloads */}
      <Skeleton className="h-5 w-32 mb-4 bg-gray-300" />

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <Skeleton className="h-10 w-32 bg-gray-300" />
        <Skeleton className="h-10 w-32 bg-gray-300" />
      </div>
    </Card>
  );
}
