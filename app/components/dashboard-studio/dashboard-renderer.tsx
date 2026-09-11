import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  Funnel,
  FunnelChart,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, FilterX } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { StudioGeoMap } from './studio-geo-map';
import type {
  DashboardDefinition,
  DashboardWidget,
} from '~/lib/types/dashboard';
import {
  chartPalette,
  widgetWidthClass,
} from '~/lib/constants/dashboard-studio';

function formatValue(value: unknown, widget: DashboardWidget) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value ?? '—');
  const decimals = widget.config?.decimals ?? 0;
  const format = widget.config?.numberFormat ?? 'standard';
  if (format === 'compact')
    return new Intl.NumberFormat(undefined, {
      notation: 'compact',
      maximumFractionDigits: decimals,
    }).format(number);
  if (format === 'currency')
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: widget.config?.currency ?? 'USD',
      maximumFractionDigits: decimals,
    }).format(number);
  if (format === 'percent')
    return new Intl.NumberFormat(undefined, {
      style: 'percent',
      maximumFractionDigits: decimals,
    }).format(number / 100);
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: decimals,
  }).format(number);
}

function datumValue(row: unknown, key: string) {
  return (row as { payload?: Record<string, unknown> }).payload?.[key];
}

function Chart({
  widget,
  interactive,
  onFilter,
}: Readonly<{
  widget: DashboardWidget;
  interactive: boolean;
  onFilter: (column: string, value: unknown) => void;
}>) {
  const rows = widget.data?.rows ?? [];
  const columns = widget.data?.columns.map((item) => item.name) ?? [];
  const x = widget.config?.x ?? columns[0];
  const requestedY = widget.config?.y;
  const yKeys = columns.filter(
    (column) =>
      column !== x && rows.some((row) => Number.isFinite(Number(row[column])))
  );
  const series = requestedY
    ? [requestedY, ...yKeys.filter((key) => key !== requestedY)]
    : yKeys;
  const palette = widget.config?.palette?.length
    ? widget.config.palette
    : chartPalette;
  const height = Math.max(150, (widget.layout?.height ?? 360) - 105);
  const click = (row: unknown) =>
    interactive && x && onFilter(x, datumValue(row, x));
  if (widget.type === 'text')
    return (
      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground/80">
        {widget.text || 'Add a narrative, interpretation or methodology note.'}
      </div>
    );
  if (widget.type === 'image')
    return widget.config?.imageUrl ? (
      <img
        src={widget.config.imageUrl}
        alt={widget.config.imageAlt || widget.title}
        className="h-full max-h-[640px] w-full rounded-lg object-contain"
      />
    ) : (
      <p className="text-sm text-muted-foreground">
        Add an image URL and accessible description.
      </p>
    );
  if (widget.type === 'shape')
    return (
      <div className="h-full min-h-32 rounded-2xl bg-primary/15 ring-1 ring-primary/25" />
    );
  if (widget.type === 'filter')
    return (
      <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Viewer filter · {widget.config?.x || 'Choose a field'}
      </p>
    );
  if (widget.type === 'kpi') {
    const key = requestedY ?? series[0] ?? x;
    return (
      <div className="flex h-full flex-col justify-center">
        <div className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {widget.config?.prefix}
          {formatValue(rows[0]?.[key ?? ''], widget)}
          {widget.config?.suffix}
        </div>
        {widget.config?.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {widget.config.description}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Calculated from{' '}
          {widget.data?.source_row_count?.toLocaleString() ??
            widget.data?.row_count ??
            0}{' '}
          source rows
        </p>
      </div>
    );
  }
  if (widget.type === 'table')
    return (
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <table className="w-full text-sm">
          <thead>
            <tr>
              {widget.data?.columns.map((column) => (
                <th
                  key={column.name}
                  className="sticky top-0 border-b bg-card p-2.5 text-left font-medium"
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${widget.id}-${index}`}
                className="border-b last:border-0 hover:bg-muted/40"
              >
                {widget.data?.columns.map((column) => (
                  <td key={column.name} className="p-2.5">
                    {column.type === 'number'
                      ? formatValue(row[column.name], widget)
                      : String(row[column.name] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  if (!rows.length || !x || !series.length)
    return (
      <div
        className="flex flex-col items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        <BarChart3 className="mb-2 h-8 w-8 opacity-35" />
        <span className="text-sm">Configure the fields, then run analysis</span>
      </div>
    );
  if (widget.type === 'map')
    return (
      <StudioGeoMap
        rows={rows}
        latitude={widget.config?.latitude}
        longitude={widget.config?.longitude}
        label={x}
        value={series[0]}
      />
    );
  if (widget.type === 'heatmap') {
    const values = rows.flatMap((row) =>
      series.slice(0, 6).map((key) => Number(row[key]) || 0)
    );
    const maximum = Math.max(...values.map(Math.abs), 1);
    return (
      <div className="overflow-auto" style={{ maxHeight: height }}>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `minmax(110px,auto) repeat(${Math.min(series.length, 6)}, minmax(70px,1fr))`,
          }}
        >
          <span />
          {series.slice(0, 6).map((key) => (
            <strong key={key} className="truncate p-1 text-center text-[10px]">
              {key}
            </strong>
          ))}
          {rows.slice(0, 40).flatMap((row, rowIndex) => [
            <span key={`label-${rowIndex}`} className="truncate p-1 text-xs">
              {String(row[x])}
            </span>,
            ...series.slice(0, 6).map((key) => {
              const value = Number(row[key]) || 0;
              return (
                <span
                  key={`${rowIndex}-${key}`}
                  title={`${row[x]} · ${key}: ${value}`}
                  className="rounded p-2 text-center text-xs"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--chart-1) ${Math.max(8, (Math.abs(value) / maximum) * 90)}%, transparent)`,
                  }}
                >
                  {formatValue(value, widget)}
                </span>
              );
            }),
          ])}
        </div>
      </div>
    );
  }
  if (widget.type === 'treemap')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <Treemap
          data={rows}
          dataKey={series[0]}
          nameKey={x}
          fill={palette[0]}
          stroke="var(--background)"
        >
          <Tooltip formatter={(value) => formatValue(value, widget)} />
        </Treemap>
      </ResponsiveContainer>
    );
  if (widget.type === 'funnel')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <FunnelChart>
          <Tooltip formatter={(value) => formatValue(value, widget)} />
          <Funnel data={rows} dataKey={series[0]} nameKey={x} fill={palette[0]}>
            <LabelList position="right" fill="currentColor" dataKey={x} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'gauge') {
    const value = Number(rows[0]?.[series[0]]) || 0;
    const target = widget.config?.target || 100;
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative h-36 w-72 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-72 rounded-full border-[28px] border-muted" />
          <div
            className="absolute inset-x-0 top-0 h-72 rounded-full border-[28px] border-primary"
            style={{
              clipPath: `polygon(0 0, ${Math.min(100, Math.max(0, (value / target) * 100))}% 0, ${Math.min(100, Math.max(0, (value / target) * 100))}% 50%, 0 50%)`,
            }}
          />
        </div>
        <strong className="-mt-8 text-4xl">{formatValue(value, widget)}</strong>
        <span className="text-xs text-muted-foreground">
          Target {formatValue(target, widget)}
        </span>
      </div>
    );
  }
  if (widget.type === 'box_plot') {
    const values = rows
      .map((row) => Number(row[series[0]]))
      .filter(Number.isFinite)
      .sort((a, b) => a - b);
    const quantile = (ratio: number) =>
      values[
        Math.min(values.length - 1, Math.floor((values.length - 1) * ratio))
      ];
    return (
      <div className="grid h-full grid-cols-5 items-center gap-2 text-center">
        {[
          ['Min', quantile(0)],
          ['Q1', quantile(0.25)],
          ['Median', quantile(0.5)],
          ['Q3', quantile(0.75)],
          ['Max', quantile(1)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border p-3">
            <span className="block text-xs text-muted-foreground">{label}</span>
            <strong>{formatValue(value, widget)}</strong>
          </div>
        ))}
      </div>
    );
  }
  const grid =
    widget.config?.showGrid === false ? null : (
      <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
    );
  const legend =
    widget.config?.showLegend === false ? null : (
      <Legend wrapperStyle={{ fontSize: 12 }} />
    );
  const tooltip = (
    <Tooltip
      formatter={(value) => formatValue(value, widget)}
      contentStyle={{ borderRadius: 10, borderColor: 'var(--border)' }}
    />
  );
  const axes = (
    <>
      {grid}
      <XAxis dataKey={x} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
      <YAxis
        tick={{ fontSize: 11 }}
        tickFormatter={(value) =>
          formatValue(value, {
            ...widget,
            config: { ...widget.config, numberFormat: 'compact' },
          })
        }
      />
      {tooltip}
      {legend}
    </>
  );
  if (widget.type === 'pie' || widget.type === 'donut')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          {tooltip}
          {legend}
          <Pie
            data={rows}
            dataKey={series[0]}
            nameKey={x}
            innerRadius={widget.type === 'donut' ? '52%' : 0}
            outerRadius="78%"
            paddingAngle={2}
            onClick={click}
          >
            {rows.map((_, index) => (
              <Cell
                key={`${widget.id}-${index}`}
                fill={palette[index % palette.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'radar')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={rows}>
          <PolarGrid />
          <PolarAngleAxis dataKey={x} tick={{ fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fontSize: 10 }} />
          {tooltip}
          {legend}
          {series.slice(0, 4).map((key, index) => (
            <Radar
              key={key}
              name={key}
              dataKey={key}
              stroke={palette[index]}
              fill={palette[index]}
              fillOpacity={0.12}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'radial')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart
          data={rows.slice(0, 8)}
          innerRadius="20%"
          outerRadius="92%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 'dataMax']} tick={false} />
          <RadialBar dataKey={series[0]} background cornerRadius={8}>
            {rows.slice(0, 8).map((_, index) => (
              <Cell
                key={`${widget.id}-${index}`}
                fill={palette[index % palette.length]}
              />
            ))}
          </RadialBar>
          {tooltip}
          {legend}
        </RadialBarChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'line')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={rows}>
          {axes}
          {series.slice(0, 6).map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              stroke={palette[index]}
              strokeWidth={2.5}
              dot={rows.length < 40 ? { r: 3 } : false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'area')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={rows}>
          {axes}
          {series.slice(0, 6).map((key, index) => (
            <Area
              key={key}
              dataKey={key}
              stackId={widget.config?.stacked ? 'stack' : undefined}
              stroke={palette[index]}
              fill={palette[index]}
              fillOpacity={0.14}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'scatter')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart data={rows}>
          {grid}
          <XAxis type="number" dataKey={x} name={x} tick={{ fontSize: 11 }} />
          <YAxis
            type="number"
            dataKey={series[0]}
            name={series[0]}
            tick={{ fontSize: 11 }}
          />
          {tooltip}
          <Scatter data={rows} fill={palette[0]} />
        </ScatterChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'combo')
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={rows}>
          {axes}
          <Bar dataKey={series[0]} fill={palette[0]} radius={[5, 5, 0, 0]} />
          {series.slice(1, 4).map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              stroke={palette[index + 1]}
              strokeWidth={2.5}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  if (widget.type === 'waterfall') {
    let running = 0;
    const waterfallRows = rows.map((row) => {
      const value = Number(row[series[0]]) || 0;
      const item = { ...row, __base: running, __change: value };
      running += value;
      return item;
    });
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={waterfallRows}>
          {axes}
          <Bar dataKey="__base" stackId="waterfall" fill="transparent" />
          <Bar dataKey="__change" stackId="waterfall" radius={[5, 5, 0, 0]}>
            {waterfallRows.map((row, index) => (
              <Cell
                key={`${widget.id}-waterfall-${index}`}
                fill={Number(row.__change) >= 0 ? palette[0] : palette[1]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  const horizontal = widget.type === 'horizontal_bar';
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout={horizontal ? 'vertical' : 'horizontal'}>
        {grid}
        {horizontal ? (
          <>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey={x}
              width={100}
              tick={{ fontSize: 11 }}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={x} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
          </>
        )}
        {tooltip}
        {legend}
        {series.slice(0, 6).map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={widget.type === 'stacked_bar' ? 'stack' : undefined}
            fill={palette[index]}
            radius={widget.type === 'stacked_bar' ? 0 : [5, 5, 0, 0]}
            onClick={click}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DashboardRenderer({
  definition,
  interactive = true,
  selectedId,
  onSelect,
  activePageId,
  onPageChange,
  hidePageTabs = false,
  onCrossFilter,
  loading = false,
  errors = {},
  selectedActions,
}: Readonly<{
  definition: DashboardDefinition;
  interactive?: boolean;
  selectedId?: string;
  onSelect?: (id: string) => void;
  activePageId?: string;
  onPageChange?: (id: string) => void;
  hidePageTabs?: boolean;
  onCrossFilter?: (column: string, value: unknown) => void;
  loading?: boolean;
  errors?: Record<string, string>;
  /** Rendered inside the selected widget (e.g. the studio's floating toolbar). */
  selectedActions?: ReactNode;
}>) {
  const [internalPageId, setInternalPageId] = useState(definition.pages[0]?.id);
  const [crossFilter, setCrossFilter] = useState<{
    column: string;
    value: unknown;
  } | null>(null);
  const pageId = activePageId ?? internalPageId;
  useEffect(() => {
    if (!definition.pages.some((page) => page.id === pageId))
      setInternalPageId(definition.pages[0]?.id);
  }, [definition.pages, pageId]);
  const page =
    definition.pages.find((item) => item.id === pageId) ?? definition.pages[0];
  const widgets = useMemo(
    () =>
      (page?.widgets ?? []).map((widget) =>
        crossFilter && !onCrossFilter && widget.data
          ? {
              ...widget,
              data: {
                ...widget.data,
                rows: widget.data.rows.filter(
                  (row) =>
                    String(row[crossFilter.column]) ===
                    String(crossFilter.value)
                ),
              },
            }
          : widget
      ),
    [page, crossFilter, onCrossFilter]
  );
  const changePage = (id: string) => {
    setInternalPageId(id);
    onPageChange?.(id);
    setCrossFilter(null);
  };
  if (!page)
    return (
      <div className="rounded-xl border border-dashed p-16 text-center text-sm text-muted-foreground">
        This dashboard has no pages yet.
      </div>
    );
  return (
    <div
      className="relative space-y-4 rounded-xl p-1"
      style={{ background: definition.theme?.background || undefined }}
    >
      {!hidePageTabs && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {definition.pages.map((item) => (
              <Button
                key={item.id}
                variant={item.id === page.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => changePage(item.id)}
              >
                {item.title ?? item.name ?? 'Page'}
              </Button>
            ))}
          </div>
          {crossFilter && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCrossFilter(null)}
            >
              <FilterX className="mr-1 h-4 w-4" />
              Clear {crossFilter.column}: {String(crossFilter.value)}
            </Button>
          )}
        </div>
      )}
      {loading && (
        <div className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden rounded-full bg-primary/15">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {widgets.map((widget) => (
          <section
            key={widget.id}
            onClick={onSelect ? () => onSelect(widget.id) : undefined}
            onKeyDown={
              onSelect
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ')
                      onSelect(widget.id);
                  }
                : undefined
            }
            role={onSelect ? 'button' : 'region'}
            aria-label={widget.title}
            tabIndex={onSelect ? 0 : -1}
            className={`relative border bg-card p-5 shadow-sm transition ${widgetWidthClass[widget.layout?.width ?? 6]} ${selectedId === widget.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:shadow-md'}`}
            style={{
              minHeight: widget.layout?.height ?? 360,
              borderRadius: definition.theme?.radius ?? 12,
            }}
          >
            {selectedId === widget.id && selectedActions}
            <div className="mb-3">
              <h3 className="font-semibold text-foreground">{widget.title}</h3>
              {widget.config?.description && widget.type !== 'kpi' && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {widget.config.description}
                </p>
              )}
            </div>
            <Chart
              widget={widget}
              interactive={interactive}
              onFilter={(column, value) => {
                if (onCrossFilter) onCrossFilter(column, value);
                else setCrossFilter({ column, value });
              }}
            />
            {errors[widget.id] && (
              <p className="mt-3 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
                {errors[widget.id]}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
