import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import type { DatasetFilters } from '~/store/slices/dataset-controls-slice';

const filterOptions: Record<
  keyof DatasetFilters,
  { label: string; values: { label: string; value: string }[] }
> = {
  accessLevel: {
    label: 'Access Level',
    values: [
      { label: 'Public', value: 'public' },
      { label: 'Non-Profit', value: 'non_profit' },
      { label: 'Commercial', value: 'commercial' },
      { label: 'Students', value: 'students' },
    ],
  },
  dataType: {
    label: 'Data Type',
    values: [
      { label: 'Education', value: 'education' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Agriculture', value: 'agriculture' },
      { label: 'Environmental', value: 'environmental' },
      { label: 'Finance', value: 'finance' },
      { label: 'Demographics', value: 'demographics' },
    ],
  },
  region: {
    label: 'Region',
    values: [
      { label: 'East Africa', value: 'east_africa' },
      { label: 'West Africa', value: 'west_africa' },
      { label: 'North Africa', value: 'north_africa' },
      { label: 'Southern Africa', value: 'southern_africa' },
      { label: 'Global', value: 'global' },
    ],
  },
  timeframe: {
    label: 'Timeframe',
    values: [
      { label: 'Last Year', value: 'last_year' },
      { label: 'Last 5 Years', value: 'last_5_years' },
      { label: '5+ Years', value: '5_plus_years' },
    ],
  },
};

interface FilterPanelProps {
  filters: DatasetFilters;
  onToggle: (key: keyof DatasetFilters, value: string) => void;
  onReset: () => void;
  activeCount: number;
  className?: string;
}

export function FilterPanel({
  filters,
  onToggle,
  onReset,
  activeCount,
  className,
}: FilterPanelProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Filters
          {activeCount > 0 && (
            <Badge className="ml-2 bg-primary text-white">{activeCount}</Badge>
          )}
        </h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>

      {(Object.keys(filterOptions) as (keyof DatasetFilters)[]).map((key) => {
        const group = filterOptions[key];
        return (
          <div key={key} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.values.map((opt) => {
                const isActive = filters[key].includes(opt.value);
                return (
                  <Badge
                    key={opt.value}
                    asChild
                    variant={isActive ? 'default' : 'outline'}
                    className={cn(
                      'text-xs',
                      isActive && 'bg-primary hover:bg-primary/90'
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={isActive}
                      className="cursor-pointer"
                      onClick={() => onToggle(key, opt.value)}
                    >
                      {opt.label}
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
