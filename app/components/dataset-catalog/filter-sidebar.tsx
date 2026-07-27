import { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { type FilterFacet } from '~/lib/constants/dataset-filter-options';
import type { useAppFilter } from '~/store/slices/filter-slice';

type FilterHook = ReturnType<typeof useAppFilter>;

interface FilterSidebarProps {
  filter: FilterHook;
  facets: FilterFacet[];
  className?: string;
}

/**
 * E-commerce style persistent filter sidebar for desktop.
 * Collapsible sections with checkboxes per facet.
 */
export function FilterSidebar({
  filter,
  facets,
  className,
}: Readonly<FilterSidebarProps>) {
  return (
    <aside className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-semibold">Filters</h3>
        {filter.activeTagCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={() => filter.resetFilters()}
          >
            Clear all ({filter.activeTagCount})
          </Button>
        )}
      </div>
      <Separator />

      {facets.map((facet) => (
        <FilterSection
          key={facet.key}
          facet={facet}
          selected={filter.tags[facet.key] ?? []}
          onToggle={(value) => {
            if (facet.single) {
              const current = filter.tags[facet.key] ?? [];
              filter.setTag(facet.key, current[0] === value ? [] : [value]);
            } else {
              filter.toggleTagValue(facet.key, value);
            }
          }}
          onClear={() => filter.setTag(facet.key, [])}
        />
      ))}
    </aside>
  );
}

function FilterSection({
  facet,
  selected,
  onToggle,
  onClear,
}: Readonly<{
  facet: FilterFacet;
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}>) {
  const [expanded, setExpanded] = useState(true);
  const count = selected.length;

  return (
    <div className="py-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm font-medium"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center gap-2">
          {facet.label}
          {count > 0 && (
            <Badge className="h-5 min-w-5 rounded-full bg-primary px-1.5 text-[10px] text-white">
              {count}
            </Badge>
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && facet.loading && facet.options.length === 0 && (
        <div className="mt-2 space-y-1.5" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-full animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      )}

      {expanded && !(facet.loading && facet.options.length === 0) && (
        <div className="mt-2 space-y-1">
          {facet.options.map((opt) => {
            const isActive = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                  isActive ? 'text-primary' : 'text-foreground hover:bg-muted'
                )}
              >
                <div
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : 'border-muted-foreground/30'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle(opt.value);
                  }}
                >
                  {isActive && <Check className="h-3 w-3" />}
                </div>
                <span
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle(opt.value);
                  }}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}

          {count > 0 && (
            <button
              type="button"
              className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={onClear}
            >
              <X className="h-3 w-3" />
              Clear {facet.label.toLowerCase()}
            </button>
          )}
        </div>
      )}

      <Separator className="mt-3" />
    </div>
  );
}
