import { Bookmark, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <div className="mx-auto max-w-md px-6 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-100 p-6 transition-colors hover:bg-gray-200">
            {icon || <Bookmark className="h-12 w-12 text-gray-400" />}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-semibold text-gray-900">{title}</h3>

        {/* Description */}
        <p className="mb-6 leading-relaxed text-gray-600">{description}</p>

        {/* Action Button */}
        {actionButton && (
          <div className="flex justify-center">{actionButton}</div>
        )}

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-gray-200"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          <div className="h-2 w-2 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

// Predefined empty state variants
export const BookmarksEmptyState = () => (
  <EmptyState
    icon={<Bookmark className="h-12 w-12 text-blue-400" />}
    title="No bookmarked datasets found"
    description="Start exploring datasets and bookmark the ones you find interesting! Your bookmarked datasets will appear here for quick access."
    actionButton={
      <Link
        to="/"
        className="text-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        <Search className="h-4 w-4" />
        Explore Datasets
      </Link>
    }
  />
);

export const SearchEmptyState = () => (
  <EmptyState
    icon={<Search className="h-12 w-12 text-gray-400" />}
    title="No results found"
    description="Try adjusting your search criteria or browse through our available datasets."
  />
);

export const FavoritesEmptyState = () => (
  <EmptyState
    icon={<Star className="h-12 w-12 text-yellow-400" />}
    title="No favorites yet"
    description="Mark your favorite datasets with a star to keep them easily accessible."
  />
);

export default EmptyState;
