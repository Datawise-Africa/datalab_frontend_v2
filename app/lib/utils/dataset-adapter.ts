import type { MyDatasetInterface } from '~/features/my-datasets';

/**
 * Normalized dataset shape consumed by the composable DatasetCard.
 */
export interface NormalizedDataset {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string | null;
  category: string;
  author: string;
  authorAffiliation?: string | null;
  rating: number;
  reviewCount: number;
  tags: string[];
  price: number | null;
  accessType: 'Public' | 'Private';
  availableTo: string[];
  lastUpdated: string;
  formats: string[];
  size: string;
  downloads: number;
  viewsCount?: number;
  rows?: string;
  columns?: number;
  license?: string;
  status?: string;
}

/**
 * Normalize a MyDatasetInterface into the card's expected shape.
 */
export function normalizeMyDataset(
  dataset: MyDatasetInterface
): NormalizedDataset {
  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].user.first_name} ${dataset.authors[0].user.last_name}`
      : 'Unknown';

  return {
    id: dataset.id,
    slug: dataset.id,
    name: dataset.name,
    description: dataset.description,
    category: dataset.category.name,
    author: authorName,
    rating: 0,
    reviewCount: 0,
    tags: dataset.tags,
    price: dataset.is_premium ? null : 0,
    accessType: dataset.is_private ? 'Private' : 'Public',
    availableTo: [],
    lastUpdated: dataset.updated_at,
    formats: [],
    size: '',
    downloads: 0,
    license: dataset.license?.name,
    status: dataset.status,
  };
}
