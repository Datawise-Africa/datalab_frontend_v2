import { DatasetCardSkeleton } from './dataset-card-skeleton';

export function DatasetsLoader({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <DatasetCardSkeleton key={index} />
      ))}
    </div>
  );
}
