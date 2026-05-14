import { useCallback } from 'react';
import type { Route } from './+types/saved-datasets';
import { generateSEOTags } from '~/lib/utils/seo';
import { useBookmarkedDatasets, useRemoveBookmark } from '~/features/bookmarks';
import {
  normalizeMyDataset,
  type NormalizedDataset,
} from '~/lib/utils/dataset-adapter';
import { DatasetCard } from '~/components/dataset-card';
import { CardContent, CardHeader } from '~/components/ui/card';
import { useAppModal } from '~/store/slices/modal-slice';
import { Loader2, Bookmark } from 'lucide-react';
import { useAppSelector } from '~/store';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Saved Datasets',
    description: 'Your bookmarked datasets',
  });
}

export default function SavedDatasets() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: bookmarks, isLoading } = useBookmarkedDatasets(
    {},
    isAuthenticated
  );
  const removeBookmark = useRemoveBookmark();
  const downloadModal = useAppModal('download');

  const datasets = bookmarks?.map((b) => normalizeMyDataset(b.dataset)) ?? [];

  const handleDownload = useCallback(
    (dataset: NormalizedDataset) => {
      downloadModal.open({
        datasetId: dataset.id,
        datasetName: dataset.name,
        price: dataset.price,
        formats: dataset.formats,
        license: dataset.license ?? 'Standard License',
      });
    },
    [downloadModal]
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Bookmark className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Saved Datasets</h1>
          <p className="text-sm text-muted-foreground">
            Your bookmarked datasets
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : datasets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="mb-1 text-lg font-semibold text-foreground">
            No saved datasets
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Datasets you bookmark will appear here for quick access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset}>
              <DatasetCard.Image />
              <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
                <DatasetCard.Badges />
                <DatasetCard.Menu
                  showBookmark
                  isBookmarked
                  isBookmarkPending={
                    removeBookmark.isPending &&
                    removeBookmark.variables === dataset.id
                  }
                  onBookmark={() => removeBookmark.mutate(dataset.id)}
                  onDownload={() => handleDownload(dataset)}
                />
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
                <DatasetCard.Title />
                <DatasetCard.Workspace />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <DatasetCard.Author />
                  <DatasetCard.Rating className="ml-2" />
                </div>
                <DatasetCard.Description />
                <DatasetCard.Tags limit={3} />
                <DatasetCard.Audience />
                <DatasetCard.Meta />
              </CardContent>
              <DatasetCard.Actions onDownload={() => handleDownload(dataset)} />
            </DatasetCard>
          ))}
        </div>
      )}
    </div>
  );
}
