import { useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CardContent, CardHeader } from '~/components/ui/card';
import { DatasetCard } from '~/components/dataset-card';
import { normalizeMyDataset } from '~/lib/utils/dataset-adapter';
import { useDatasets } from '~/features/datasets';
import {
  useAddBookmark,
  useBookmarkedDatasets,
  useRemoveBookmark,
} from '~/features/bookmarks';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import { useResumeAfterAuth } from '~/hooks/use-resume-after-auth';

export function FeaturedDatasets() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const downloadModal = useAppModal('download');

  const { data: response, isLoading } = useDatasets({
    page: 1,
    limit: 8,
    sort: 'download_count',
    order: 'desc',
  });

  const { data: bookmarksData } = useBookmarkedDatasets({}, isAuthenticated);
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const datasets = useMemo(
    () => response?.data?.map(normalizeMyDataset) ?? [],
    [response]
  );

  const bookmarkedIds = useMemo(() => {
    if (!bookmarksData) return new Set<string>();
    return new Set(bookmarksData.map((b) => b.dataset.id));
  }, [bookmarksData]);

  const handleDownload = (dataset: ReturnType<typeof normalizeMyDataset>) => {
    const payload = {
      datasetId: dataset.id,
      datasetName: dataset.name,
      price: dataset.price,
      formats: dataset.formats,
      license: dataset.license ?? 'Standard License',
    };
    if (!isAuthenticated) {
      authModal.open({ next: { modal: 'download', payload } });
      return;
    }
    downloadModal.open(payload);
  };

  const handleBookmark = useResumeAfterAuth<string>((datasetId) => {
    if (bookmarkedIds.has(datasetId)) {
      removeBookmark.mutate(datasetId);
    } else {
      addBookmark.mutate(datasetId);
    }
  });

  return (
    <section className="relative border-t border-border/60 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Catalog
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Our Datasets
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Explore our curated catalog of high-quality datasets trusted by
            researchers and developers.
          </p>
          <div className="mx-auto mt-5 h-px w-16 bg-primary/40" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : datasets.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No featured datasets available at the moment.
          </p>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
            {datasets.map((dataset) => (
              <DatasetCard
                key={dataset.id}
                dataset={dataset}
                className="w-full sm:w-75 lg:w-80"
              >
                <DatasetCard.Image />
                <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
                  <DatasetCard.Badges />
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
                  <DatasetCard.Title lineClamp={1} />
                  <DatasetCard.Workspace />
                  <DatasetCard.Description lineClamp={2} />
                  <DatasetCard.Tags limit={2} />
                  <DatasetCard.Meta />
                </CardContent>
                <DatasetCard.Actions
                  onDownload={() => handleDownload(dataset)}
                  onBookmark={() => handleBookmark(dataset.id)}
                  isBookmarked={bookmarkedIds.has(dataset.id)}
                  isBookmarkPending={
                    (addBookmark.isPending &&
                      addBookmark.variables === dataset.id) ||
                    (removeBookmark.isPending &&
                      removeBookmark.variables === dataset.id)
                  }
                />
              </DatasetCard>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/datasets">
              View All Datasets
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
