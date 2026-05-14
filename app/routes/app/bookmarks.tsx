import { useCallback, useMemo } from 'react';
import { Bookmark, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { DatasetCard } from '~/components/dataset-card';
import {
  normalizeMyDataset,
  type NormalizedDataset,
} from '~/lib/utils/dataset-adapter';
import { useBookmarkedDatasets, useRemoveBookmark } from '~/features/bookmarks';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';

export default function BookmarksPage() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: bookmarks, isLoading } = useBookmarkedDatasets(
    {},
    isAuthenticated
  );
  const removeBookmark = useRemoveBookmark();
  const downloadModal = useAppModal('download');

  const datasets = useMemo(
    () => bookmarks?.map((b) => normalizeMyDataset(b.dataset)) ?? [],
    [bookmarks]
  );

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
        <p className="text-muted-foreground mt-1">
          Datasets and resources you&apos;ve saved for later.
        </p>
      </div>

      <Tabs defaultValue="datasets">
        <TabsList>
          <TabsTrigger value="datasets">
            Datasets{' '}
            {datasets.length > 0 ? (
              <Badge
                variant="secondary"
                className="ml-1.5 text-[10px] px-1.5 py-0"
              >
                {datasets.length}
              </Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : datasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <Bookmark className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">No bookmarked datasets yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Save datasets you want to revisit and they&apos;ll show up here.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/datasets">Browse Datasets</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 @4xl:grid-cols-3">
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
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <DatasetCard.Author />
                      <DatasetCard.Rating className="ml-2" />
                    </div>
                    <DatasetCard.Description lineClamp={2} />
                    <DatasetCard.Tags limit={3} />
                    <DatasetCard.Meta />
                  </CardContent>
                  <DatasetCard.Actions
                    onDownload={() => handleDownload(dataset)}
                    onBookmark={() => removeBookmark.mutate(dataset.id)}
                    isBookmarked
                    isBookmarkPending={
                      removeBookmark.isPending &&
                      removeBookmark.variables === dataset.id
                    }
                  />
                </DatasetCard>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Bookmark className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium">Report bookmarks coming soon</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You&apos;ll be able to save research reports here once the feature
              ships.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
