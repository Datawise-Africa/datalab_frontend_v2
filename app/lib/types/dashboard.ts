import type { MinimalUser, MinimalWorkspace } from '~/lib/types/common';
import type { ProductValidation } from '~/lib/types/validation';

export type DashboardStatus = 'DF' | 'PB' | 'AR';
export type DashboardBuilderMode = 'external' | 'native';
export type DashboardWidgetType =
  | 'kpi'
  | 'bar'
  | 'horizontal_bar'
  | 'stacked_bar'
  | 'line'
  | 'area'
  | 'combo'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'radar'
  | 'radial'
  | 'table'
  | 'text'
  | 'map'
  | 'heatmap'
  | 'waterfall'
  | 'treemap'
  | 'funnel'
  | 'gauge'
  | 'histogram'
  | 'box_plot'
  | 'filter'
  | 'image'
  | 'shape';

export interface DashboardColumn {
  name: string;
  type: 'number' | 'text' | 'date' | 'boolean';
  nullable?: boolean;
  unique_count?: number;
}
export interface DashboardDataSource {
  id: string;
  name: string;
  kind: 'datalab_dataset' | 'file_upload' | 'public_api';
  dataset?: string | null;
  api_url?: string;
  config?: {
    records_path?: string;
    transforms?: Record<string, boolean>;
  };
  schema: DashboardColumn[];
  preview_rows: Record<string, unknown>[];
  row_count: number;
  status: 'pending' | 'ready' | 'failed';
  last_error?: string;
  refreshed_at?: string | null;
}
export interface DashboardQuery {
  dimensions: string[];
  measures: Array<{
    column?: string;
    operation:
      | 'sum'
      | 'average'
      | 'min'
      | 'max'
      | 'count'
      | 'count_distinct'
      | 'median'
      | 'stddev'
      | 'variance'
      | 'percentile';
    label?: string;
    percentile?: number;
  }>;
  filters?: Array<{
    column: string;
    operator:
      | 'equals'
      | 'not_equals'
      | 'contains'
      | 'not_contains'
      | 'starts_with'
      | 'ends_with'
      | 'gt'
      | 'gte'
      | 'lt'
      | 'lte'
      | 'is_null'
      | 'not_null'
      | 'between'
      | 'date_between'
      | 'in';
    value: string | number | string[];
  }>;
  sort?: { column: string; direction: 'asc' | 'desc' };
  limit?: number;
  calculated_fields?: Array<{
    name: string;
    left: string;
    operator: 'add' | 'subtract' | 'multiply' | 'divide' | 'percent';
    right?: string;
    right_value?: number;
    expression?: string;
  }>;
  source_ids?: string[];
  dimension_specs?: Array<{
    column: string;
    label?: string;
    date_grain?: 'year' | 'quarter' | 'month' | 'week' | 'day';
  }>;
  table_calculations?: Array<{
    column: string;
    operation: 'running_total' | 'rank' | 'percent_of_total' | 'moving_average';
    label?: string;
    window?: number;
    direction?: 'asc' | 'desc';
  }>;
}
export interface DashboardAnalysis {
  columns: DashboardColumn[];
  rows: Record<string, unknown>[];
  row_count: number;
  truncated: boolean;
  source_row_count?: number;
  source_freshness?: Record<string, string | null>;
  cached?: boolean;
}
export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  source_id?: string;
  query?: DashboardQuery;
  data?: DashboardAnalysis;
  text?: string;
  config?: {
    x?: string;
    y?: string;
    color?: string;
    prefix?: string;
    suffix?: string;
    showLegend?: boolean;
    showGrid?: boolean;
    showLabels?: boolean;
    stacked?: boolean;
    palette?: string[];
    numberFormat?: 'standard' | 'compact' | 'currency' | 'percent';
    decimals?: number;
    currency?: string;
    description?: string;
    target?: number;
    conditionalRules?: Array<{
      operator: 'gt' | 'gte' | 'lt' | 'lte' | 'equals';
      value: number;
      color: string;
    }>;
    latitude?: string;
    longitude?: string;
    geography?: string;
    imageUrl?: string;
    imageAlt?: string;
  };
  layout?: { width: 3 | 4 | 6 | 8 | 9 | 12; height: number };
}
export interface DashboardPage {
  id: string;
  title: string;
  name?: string;
  widgets: DashboardWidget[];
}
export interface DashboardDefinition {
  version: number;
  pages: DashboardPage[];
  theme?: {
    preset?: 'datalab' | 'light' | 'soft' | 'contrast';
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    radius?: number;
  };
  settings?: {
    showTitles?: boolean;
    showDescriptions?: boolean;
    compact?: boolean;
  };
  filters?: DashboardGlobalFilter[];
}

