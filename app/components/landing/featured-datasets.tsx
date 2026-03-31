import { Link } from 'react-router';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CardContent, CardHeader } from '~/components/ui/card';
import { DatasetCard } from '~/components/dataset-card';
import { normalizeApiDataset } from '~/lib/utils/dataset-adapter';
import { useDatasets } from '~/features/datasets';

export function FeaturedDatasets() {
  const { data: response, isLoading } = useDatasets({
    page: 1,
    limit: 4,
    sort: 'download_count',
    order: 'desc',
  });

  const datasets = response?.data?.map(normalizeApiDataset) ?? [];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Datasets
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Hand-picked datasets trusted by thousands of researchers, engineers,
            and data scientists.
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
                  <DatasetCard.Badges />
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
                  <DatasetCard.Title lineClamp={1} />
                  <DatasetCard.Description lineClamp={2} />
                  <DatasetCard.Tags limit={2} />
                  <DatasetCard.Meta />
                </CardContent>
                <DatasetCard.Actions variant="compact" />
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
