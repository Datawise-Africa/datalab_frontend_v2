import type { MyDatasetInterface } from '~/features/my-datasets';
import type { DatasetSummary } from '~/features/my-datasets/types';
import { getWorkspaceId, getWorkspaceName } from '~/features/my-datasets/types';

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
  workspaceName?: string | null;
  workspaceSlug?: string | null;
  workspaceId?: string | null;
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
  dataset: MyDatasetInterface | DatasetSummary
): NormalizedDataset {
  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].user.first_name} ${dataset.authors[0].user.last_name}`
      : 'Unknown';
  const workspaceName = getWorkspaceName(dataset.workspace);
  const workspaceId = getWorkspaceId(dataset.workspace);
  const workspaceSlug =
    dataset.workspace && typeof dataset.workspace === 'object'
      ? ((dataset.workspace as { slug?: string }).slug ?? null)
      : null;

  return {
    id: dataset.id,
    // Readable URLs once the API sends slugs; ids keep working either way.
    slug: dataset.slug ?? dataset.id,
    name: dataset.name,
    description: dataset.description,
    image: dataset.dataset_image ?? null,
    category: dataset.category.name,
    author: authorName,
    workspaceName,
    workspaceSlug,
    workspaceId,
    rating: 0,
    reviewCount: 0,
    tags: dataset.tags,
    price:
      dataset.price !== null && dataset.price !== undefined
        ? Number(dataset.price)
        : null,
    accessType: dataset.is_private ? 'Private' : 'Public',
    availableTo: [],
    lastUpdated: dataset.updated_at,
    formats: [],
    size: '',
    downloads: dataset.downloads_count ?? 0,
    license: dataset.license?.name,
    status: dataset.status,
  };
}
