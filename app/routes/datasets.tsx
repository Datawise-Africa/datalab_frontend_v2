import { useState, useCallback, useMemo } from 'react';
import {
  Database,
  Loader2,
  SlidersHorizontal,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { CardContent, CardHeader } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '~/components/ui/empty';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '~/components/ui/sheet';
import { AsyncSelect } from '~/components/ui/async-select';
import { DatasetCard } from '~/components/dataset-card';
import {
  normalizeMyDataset,
  type NormalizedDataset,
} from '~/lib/utils/dataset-adapter';
import { DatasetSearch } from '~/components/dataset-catalog/dataset-search';
import { FilterSidebar } from '~/components/dataset-catalog/filter-sidebar';
import { PaginationControls } from '~/components/dataset-catalog/pagination-controls';
import { useDatasets } from '~/features/datasets';
import { useAddBookmark, useBookmarkedDatasets } from '~/features/bookmarks';
import { useAppFilter } from '~/store/slices/filter-slice';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import {
  datasetFilterFacets,
  datasetSortOptions,
} from '~/lib/constants/dataset-filter-options';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import type { Route } from './+types/datasets';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Datasets',
    description:
      'Browse our curated collection of high-quality datasets for research and development.',
  });
}

export default function Datasets() {
  const filter = useAppFilter('datasets');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const downloadModal = useAppModal('download');

  // Build API params from filter state
  const params: Record<string, unknown> = {
    page,
    limit,
    sort: filter.sortBy,
    order: filter.sortOrder,
  };
  if (filter.searchQuery) params.search = filter.searchQuery;
  if (filter.categoryFilter) params.category = filter.categoryFilter;

  const tagMap: Record<string, string> = {
    accessLevel: 'access_level',
    dataType: 'datatype',
    region: 'region',
    timeframe: 'timeframe',
  };
  for (const [facetKey, apiKey] of Object.entries(tagMap)) {
    const values = filter.tags[facetKey];
    if (values && values.length > 0) {
      params[apiKey] = values.join(',');
    }
  }

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDatasets(params);
  const { data: bookmarksData } = useBookmarkedDatasets();
  const addBookmark = useAddBookmark();

  const datasets: NormalizedDataset[] = useMemo(() => {
    if (!response?.data) return [];
    return response?.data?.map(normalizeMyDataset) ?? [];
  }, [response]);
  const total = response?.meta?.total_docs ?? 0;

  const bookmarkedIds = useMemo(() => {
    if (!bookmarksData?.data) return new Set<string>();
    return new Set(bookmarksData?.data.map((b) => b.dataset.id) ?? []);
  }, [bookmarksData]);

  const handleDownload = useCallback(
    (dataset: NormalizedDataset) => {
      if (!isAuthenticated) {
        authModal.open();
        return;
      }
      downloadModal.open({
        datasetId: dataset.id,
        datasetName: dataset.name,
        price: dataset.price,
        formats: dataset.formats,
        license: dataset.license ?? 'Standard License',
      });
    },
    [isAuthenticated, authModal, downloadModal]
  );

  const handleBookmark = useCallback(
    (datasetId: string) => {
      if (!isAuthenticated) {
        authModal.open();
        return;
      }
      addBookmark.mutate(datasetId);
    },
    [isAuthenticated, authModal, addBookmark]
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Dataset Catalog"
        description="Browse our curated collection of high-quality datasets for research, machine learning, and analytics."
      />

      {/* Sticky search + sort bar */}
      <section className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <DatasetSearch
              value={filter.searchQuery}
              onChange={filter.setSearchQuery}
              className="flex-1"
            />

            {/* Mobile filter trigger */}
            <MobileFilterSheet filter={filter} />

            {/* Sort */}
            <AsyncSelect
              value={filter.sortBy}
              onChange={(val) => filter.setSortBy(val ?? 'created_at')}
              options={datasetSortOptions.map((o) => ({
                label: o.label,
                value: o.value,
              }))}
              placeholder="Sort by"
              className="h-9 w-40 shrink-0"
            />
          </div>

          {/* Active filter pills */}
          <ActiveFilterPills filter={filter} />
        </div>
      </section>

      {/* Main content: sidebar + grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <FilterSidebar
            filter={filter}
            className="hidden w-60 shrink-0 lg:block"
          />

          {/* Results area */}
          <div className="min-w-0 flex-1">
            {/* Results header: count + refresh — always visible */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  'Loading datasets...'
                ) : isError ? (
                  'Failed to load datasets'
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-semibold text-foreground">
                      {total.toLocaleString()}
                    </span>{' '}
                    {total === 1 ? 'dataset' : 'datasets'}
                  </>
                )}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-1.5 text-muted-foreground"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
            </div>

            {/* Pagination — top — always visible */}
            <PaginationControls
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
              className="mb-6"
            />

            {/* Content area */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <Empty className="border py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertTriangle className="text-destructive" />
                  </EmptyMedia>
                  <EmptyTitle>Failed to load datasets</EmptyTitle>
                  <EmptyDescription>
                    Something went wrong while fetching datasets. Please check
                    your connection and try again.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="gap-1.5"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                    />
                    Try again
                  </Button>
                </EmptyContent>
              </Empty>
            ) : datasets.length === 0 ? (
              <Empty className="border py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Database />
                  </EmptyMedia>
                  <EmptyTitle>No datasets found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search query or filters to find what
                    you&apos;re looking for.
                  </EmptyDescription>
                </EmptyHeader>
                {filter.activeTagCount > 0 && (
                  <EmptyContent>
                    <Button
                      variant="outline"
                      onClick={() => filter.resetFilters()}
                    >
                      Clear all filters
                    </Button>
                  </EmptyContent>
                )}
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {datasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
                      <DatasetCard.Badges />
                      <DatasetCard.Menu
                        showBookmark={isAuthenticated}
                        onBookmark={() => handleBookmark(dataset.id)}
                        onDownload={() => handleDownload(dataset)}
                        isBookmarked={bookmarkedIds.has(dataset.id)}
                      />
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-4">
                      <DatasetCard.Title />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <DatasetCard.Author />
                        <DatasetCard.Rating className="ml-2" />
                      </div>
                      <DatasetCard.Description />
                      <DatasetCard.Tags limit={3} />
                      <DatasetCard.Audience />
                      <DatasetCard.Meta />
                    </CardContent>
                    <DatasetCard.Actions
                      onDownload={() => handleDownload(dataset)}
                    />
                  </DatasetCard>
                ))}
              </div>
            )}

            {/* Pagination — bottom — always visible */}
            <PaginationControls
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
              className="mt-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile: bottom sheet with all filter facets. */
