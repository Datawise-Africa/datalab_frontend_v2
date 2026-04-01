import type { IDataset } from '~/lib/types/dataset';

/**
 * Normalized dataset shape consumed by the composable DatasetCard.
 * Works as a common interface between static `Dataset` data and API `IDataset` responses.
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
 * Normalize an API IDataset into the card's expected shape.
 */
export function normalizeApiDataset(dataset: IDataset): NormalizedDataset {
  const audience: string[] = [];
  if (dataset.intended_audience.students) audience.push('Student');
  if (dataset.intended_audience.non_profit) audience.push('Non-Profit');
  if (dataset.intended_audience.company) audience.push('Company');
  if (dataset.intended_audience.public) audience.push('Public');

  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].first_name} ${dataset.authors[0].last_name}`
      : 'Unknown';

  const authorAffiliation =
    dataset.authors.length > 0 ? dataset.authors[0].affiliation : null;

  return {
    id: dataset.id,
    slug: dataset.id,
    name: dataset.title,
    description: dataset.description,
    image: dataset.dataset_image,
    category: dataset.category.name,
    author: authorName,
    authorAffiliation,
    rating: dataset.average_review,
    reviewCount: dataset.review_count,
    tags: dataset.tags,
    price: dataset.is_premium ? dataset.price : 0,
    accessType: dataset.is_private ? 'Private' : 'Public',
    availableTo: audience,
    lastUpdated: dataset.updated_at,
    formats: dataset.data_file_types
      ? dataset.data_file_types.split(',').map((f) => f.trim())
      : [],
    size:
      dataset.dataset_size > 0
        ? formatBytes(dataset.dataset_size)
        : dataset.size_bytes,
    downloads: dataset.download_count,
    viewsCount: dataset.views_count,
    license: dataset.license?.name,
    status: dataset.status,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
