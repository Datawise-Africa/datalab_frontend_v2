import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '~/components/ui/sheet';
import { AsyncSelect } from '~/components/ui/async-select';
import { Separator } from '~/components/ui/separator';
import { DatasetSearch } from './dataset-search';
import { cn } from '~/lib/utils';
import {
  datasetSortOptions,
  type FilterFacet,
} from '~/lib/constants/dataset-filter-options';
import type { useAppFilter } from '~/store/slices/filter-slice';

type FilterHook = ReturnType<typeof useAppFilter>;

interface DatasetFilterToolbarProps {
  filter: FilterHook;
  facets: FilterFacet[];
  className?: string;
}

function applyFacetSelection(
  filter: FilterHook,
  facet: FilterFacet,
  value: string,
  isActive: boolean
) {
  if (facet.single) {
    filter.setTag(facet.key, isActive ? [] : [value]);
  } else {
    filter.toggleTagValue(facet.key, value);
  }
}

export function DatasetFilterToolbar({
  filter,
  facets,
  className,
}: Readonly<DatasetFilterToolbarProps>) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Row 1: Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <DatasetSearch
          value={filter.searchQuery}
          onChange={filter.setSearchQuery}
          className="flex-1"
        />

        <div className="flex items-center gap-2">
          {/* Mobile: Sheet trigger */}
          <MobileFilterSheet filter={filter} facets={facets} />

          {/* Desktop: Popover per facet */}
          <div className="hidden items-center gap-1.5 md:flex">
            {facets.map((facet) => (
              <FacetPopover key={facet.key} facet={facet} filter={filter} />
            ))}
          </div>

          {/* Sort */}
          <AsyncSelect
            value={filter.sortBy}
            onChange={(val) => filter.setSortBy(val ?? 'created_at')}
            options={datasetSortOptions.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            placeholder="Sort by"
            className="h-9 w-40"
          />
        </div>
      </div>

      {/* Active filter pills */}
      <ActiveFilterPills filter={filter} facets={facets} />
    </div>
  );
}

/** Desktop: one popover per facet with checkboxes. */
function FacetPopover({
  facet,
  filter,
}: Readonly<{
  facet: FilterFacet;
  filter: FilterHook;
}>) {
  const selected = filter.tags[facet.key] ?? [];
  const count = selected.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          {facet.label}
          {count > 0 && (
            <Badge className="ml-0.5 h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px] text-white">
              {count}
            </Badge>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-2">
        {facet.loading && facet.options.length === 0 ? (
          <div className="space-y-1.5" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : null}
        <div className="space-y-0.5">
          {facet.options.map((opt) => {
            const isActive = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/5 text-primary font-medium'
                    : 'text-foreground hover:bg-muted'
                )}
                onClick={() =>
                  applyFacetSelection(filter, facet, opt.value, isActive)
                }
              >
                <div
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {isActive && <Check className="h-3 w-3" />}
                </div>
                {opt.label}
              </button>
            );
          })}
        </div>
        {count > 0 && (
          <>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => filter.setTag(facet.key, [])}
            >
              Clear {facet.label.toLowerCase()}
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

/** Mobile: all facets in a bottom sheet. */
function MobileFilterSheet({
  filter,
  facets,
}: Readonly<{ filter: FilterHook; facets: FilterFacet[] }>) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 md:hidden relative">
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
                        onClick={() =>
                          applyFacetSelection(
                            filter,
                            facet,
                            opt.value,
                            isActive
                          )
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
  facets,
}: Readonly<{ filter: FilterHook; facets: FilterFacet[] }>) {
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
    <div className="flex flex-wrap items-center gap-1.5">
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
