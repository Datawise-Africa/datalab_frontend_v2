import {
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
} from '@dnd-kit/core';
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { BarChart3, FilterX, GripVertical } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { StudioGeoMap } from './studio-geo-map';
import { WidgetResizeHandle, type WidgetLayout } from './widget-resize-handle';
import type {
  DashboardDefinition,
  DashboardWidget,
} from '~/lib/types/dashboard';
import {
  themePresetStyles,
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
  editing,
  onFilter,
  themePalette,
}: Readonly<{
  widget: DashboardWidget;
  interactive: boolean;
  /** Studio edit mode: empty states hint at configuring the visual. */
  editing: boolean;
  onFilter: (column: string, value: unknown) => void;
  themePalette: string[];
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
  const basePalette = widget.config?.palette?.length
    ? widget.config.palette
    : themePalette;
  // Repeat so series beyond the palette length still get a colour.
  const palette = Array.from(
    { length: Math.max(20, basePalette.length) },
    (_, index) => basePalette[index % basePalette.length]
  );
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
        {/* Scales with the card (container query) so long values never spill. */}
        <div className="text-[clamp(1.5rem,18cqi,3rem)] leading-tight font-bold tracking-tight text-foreground tabular-nums">
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
      <div
        className="scrollbar-thin overflow-auto"
        style={{ maxHeight: height }}
      >
        <table className="w-max min-w-full text-sm">
          <thead>
            <tr>
              {widget.data?.columns.map((column) => (
                <th
                  key={column.name}
                  className={cn(
                    'sticky top-0 border-b bg-card p-2.5 font-medium whitespace-nowrap',
                    column.type === 'number' ? 'text-right' : 'text-left'
                  )}
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
                  <td
                    key={column.name}
                    className={cn(
                      'p-2.5 whitespace-nowrap',
                      column.type === 'number' && 'text-right tabular-nums'
                    )}
                  >
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
        <span className="text-sm">
          {editing
            ? 'Configure the fields, then run analysis'
            : 'No data to show'}
        </span>
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
      <Legend
        iconSize={8}
        wrapperStyle={{ fontSize: 11, maxHeight: 72, overflowY: 'auto' }}
        formatter={(value) => (
          <span style={{ color: 'var(--muted-foreground)' }}>{value}</span>
        )}
      />
    );
  const tooltip = (
    <Tooltip
      formatter={(value) => formatValue(value, widget)}
      contentStyle={{ borderRadius: 10, borderColor: 'var(--border)' }}
    />
  );
  // Show every category label when there are few; angle them when crowded.
  const categoryAxis = {
    dataKey: x,
    tick: { fontSize: 11 },
    interval: rows.length <= 12 ? 0 : ('preserveStartEnd' as const),
    angle: rows.length > 6 ? -30 : 0,
    textAnchor: rows.length > 6 ? ('end' as const) : ('middle' as const),
    height: rows.length > 6 ? 56 : 30,
  };
  const compactTicks = (value: unknown) =>
    formatValue(value, {
      ...widget,
      config: { ...widget.config, numberFormat: 'compact' },
    });
  const axes = (
    <>
      {grid}
      <XAxis {...categoryAxis} />
      <YAxis tick={{ fontSize: 11 }} tickFormatter={compactTicks} />
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
          // `name` labels the legend; `fill` colours each bar and legend icon.
          data={rows.slice(0, 8).map((row, index) => ({
            ...row,
            name: String(row[x] ?? ''),
            fill: palette[index % palette.length],
          }))}
          innerRadius="20%"
          outerRadius="92%"
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 'dataMax']} tick={false} />
          <RadialBar dataKey={series[0]} background cornerRadius={8} />
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
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={compactTicks}
            />
            <YAxis
              type="category"
              dataKey={x}
              width={100}
              interval={0}
              tick={{ fontSize: 11 }}
            />
          </>
        ) : (
          <>
            <XAxis {...categoryAxis} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={compactTicks} />
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

type ShellProps = {
  widget: DashboardWidget;
  onSelect?: (id: string) => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function WidgetShell({
  widget,
  onSelect,
  className,
  style,
  children,
  nodeRef,
  handle,
}: Readonly<
  ShellProps & {
    nodeRef?: (node: HTMLElement | null) => void;
    handle?: ReactNode;
  }
>) {
  return (
    <section
      ref={nodeRef}
      onClick={onSelect ? () => onSelect(widget.id) : undefined}
      onKeyDown={
        onSelect
          ? (event) => {
              if (
                event.target === event.currentTarget &&
                (event.key === 'Enter' || event.key === ' ')
              )
                onSelect(widget.id);
            }
          : undefined
      }
      role={onSelect ? 'button' : 'region'}
      aria-label={widget.title}
      tabIndex={onSelect ? 0 : -1}
      className={className}
      style={style}
    >
      {handle}
      {children}
    </section>
  );
}

/** Card with a dnd-kit drag handle (pointer, touch and keyboard). */
function SortableWidgetShell(props: Readonly<ShellProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.widget.id });
  return (
    <WidgetShell
      {...props}
      nodeRef={setNodeRef}
      className={cn(props.className, isDragging && 'z-20 opacity-70 shadow-xl')}
      style={{
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      handle={
        <button
          ref={setActivatorNodeRef}
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${props.widget.title}`}
          onClick={(event) => event.stopPropagation()}
          className="absolute top-4 left-2 z-10 flex h-7 w-5 cursor-grab touch-none items-center justify-center rounded text-muted-foreground opacity-40 transition group-hover:opacity-100 hover:bg-muted focus-visible:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      }
    />
  );
}

/** Screen-reader messages that name the visuals being moved. */
function reorderAnnouncements(widgets: DashboardWidget[]): Announcements {
  const title = (id: string | number) =>
    widgets.find((widget) => widget.id === String(id))?.title ?? 'visual';
  return {
    onDragStart: ({ active }) => `Picked up ${title(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${title(active.id)} is over ${title(over.id)}.`
        : `${title(active.id)} is no longer over another visual.`,
    onDragEnd: ({ active, over }) =>
      over
        ? `${title(active.id)} moved to where ${title(over.id)} was.`
        : `${title(active.id)} dropped.`,
    onDragCancel: ({ active }) => `Reordering ${title(active.id)} cancelled.`,
  };
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
  onReorder,
  onResize,
  widgetOverlay,
  showGridGuides = false,
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
  /** Enables drag-and-drop reordering (studio edit mode). */
  onReorder?: (sourceId: string, targetId: string) => void;
  /** Shows a snap-to-grid resize handle on the selected visual. */
  onResize?: (id: string, layout: WidgetLayout) => void;
  /** Extra content rendered inside each card (e.g. studio comment pins). */
  widgetOverlay?: (widget: DashboardWidget) => ReactNode;
  /** Studio aid: dashed 12-column guides behind the visuals. */
  showGridGuides?: boolean;
}>) {
  const [internalPageId, setInternalPageId] = useState(definition.pages[0]?.id);
  // Live size while a resize handle is dragged; committed once on release.
  const [resizing, setResizing] = useState<{
    id: string;
    layout: WidgetLayout;
  } | null>(null);
  const dndId = useId();
  const sensors = useSensors(
    // Small distance so a click still selects instead of starting a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
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
  const preset = themePresetStyles[definition.theme?.preset ?? 'datalab'];
  const settings = definition.settings ?? {};
  const compact = settings.compact === true;
  const Shell = onReorder ? SortableWidgetShell : WidgetShell;
  const grid = (
    <div
      className={cn(
        'grid grid-cols-1 @2xl:grid-cols-12',
        compact ? 'gap-2' : 'gap-4'
      )}
    >
      {widgets.map((widget) => {
        const layout =
          resizing?.id === widget.id
            ? resizing.layout
            : {
                width: widget.layout?.width ?? 6,
                height: widget.layout?.height ?? 360,
              };
        const selected = selectedId === widget.id;
        return (
          <Shell
            key={widget.id}
            widget={widget}
            onSelect={onSelect}
            className={cn(
              'group @container relative transition',
              preset.card,
              compact ? 'p-3' : 'p-5',
              widgetWidthClass[layout.width],
              selected ? 'ring-2 ring-primary ring-offset-2' : 'hover:shadow-md'
            )}
            style={{
              minHeight: layout.height,
              borderRadius: definition.theme?.radius ?? 12,
            }}
          >
            {selected && selectedActions}
            {widgetOverlay?.(widget)}
            {selected && onResize && (
              <WidgetResizeHandle
                title={widget.title}
                layout={layout}
                onPreview={(next) =>
                  setResizing(next && { id: widget.id, layout: next })
                }
                onCommit={(next) => onResize(widget.id, next)}
              />
            )}
            {(settings.showTitles !== false ||
              settings.showDescriptions !== false) && (
              <div
                className={cn(compact ? 'mb-2' : 'mb-3', onReorder && 'pl-6')}
              >
                {settings.showTitles !== false && (
                  <h3 className="font-semibold text-foreground">
                    {widget.title}
                  </h3>
                )}
                {settings.showDescriptions !== false &&
                  widget.config?.description &&
                  widget.type !== 'kpi' && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {widget.config.description}
                    </p>
                  )}
              </div>
            )}
            <Chart
              widget={
                resizing?.id === widget.id ? { ...widget, layout } : widget
              }
              interactive={interactive}
              editing={Boolean(onSelect)}
              themePalette={preset.palette}
              onFilter={(column, value) => {
                if (onCrossFilter) onCrossFilter(column, value);
                else setCrossFilter({ column, value });
              }}
            />
            {errors[widget.id] && (
              <p className="mt-3 line-clamp-3 rounded-lg bg-destructive/10 p-2 text-xs break-words text-destructive">
                {errors[widget.id]}
              </p>
            )}
          </Shell>
        );
      })}
    </div>
  );
  return (
    <div
      className={cn(
        '@container relative space-y-4 rounded-xl p-1',
        preset.canvas
      )}
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
      {showGridGuides && (
        // Same columns and gap as the grid below, so the guides line up.
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-1 bottom-1 hidden @2xl:grid @2xl:grid-cols-12',
            hidePageTabs ? 'top-1' : 'top-14',
            compact ? 'gap-2' : 'gap-4'
          )}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className="rounded-sm bg-primary/[0.04] outline-1 outline-primary/25 outline-dashed"
            />
          ))}
        </div>
      )}
      {onReorder ? (
        <DndContext
          id={dndId}
          sensors={sensors}
          collisionDetection={closestCenter}
          accessibility={{ announcements: reorderAnnouncements(widgets) }}
          onDragEnd={({ active, over }) => {
            if (over && active.id !== over.id)
              onReorder(String(active.id), String(over.id));
          }}
        >
          <SortableContext
            items={widgets.map((widget) => widget.id)}
            strategy={rectSortingStrategy}
          >
            {grid}
          </SortableContext>
        </DndContext>
      ) : (
        grid
      )}
    </div>
  );
}
