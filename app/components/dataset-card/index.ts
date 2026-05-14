import { DatasetCardRoot } from './dataset-card-root';
import { DatasetCardBadges } from './dataset-card-badges';
import { DatasetCardMenu } from './dataset-card-menu';
import { DatasetCardTitle } from './dataset-card-title';
import { DatasetCardAuthor } from './dataset-card-author';
import { DatasetCardRating } from './dataset-card-rating';
import { DatasetCardDescription } from './dataset-card-description';
import { DatasetCardTags } from './dataset-card-tags';
import { DatasetCardAudience } from './dataset-card-audience';
import { DatasetCardMeta } from './dataset-card-meta';
import { DatasetCardImage } from './dataset-card-image';
import { DatasetCardActions } from './dataset-card-actions';
import { DatasetCardWorkspace } from './dataset-card-workspace';

/**
 * Composable DatasetCard compound component.
 *
 * Usage:
 * ```tsx
 * <DatasetCard dataset={normalizedDataset}>
 *   <DatasetCard.Badges />
 *   <DatasetCard.Menu />
 *   <DatasetCard.Title />
 *   <DatasetCard.Author />
 *   <DatasetCard.Rating />
 *   <DatasetCard.Description />
 *   <DatasetCard.Tags limit={3} />
 *   <DatasetCard.Audience />
 *   <DatasetCard.Meta />
 *   <DatasetCard.Actions />
 * </DatasetCard>
 * ```
 */
export const DatasetCard = Object.assign(DatasetCardRoot, {
  Badges: DatasetCardBadges,
  Menu: DatasetCardMenu,
  Title: DatasetCardTitle,
  Author: DatasetCardAuthor,
  Rating: DatasetCardRating,
  Description: DatasetCardDescription,
  Tags: DatasetCardTags,
  Audience: DatasetCardAudience,
  Meta: DatasetCardMeta,
  Image: DatasetCardImage,
  Actions: DatasetCardActions,
  Workspace: DatasetCardWorkspace,
});

export { useDatasetCard } from './use-dataset-card';
export type { NormalizedDataset } from '~/lib/utils/dataset-adapter';
export { normalizeMyDataset } from '~/lib/utils/dataset-adapter';