function MobileFilterSheet({
  filter,
}: {
  filter: ReturnType<typeof useAppFilter>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 shrink-0 lg:hidden">
          <SlidersHorizontal className="mr-1.5 h-4 w-4" />
          Filters
          {filter.activeTagCount > 0 && (
            <Badge className="ml-1.5 h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px] text-white">
              {filter.activeTagCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {datasetFilterFacets.map((facet) => {
            const selected = filter.tags[facet.key] ?? [];
            return (
              <div key={facet.key}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {facet.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {facet.options.map((opt) => {
                    const isActive = selected.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
                          isActive
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-background text-foreground hover:bg-muted'
                        )}
                        onClick={() =>
                          filter.toggleTagValue(facet.key, opt.value)
                        }
                      >
                        {isActive && <Check className="h-3 w-3" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          {filter.activeTagCount > 0 && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => filter.resetFilters()}
            >
              Clear all
            </Button>
          )}
          <SheetClose asChild>
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              Show results
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Horizontal row of active filter pills with remove buttons. */
function ActiveFilterPills({
  filter,
}: {
  filter: ReturnType<typeof useAppFilter>;
}) {
  const pills: {
    facetKey: string;
    facetLabel: string;
    value: string;
    label: string;
  }[] = [];

  for (const facet of datasetFilterFacets) {
    const selected = filter.tags[facet.key] ?? [];
    for (const val of selected) {
      const opt = facet.options.find((o) => o.value === val);
      if (opt) {
        pills.push({
          facetKey: facet.key,
          facetLabel: facet.label,
          value: val,
          label: opt.label,
        });
      }
    }
  }

  if (pills.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      {pills.map((pill) => (
        <Badge
          key={`${pill.facetKey}-${pill.value}`}
          variant="secondary"
          className="gap-1 rounded-full pl-2.5 pr-1.5 py-1"
        >
          <span className="text-xs text-muted-foreground mr-0.5">
            {pill.facetLabel}:
          </span>
          {pill.label}
          <button
            type="button"
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
            onClick={() => filter.toggleTagValue(pill.facetKey, pill.value)}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-muted-foreground"
        onClick={() => filter.resetFilters()}
      >
        Clear all
      </Button>
    </div>
  );
}
