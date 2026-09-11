import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { visualGroups } from '~/lib/constants/dashboard-studio';
import type { DashboardWidgetType } from '~/lib/types/dashboard';
import { visuals } from './registry/visuals';
import { useStudio } from './studio-context';

/** Searchable, grouped palette of visuals. Click inserts on the active page. */
export function StudioInsertPanel({
  onInserted,
}: Readonly<{ onInserted?: () => void }>) {
  const { addWidget } = useStudio();
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const matches = visuals.filter(
    (item) =>
      !needle ||
      item.label.toLowerCase().includes(needle) ||
      item.description.toLowerCase().includes(needle) ||
      item.group.toLowerCase().includes(needle)
  );
  const insert = (type: DashboardWidgetType) => {
    addWidget(type);
    onInserted?.();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b p-3">
        <h2 className="mb-2 text-sm font-semibold">Insert</h2>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search visuals"
            aria-label="Search visuals"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {visualGroups.map((group) => {
          const items = matches.filter((item) => item.group === group);
          if (!items.length) return null;
          return (
            <section key={group}>
              <h3 className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {group}
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {items.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    title={item.description}
                    onClick={() => insert(item.value)}
                    className="flex min-w-0 items-center gap-2 rounded-lg border bg-background px-2 py-2 text-left text-xs transition hover:border-primary hover:bg-primary/5"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
        {!matches.length && (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No visuals match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
