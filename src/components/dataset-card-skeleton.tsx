export function DatasetCardSkeleton() {
  return (
    <div className="border border-subtle rounded-lg p-4 bg-white shadow-sm animate-pulse">
      {/* Price tags */}
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-12 bg-gray-200 rounded"></div>
        <div className="h-6 w-12 bg-gray-200 rounded"></div>
        <div className="h-6 w-12 bg-gray-200 rounded"></div>
      </div>

      {/* Title */}
      <div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-7 bg-gray-200 rounded w-1/2 mb-4"></div>

      {/* Author */}
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>

      {/* Description */}
      <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-4/5 mb-4"></div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>

      {/* Available to */}
      <div className="h-5 bg-gray-200 rounded w-28 mb-2"></div>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="h-6 w-28 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* Updated date */}
      <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>

      {/* File formats */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>

      {/* Downloads */}
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
