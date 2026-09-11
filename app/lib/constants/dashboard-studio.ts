import type {
  DashboardDefinition,
  DashboardQuery,
  DashboardWidget,
  DashboardWidgetType,
} from '~/lib/types/dashboard';

type Option<T> = { value: T; label: string };
type MeasureOperation = DashboardQuery['measures'][number]['operation'];
type FilterOperator = NonNullable<
  DashboardQuery['filters']
>[number]['operator'];
type DateGrain = NonNullable<
  NonNullable<DashboardQuery['dimension_specs']>[number]['date_grain']
>;
type ThemePreset = NonNullable<
  NonNullable<DashboardDefinition['theme']>['preset']
>;
type NumberFormat = NonNullable<
  NonNullable<DashboardWidget['config']>['numberFormat']
>;
type WidgetWidth = NonNullable<DashboardWidget['layout']>['width'];

export const visualGroups = [
  'Metrics',
  'Comparison',
  'Trend',
  'Composition',
  'Distribution',
  'Tables & maps',
  'Content',
  'Controls',
] as const;
export type VisualGroup = (typeof visualGroups)[number];

export const visualTypes: Array<{
  value: DashboardWidgetType;
  label: string;
  description: string;
  group: VisualGroup;
}> = [
  {
    value: 'kpi',
    label: 'KPI',
    description: 'A headline metric',
    group: 'Metrics',
  },
  {
    value: 'gauge',
    label: 'Gauge',
    description: 'Progress against target',
    group: 'Metrics',
  },
  {
    value: 'bar',
    label: 'Column',
    description: 'Compare categories',
    group: 'Comparison',
  },
  {
    value: 'horizontal_bar',
    label: 'Bar',
    description: 'Rank categories',
    group: 'Comparison',
  },
  {
    value: 'stacked_bar',
    label: 'Stacked',
    description: 'Part-to-whole comparison',
    group: 'Comparison',
  },
  {
    value: 'combo',
    label: 'Combo',
    description: 'Columns and lines',
    group: 'Comparison',
  },
  {
    value: 'radar',
    label: 'Radar',
    description: 'Multi-metric profiles',
    group: 'Comparison',
  },
  {
    value: 'waterfall',
    label: 'Waterfall',
    description: 'Metric contributions',
    group: 'Comparison',
  },
  {
    value: 'line',
    label: 'Line',
    description: 'Trends over time',
    group: 'Trend',
  },
  {
    value: 'area',
    label: 'Area',
    description: 'Volume and trends',
    group: 'Trend',
  },
  {
    value: 'pie',
    label: 'Pie',
    description: 'Simple composition',
    group: 'Composition',
  },
  {
    value: 'donut',
    label: 'Donut',
    description: 'Composition with focus',
    group: 'Composition',
  },
  {
    value: 'radial',
    label: 'Radial',
    description: 'Progress and rankings',
    group: 'Composition',
  },
  {
    value: 'treemap',
    label: 'Treemap',
    description: 'Hierarchical composition',
    group: 'Composition',
  },
  {
    value: 'funnel',
    label: 'Funnel',
    description: 'Stage conversion',
    group: 'Composition',
  },
  {
    value: 'scatter',
    label: 'Scatter',
    description: 'Relationships and outliers',
    group: 'Distribution',
  },
  {
    value: 'heatmap',
    label: 'Heatmap',
    description: 'Intensity matrix',
    group: 'Distribution',
  },
  {
    value: 'histogram',
    label: 'Histogram',
    description: 'Numeric distribution',
    group: 'Distribution',
  },
  {
    value: 'box_plot',
    label: 'Box plot',
    description: 'Spread and outliers',
    group: 'Distribution',
  },
  {
    value: 'table',
    label: 'Table',
    description: 'Detailed values',
    group: 'Tables & maps',
  },
  {
    value: 'map',
    label: 'Map',
    description: 'Geographic patterns',
    group: 'Tables & maps',
  },
  {
    value: 'text',
    label: 'Narrative',
    description: 'Context and interpretation',
    group: 'Content',
  },
  {
    value: 'image',
    label: 'Image',
    description: 'Photos and branding',
    group: 'Content',
  },
  {
    value: 'shape',
    label: 'Shape',
    description: 'Grouping and emphasis',
    group: 'Content',
  },
  {
    value: 'filter',
    label: 'Filter control',
    description: 'Viewer filtering',
    group: 'Controls',
  },
];

