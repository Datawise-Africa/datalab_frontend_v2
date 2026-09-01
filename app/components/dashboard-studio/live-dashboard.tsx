import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, FilterX, Loader2, RefreshCw } from 'lucide-react';
import { apiClient } from '~/lib/api/client';
import { Button } from '~/components/ui/button';
import { Picker } from '~/components/ui/picker';
import type {
  Dashboard,
  DashboardDefinition,
  DashboardExecution,
  DashboardQuery,
} from '~/lib/types/dashboard';
import { DashboardRenderer } from './dashboard-renderer';

type LiveFilter = NonNullable<DashboardQuery['filters']>[number];

export function LiveDashboard({
  dashboard,
  endpoint,
  password,
  interactive = true,
}: Readonly<{
  dashboard: Dashboard;
  endpoint: string;
  password?: string;
  interactive?: boolean;
}>) {
  const [execution, setExecution] = useState<DashboardExecution>();
  const [filters, setFilters] = useState<LiveFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState('');

  const execute = useCallback(
    async (nextFilters: LiveFilter[]) => {
      setLoading(true);
      setFailure('');
      try {
        const response = await apiClient.post<DashboardExecution>(
          endpoint,
          { filters: nextFilters },
          {
            headers: password
              ? { 'X-Dashboard-Password': password }
              : undefined,
          }
        );
        setExecution(response.data);
      } catch {
        setFailure(
          'Current dashboard results could not be loaded. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [endpoint, password]
  );

  useEffect(() => {
    void execute([]);
  }, [execute]);

  const definition = useMemo<DashboardDefinition>(() => {
    const copy = structuredClone(dashboard.definition);
    for (const page of copy.pages)
      for (const widget of page.widgets)
        widget.data = execution?.results[widget.id];
    return copy;
  }, [dashboard.definition, execution]);
  const filterWidgets = useMemo(
    () =>
      definition.pages.flatMap((page) =>
        page.widgets.filter(
          (widget) => widget.type === 'filter' && widget.config?.x
        )
      ),
    [definition]
  );

  const crossFilter = (column: string, value: unknown) => {
    if (!interactive || value === undefined || value === null) return;
    const next: LiveFilter[] = [
      ...filters.filter((item) => item.column !== column),
      { column, operator: 'equals', value: String(value) },
    ];
    setFilters(next);
    void execute(next);
  };
  const clearFilters = () => {
    setFilters([]);
    void execute([]);
  };

  return (
    <div className="space-y-3" data-dashboard-print>
      <div
        className="flex flex-wrap items-center justify-between gap-2"
        data-dashboard-toolbar
      >
        <div className="flex flex-1 flex-wrap items-end gap-2">
          {filterWidgets.map((widget) => {
            const column = widget.config?.x ?? '';
            const selected = filters.find((item) => item.column === column);
            const items = [
              ...new Set(
                (widget.data?.rows ?? [])
                  .map((row) => String(row[column] ?? ''))
                  .filter(Boolean)
              ),
            ]
              .slice(0, 500)
              .map((value) => ({ value, label: value }));
            return (
              <div key={widget.id} className="min-w-48 space-y-1">
                <span className="text-xs font-medium">{widget.title}</span>
                <Picker
                  items={items}
                  value={selected ? String(selected.value) : null}
                  placeholder="All values"
                  onChange={(value) => {
                    const next = value
                      ? [
                          ...filters.filter((item) => item.column !== column),
                          { column, operator: 'equals' as const, value },
                        ]
                      : filters.filter((item) => item.column !== column);
                    setFilters(next);
                    void execute(next);
                  }}
                />
              </div>
            );
          })}
          {filters.map((filter) => (
            <span
              key={filter.column}
              className="rounded-full border bg-background px-3 py-1 text-xs"
            >
              {filter.column}: {String(filter.value)}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          {!!filters.length && (
            <Button size="sm" variant="outline" onClick={clearFilters}>
              <FilterX className="mr-1.5 h-4 w-4" /> Clear filters
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void execute(filters)}
          >
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1.5 h-4 w-4" />
            )}
            Refresh view
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => globalThis.print()}
          >
            <Download className="mr-1.5 h-4 w-4" /> Print / PDF
          </Button>
        </div>
      </div>
      {failure && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {failure}
        </p>
      )}
      <DashboardRenderer
        definition={definition}
        interactive={interactive}
        onCrossFilter={crossFilter}
        loading={loading}
        errors={execution?.errors}
      />
    </div>
  );
}
