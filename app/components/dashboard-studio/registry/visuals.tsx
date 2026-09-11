/**
 * Visual types the studio can insert.
 *
 * Adding a visual = a `visualTypes` entry in `lib/constants/dashboard-studio.ts`
 * (label, description, group) + an icon here + optional `create` overrides +
 * its renderer branch in `dashboard-renderer.tsx`.
 */
import {
  ChartArea,
  ChartBar,
  ChartBarStacked,
  ChartCandlestick,
  ChartColumn,
  ChartColumnBig,
  ChartColumnDecreasing,
  ChartLine,
  ChartNoAxesCombined,
  ChartPie,
  ChartScatter,
  Donut,
  Funnel,
  Gauge,
  Grid3x3,
  Hash,
  Image,
  LayoutGrid,
  ListFilter,
  MapPin,
  Radar,
  Shapes,
  Table,
  Target,
  Type,
  type LucideIcon,
} from 'lucide-react';
import { visualTypes } from '~/lib/constants/dashboard-studio';
import type {
  DashboardWidget,
  DashboardWidgetType,
} from '~/lib/types/dashboard';

type NewWidget = Omit<DashboardWidget, 'id'>;
type CreateContext = { sourceId?: string };

export type VisualDefinition = (typeof visualTypes)[number] & {
  icon: LucideIcon;
  create: (ctx: CreateContext) => NewWidget;
};

const icons: Record<DashboardWidgetType, LucideIcon> = {
  kpi: Hash,
  gauge: Gauge,
  bar: ChartColumn,
  horizontal_bar: ChartBar,
  stacked_bar: ChartBarStacked,
  combo: ChartNoAxesCombined,
  radar: Radar,
  waterfall: ChartColumnDecreasing,
  line: ChartLine,
  area: ChartArea,
  pie: ChartPie,
  donut: Donut,
  treemap: LayoutGrid,
  funnel: Funnel,
  radial: Target,
  scatter: ChartScatter,
  histogram: ChartColumnBig,
  box_plot: ChartCandlestick,
  heatmap: Grid3x3,
  table: Table,
  map: MapPin,
  text: Type,
  image: Image,
  shape: Shapes,
  filter: ListFilter,
};

const DECORATIVE: DashboardWidgetType[] = ['text', 'image', 'shape'];

/** Per-type tweaks over the shared defaults below. */
const overrides: Partial<Record<DashboardWidgetType, Partial<NewWidget>>> = {
  kpi: { layout: { width: 4, height: 240 } },
  text: {
    text: 'Explain the insight, methodology or recommended action here.',
    layout: { width: 12, height: 220 },
  },
  gauge: {
    config: {
      showGrid: true,
      showLegend: true,
      numberFormat: 'standard',
      decimals: 0,
      target: 100,
    },
  },
};

function baseWidget(
  type: DashboardWidgetType,
  label: string,
  { sourceId }: CreateContext
): NewWidget {
  const decorative = DECORATIVE.includes(type);
  return {
    type,
    title: label,
    source_id: decorative ? undefined : sourceId,
    query: decorative
      ? undefined
      : {
          dimensions: [],
          measures: [{ operation: 'count', label: 'Records' }],
          filters: [],
          limit: 250,
        },
    config: {
      showGrid: true,
      showLegend: true,
      numberFormat: 'standard',
      decimals: 0,
    },
    layout: { width: 6, height: 360 },
  };
}

export const visuals: VisualDefinition[] = visualTypes.map((item) => ({
  ...item,
  icon: icons[item.value],
  create: (ctx) => ({
    ...baseWidget(item.value, item.label, ctx),
    ...overrides[item.value],
  }),
}));

export function getVisual(type: DashboardWidgetType) {
  return visuals.find((item) => item.value === type)!;
}
