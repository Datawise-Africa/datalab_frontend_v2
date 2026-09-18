import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
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
  // First two groups open by default; searching opens every matching group.
  const [openGroups, setOpenGroups] = useState<string[]>(
    visualGroups.slice(0, 2)
  );
  const needle = query.trim().toLowerCase();
  const matches = visuals.filter(
    (item) =>
      !needle ||
      item.label.toLowerCase().includes(needle) ||
      item.description.toLowerCase().includes(needle) ||
      item.group.toLowerCase().includes(needle)
  );
  const matchedGroups = visualGroups.filter((group) =>
    matches.some((item) => item.group === group)
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
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <Accordion
          type="multiple"
          value={needle ? matchedGroups : openGroups}
          onValueChange={(value) => !needle && setOpenGroups(value)}
        >
          {matchedGroups.map((group) => (
            <AccordionItem key={group} value={group} className="border-b-0">
              <AccordionTrigger className="py-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase hover:no-underline">
                {group}
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {matches
                    .filter((item) => item.group === group)
                    .map((item) => (
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {!matches.length && (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No visuals match “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