export interface DashboardGlobalFilter {
  id: string;
  label: string;
  column: string;
  operator: NonNullable<DashboardQuery['filters']>[number]['operator'];
  value?: string | number | string[];
  sourceIds?: string[];
}

export interface DashboardRelationship {
  id: string;
  left_source: string;
  left_key: string;
  right_source: string;
  right_key: string;
  join_type: 'left' | 'right' | 'inner' | 'outer';
  cardinality?: 'one_to_one' | 'one_to_many' | 'many_to_one' | 'many_to_many';
  enabled?: boolean;
}

export interface DashboardSemanticModel {
  version: number;
  relationships: DashboardRelationship[];
  unions?: Array<Record<string, unknown>>;
  dimensions?: Array<{
    name: string;
    column: string;
    source_id: string;
    description?: string;
  }>;
  measures?: Array<{
    name: string;
    column?: string;
    source_id: string;
    operation: DashboardQuery['measures'][number]['operation'];
    description?: string;
  }>;
}

export interface DashboardRefreshPolicy {
  enabled: boolean;
  frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  timezone: string;
}

export interface DashboardRefreshRun {
  id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  trigger: 'manual' | 'scheduled' | 'source_update';
  source_count: number;
  refreshed_count: number;
  error?: string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export interface DashboardAlert {
  id: string;
  name: string;
  widget_id: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'equals';
  threshold: number;
  recipients: string[];
  is_active: boolean;
  last_value?: number | null;
  last_evaluated_at?: string | null;
  last_triggered_at?: string | null;
}

export interface DashboardComment {
  id: string;
  page_id?: string;
  widget_id?: string;
  body: string;
  author: string;
  author_name: string;
  resolved_at?: string | null;
  created_at: string;
}

export interface DashboardExecution {
  results: Record<string, DashboardAnalysis>;
  errors: Record<string, string>;
  generated_at: string;
}

export interface DashboardSourceProfileColumn extends DashboardColumn {
  missing_count: number;
  missing_percent: number;
  sample_values: unknown[];
  min?: number;
  max?: number;
  mean?: number;
}
export interface DashboardSourceProfile {
  row_count: number;
  column_count: number;
  duplicate_rows: number;
  columns: DashboardSourceProfileColumn[];
}
export interface DashboardShareLink {
  id: string;
  access: 'view' | 'interact';
  expires_at?: string | null;
  is_active: boolean;
  password_protected?: boolean;
  created_at: string;
}
export interface DashboardRevision {
  id: string;
  definition: DashboardDefinition;
  note: string;
  created_by?: string | null;
  created_at: string;
}
export interface DashboardInfographic {
  id: string;
  title: string;
  definition: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
}

export interface DashboardCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Dashboard {
  id: string;
  title: string;
  slug: string;
  description: string;
  dashboard_url?: string;
  builder_mode: DashboardBuilderMode;
  definition: DashboardDefinition;
  semantic_model: DashboardSemanticModel;
  refresh_policy: DashboardRefreshPolicy;
  last_refreshed_at?: string | null;
  data_sources?: DashboardDataSource[];
  infographic_count?: number;
  category: DashboardCategory | null;
  owner: MinimalUser;
  workspace: MinimalWorkspace | null;
  is_public: boolean;
  thumbnail: string | null;
  status: DashboardStatus;
  verification_status:
    | 'pending'
    | 'in_review'
    | 'changes_requested'
    | 'approved'
    | 'rejected';
  validation: ProductValidation | null;
  tags: string[];
  /** Backend returns number; spec says string — accept both. */
  average_rating?: number | string;
  total_reviews?: number | string;
  total_bookmarks?: number | string;
  created_at: string;
  updated_at: string;
  /** Token for the stored definition; echo as `base_version` when saving. */
  definition_version?: string;
}

export interface CreateDashboardInput {
  title: string;
  description?: string;
  dashboard_url?: string;
  builder_mode?: DashboardBuilderMode;
  definition?: DashboardDefinition;
  semantic_model?: DashboardSemanticModel;
  refresh_policy?: DashboardRefreshPolicy;
  category?: string | null;
  workspace?: string | null;
  is_public?: boolean;
  thumbnail?: string | null;
  status?: DashboardStatus;
  tags?: string[];
}

export type UpdateDashboardInput = Partial<CreateDashboardInput>;

export interface CreateDashboardCategoryInput {
  name: string;
  description?: string;
}

export type UpdateDashboardCategoryInput =
  Partial<CreateDashboardCategoryInput>;