export const measureOperations: MeasureOperation[] = [
  'count',
  'count_distinct',
  'sum',
  'average',
  'min',
  'max',
  'median',
  'stddev',
  'variance',
  'percentile',
];

export const filterOperators: FilterOperator[] = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'gt',
  'gte',
  'lt',
  'lte',
  'between',
  'date_between',
  'in',
  'is_null',
  'not_null',
];

export const dateGrains: DateGrain[] = [
  'year',
  'quarter',
  'month',
  'week',
  'day',
];

export const tableCalculationOptions: Option<
  NonNullable<DashboardQuery['table_calculations']>[number]['operation']
>[] = [
  { value: 'running_total', label: 'Running total' },
  { value: 'rank', label: 'Rank' },
  { value: 'percent_of_total', label: 'Percent of total' },
  { value: 'moving_average', label: 'Moving average' },
];

export const calculatedFieldOperators: Option<
  'add' | 'subtract' | 'multiply' | 'divide' | 'percent'
>[] = [
  { value: 'add', label: 'Add (+)' },
  { value: 'subtract', label: 'Subtract (−)' },
  { value: 'multiply', label: 'Multiply (×)' },
  { value: 'divide', label: 'Divide (÷)' },
  { value: 'percent', label: 'Percent of' },
];

export const themePresetOptions: Option<ThemePreset>[] = [
  { value: 'datalab', label: 'Datalab' },
  { value: 'light', label: 'Clean light' },
  { value: 'soft', label: 'Soft canvas' },
  { value: 'contrast', label: 'High contrast' },
];

export const numberFormatOptions: Option<NumberFormat>[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'compact', label: 'Compact' },
  { value: 'currency', label: 'Currency' },
  { value: 'percent', label: 'Percent' },
];

export const widgetWidths: WidgetWidth[] = [3, 4, 6, 8, 9, 12];
export const widgetHeights = [220, 300, 360, 440, 520, 640];
export const decimalPlaces = [0, 1, 2, 3];

export const inspectorWidthPresets: Option<number>[] = [
  { value: 320, label: 'Compact' },
  { value: 420, label: 'Comfortable' },
  { value: 560, label: 'Wide' },
];

export const chartPalette = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

// Full class strings so Tailwind can detect them.
export const widgetWidthClass: Record<number, string> = {
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  12: 'lg:col-span-12',
};

export const infographicSizes = {
  portrait: { width: 1080, height: 1350 },
  square: { width: 1080, height: 1080 },
  landscape: { width: 1350, height: 1080 },
};

export const shareAccessOptions: Option<'view' | 'interact'>[] = [
  { value: 'interact', label: 'View and interact' },
  { value: 'view', label: 'View only' },
];

export const sortDirectionOptions: Option<'asc' | 'desc'>[] = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

/** Picker value for "count rows" in the measure field list. */
export const ROWS_MEASURE = '__rows';
/** Picker value for "fixed number" as a calculated field's second operand. */
export const FIXED_NUMBER = '__constant';

export const dataSourceKindOptions: Array<{
  value: 'file_upload' | 'datalab_dataset' | 'public_api';
  label: string;
  description: string;
}> = [
  {
    value: 'file_upload',
    label: 'File',
    description: 'CSV, TSV, Excel, JSON or Parquet',
  },
  {
    value: 'datalab_dataset',
    label: 'Datalab',
    description: 'Workspace, personal or approved public datasets',
  },
  {
    value: 'public_api',
    label: 'API',
    description: 'Public HTTPS endpoint returning JSON',
  },
];

export const dataSourceFileAccept = '.csv,.tsv,.xlsx,.xls,.json,.parquet';
