import { useState, useCallback, useMemo, useEffect } from 'react';
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
import {
  useAddBookmark,
  useBookmarkedDatasets,
  useRemoveBookmark,
} from '~/features/bookmarks';
import { useDatasetTypes, useTopCategories } from '~/features/metadata';
import { useAppFilter } from '~/store/slices/filter-slice';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import { useResumeAfterAuth } from '~/hooks/use-resume-after-auth';
import {
  staticDatasetFilterFacets,
  datasetSortOptions,
  DEFAULT_DATASET_SORT,
  type FilterFacet,
} from '~/lib/constants/dataset-filter-options';
import { cn } from '~/lib/utils';
import { PageHeader } from '~/components/layout/page-header';
import type { Route } from './+types/datasets';
import { generateSEOTags } from '~/lib/utils/seo';
import { breadcrumbSchema } from '~/lib/utils/structured-data';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Datasets for intelligent systems',
    description:
      'Discover, host, and access structured datasets that power insights, research, and intelligence workflows on Datalab Africa.',
    url: '/datasets',
    jsonLd: breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Datasets', url: '/datasets' },
    ]),
  });
}

export default function Datasets() {
  const filter = useAppFilter('datasets');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const downloadModal = useAppModal('download');

  const { data: datasetTypeOptions, isPending: isDatasetTypesLoading } =
    useDatasetTypes();
  const { data: topCategories, isPending: isTopCategoriesLoading } =
    useTopCategories();

  const facets: FilterFacet[] = useMemo(() => {
    const dynamic: FilterFacet[] = [
      {
        key: 'category',
        label: 'Category',
        loading: isTopCategoriesLoading,
        options:
          topCategories?.map((c) => ({
            label: c.name /* `${c.name} (${c.dataset_count})` */,
            value: c.slug,
          })) ?? [],
      },
      {
        key: 'dataset_type',
        label: 'Dataset Type',
        loading: isDatasetTypesLoading,
        options:
          datasetTypeOptions?.map((t) => ({
            label: t.label,
            value: t.value,
          })) ?? [],
      },
    ];
    // Hide dynamic facets with no options (failed load) — keep static + dynamic
    // sections that are loading or have data.
    return [
      ...dynamic.filter((f) => f.loading || f.options.length > 0),
      ...staticDatasetFilterFacets,
    ];
  }, [
    topCategories,
    datasetTypeOptions,
    isTopCategoriesLoading,
    isDatasetTypesLoading,
  ]);

  const allowedSortValues = useMemo(
    () => new Set<string>(datasetSortOptions.map((o) => o.value)),
    []
  );
  const activeSort = allowedSortValues.has(filter.sortBy)
    ? filter.sortBy
    : DEFAULT_DATASET_SORT;

  // Normalize stale/persisted sort values (e.g. legacy 'name' or 'created_at')
  // back to the catalog default so redux reflects what's actually applied.
  useEffect(() => {
    if (!allowedSortValues.has(filter.sortBy)) {
      filter.setSortBy(DEFAULT_DATASET_SORT);
    }
  }, [filter, allowedSortValues]);

  // Build API params from filter state. Facet keys equal backend param names.
  const params: Record<string, unknown> = {
    page,
    limit,
    ordering: activeSort,
  };
  if (filter.searchQuery) params.search = filter.searchQuery;

  for (const facet of facets) {
    const values = filter.tags[facet.key];
    if (values && values.length > 0) {
      params[facet.key] = facet.single ? values[0] : values.join(',');
    }
  }

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDatasets(params);
  const { data: bookmarksData } = useBookmarkedDatasets({}, isAuthenticated);
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const datasets: NormalizedDataset[] = useMemo(() => {
    if (!response?.data) return [];
    return response?.data?.map(normalizeMyDataset) ?? [];
  }, [response]);
  const total = response?.meta?.total_docs ?? 0;

  const bookmarkedIds = useMemo(() => {
    if (!bookmarksData) return new Set<string>();
    return new Set(bookmarksData?.map((b) => b.dataset.id) ?? []);
  }, [bookmarksData]);

  const handleDownload = useCallback(
    (dataset: NormalizedDataset) => {
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
    },
    [isAuthenticated, authModal, downloadModal]
  );

  const handleBookmark = useResumeAfterAuth<string>((datasetId) => {
    if (bookmarkedIds.has(datasetId)) {
      removeBookmark.mutate(datasetId);
    } else {
      addBookmark.mutate(datasetId);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Dataset Catalog"
        description="Discover, host, and access structured datasets that power insights, research, and intelligence workflows."
      />

      {/* Sticky search + sort bar */}
      <section className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <DatasetSearch
              value={filter.searchQuery}
              onChange={filter.setSearchQuery}
              className="flex-1"
            />

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile filter trigger */}
              <MobileFilterSheet filter={filter} facets={facets} />

              {/* Sort */}
              <AsyncSelect
                value={activeSort}
                onChange={(val) =>
                  filter.setSortBy(val ?? DEFAULT_DATASET_SORT)
                }
                options={datasetSortOptions.map((o) => ({
                  label: o.label,
                  value: o.value,
                }))}
                placeholder="Sort by"
                className="h-9 w-full sm:w-40 sm:shrink-0"
              />
            </div>
          </div>

          {/* Active filter pills */}
          <ActiveFilterPills filter={filter} facets={facets} />
        </div>
      </section>

      {/* Main content: sidebar + grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <FilterSidebar
            filter={filter}
            facets={facets}
            className="hidden w-60 shrink-0 md:block"
          />

          {/* Results area */}
          <div className="@container min-w-0 flex-1">
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

            {/* Pagination — top — hidden on mobile */}
            <div className="mb-6 hidden sm:block">
              <PaginationControls
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
                onLimitChange={(l) => {
                  setLimit(l);
                  setPage(1);
                }}
              />
            </div>

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
              <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
                {datasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset}>
                    <DatasetCard.Image />
                    <CardHeader className="flex flex-row items-center justify-between gap-2 px-5 pt-5 pb-3">
                      <DatasetCard.Badges />
                      <DatasetCard.Menu
                        showBookmark={isAuthenticated}
                        onBookmark={() => handleBookmark(dataset.id)}
                        onDownload={() => handleDownload(dataset)}
                        isBookmarked={bookmarkedIds.has(dataset.id)}
                        isBookmarkPending={
                          (addBookmark.isPending &&
                            addBookmark.variables === dataset.id) ||
                          (removeBookmark.isPending &&
                            removeBookmark.variables === dataset.id)
                        }
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
  facets,
}: Readonly<{
  filter: ReturnType<typeof useAppFilter>;
  facets: FilterFacet[];
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 shrink-0 md:hidden">
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
          {facets.map((facet) => {
            const selected = filter.tags[facet.key] ?? [];
            return (
              <div key={facet.key}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {facet.label}
                </p>
                <div
                  className="flex flex-wrap gap-2"
                  aria-busy={
                    facet.loading && facet.options.length === 0
                      ? 'true'
                      : undefined
                  }
                >
                  {facet.loading && facet.options.length === 0
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-20 animate-pulse rounded-full bg-muted"
                        />
                      ))
                    : null}
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
                        onClick={() => {
                          if (facet.single) {
                            filter.setTag(
                              facet.key,
                              isActive ? [] : [opt.value]
                            );
                          } else {
                            filter.toggleTagValue(facet.key, opt.value);
                          }
                        }}
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
  facets,
}: Readonly<{
  filter: ReturnType<typeof useAppFilter>;
  facets: FilterFacet[];
}>) {
  const pills: {
    facetKey: string;
    facetLabel: string;
    value: string;
    label: string;
  }[] = [];

  for (const facet of facets) {
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
