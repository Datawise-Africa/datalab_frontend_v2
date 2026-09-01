import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  Copy,
  Database,
  Eye,
  FileSpreadsheet,
  Globe2,
  History,
  ImageDown,
  LayoutDashboard,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Redo2,
  Save,
  Settings2,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Undo2,
  X,
  Network,
  RefreshCw,
  Bell,
  MessageSquare,
  Download,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { Badge } from '~/components/ui/badge';
import { Switch } from '~/components/ui/switch';
import { Picker } from '~/components/ui/picker';
import { DashboardRenderer } from './dashboard-renderer';
import {
  AlertsDialog,
  CommentsDialog,
  DataModelDialog,
  RefreshDialog,
} from './studio-management-dialogs';
import { SourcePreparationDialog } from './source-preparation-dialog';
import { InfographicBuilder } from './infographic-builder';
import { useMyDashboard } from '~/features/my-dashboards';
import { useWorkspaceDashboard } from '~/features/workspaces';
import {
  useAddDashboardSource,
  useCreateDashboardShare,
  useDashboardRevisions,
  useDashboardDatasetOptions,
  useDashboardShareLinks,
  useDashboardSourceProfile,
  useDashboardSources,
  useDeleteDashboardSource,
  useRestoreDashboardRevision,
  useRevokeDashboardShare,
  useRunDashboardAnalysis,
  useSaveDashboardDefinition,
  useRenderDashboard,
  exportDashboardAnalysis,
} from '~/features/dashboard-studio';
import type {
  DashboardDataSource,
  DashboardDefinition,
  DashboardQuery,
  DashboardWidget,
  DashboardWidgetType,
} from '~/lib/types/dashboard';
import { toastUtils } from '~/lib/utils/toast';

const visualTypes: Array<{
  value: DashboardWidgetType;
  label: string;
  description: string;
}> = [
  { value: 'kpi', label: 'KPI', description: 'A headline metric' },
  { value: 'bar', label: 'Column', description: 'Compare categories' },
  { value: 'horizontal_bar', label: 'Bar', description: 'Rank categories' },
  {
    value: 'stacked_bar',
    label: 'Stacked',
    description: 'Part-to-whole comparison',
  },
  { value: 'line', label: 'Line', description: 'Trends over time' },
  { value: 'area', label: 'Area', description: 'Volume and trends' },
  { value: 'combo', label: 'Combo', description: 'Columns and lines' },
  { value: 'pie', label: 'Pie', description: 'Simple composition' },
  { value: 'donut', label: 'Donut', description: 'Composition with focus' },
  {
    value: 'scatter',
    label: 'Scatter',
    description: 'Relationships and outliers',
  },
  { value: 'radar', label: 'Radar', description: 'Multi-metric profiles' },
  { value: 'radial', label: 'Radial', description: 'Progress and rankings' },
  { value: 'table', label: 'Table', description: 'Detailed values' },
  {
    value: 'text',
    label: 'Narrative',
    description: 'Context and interpretation',
  },
  { value: 'map', label: 'Map', description: 'Geographic patterns' },
  { value: 'heatmap', label: 'Heatmap', description: 'Intensity matrix' },
  {
    value: 'waterfall',
    label: 'Waterfall',
    description: 'Metric contributions',
  },
  {
    value: 'treemap',
    label: 'Treemap',
    description: 'Hierarchical composition',
  },
  { value: 'funnel', label: 'Funnel', description: 'Stage conversion' },
  { value: 'gauge', label: 'Gauge', description: 'Progress against target' },
  {
    value: 'histogram',
    label: 'Histogram',
    description: 'Numeric distribution',
  },
  { value: 'box_plot', label: 'Box plot', description: 'Spread and outliers' },
  { value: 'filter', label: 'Filter control', description: 'Viewer filtering' },
  { value: 'image', label: 'Image', description: 'Photos and branding' },
  { value: 'shape', label: 'Shape', description: 'Grouping and emphasis' },
];
const operations: DashboardQuery['measures'][number]['operation'][] = [
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
type FilterOperator = NonNullable<
  DashboardQuery['filters']
>[number]['operator'];
type ThemePreset = NonNullable<DashboardDefinition['theme']>['preset'];
type WidgetWidth = NonNullable<DashboardWidget['layout']>['width'];
type NumberFormat = NonNullable<DashboardWidget['config']>['numberFormat'];
const filterOperators: FilterOperator[] = [
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

function newId() {
  return globalThis.crypto.randomUUID();
}
function normalizeDefinition(value?: DashboardDefinition): DashboardDefinition {
  const source = structuredClone(value ?? { version: 2, pages: [] });
  source.version = 2;
  source.pages = (
    source.pages?.length
      ? source.pages
      : [{ id: newId(), title: 'Overview', widgets: [] }]
  ).map((page, pageIndex) => ({
    ...page,
    title: page.title ?? page.name ?? `Page ${pageIndex + 1}`,
    widgets: (page.widgets ?? []).map((widget) => ({
      ...widget,
      layout: widget.layout ?? {
        width: 6,
        height: widget.type === 'kpi' ? 240 : 360,
      },
      config: {
        showGrid: true,
        showLegend: true,
        numberFormat: 'standard',
        decimals: 0,
        ...widget.config,
      },
    })),
  }));
  source.theme = { preset: 'datalab', radius: 12, ...source.theme };
  source.settings = {
    showTitles: true,
    showDescriptions: true,
    compact: false,
    ...source.settings,
  };
  return source;
}

export function DashboardStudio({
  dashboardId,
  workspaceId,
}: Readonly<{ dashboardId: string; workspaceId?: string }>) {
  const personal = useMyDashboard(workspaceId ? '' : dashboardId);
  const workspace = useWorkspaceDashboard(
    workspaceId ?? '',
    workspaceId ? dashboardId : ''
  );
  const dashboard = workspaceId ? workspace.data : personal.data;
  const isLoading = workspaceId ? workspace.isLoading : personal.isLoading;
  const { data: sources = [] } = useDashboardSources(dashboardId, workspaceId);
  const addSource = useAddDashboardSource(dashboardId, workspaceId);
  const deleteSource = useDeleteDashboardSource(dashboardId, workspaceId);
  const runAnalysis = useRunDashboardAnalysis(dashboardId, workspaceId);
  const saveDefinition = useSaveDashboardDefinition(dashboardId, workspaceId);
  const restoreRevision = useRestoreDashboardRevision(dashboardId, workspaceId);
  const renderDashboard = useRenderDashboard(dashboardId, workspaceId);

  const [definition, setDefinition] = useState<DashboardDefinition>();
  const [activePageId, setActivePageId] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [sourceOpen, setSourceOpen] = useState(false);
  const [visualOpen, setVisualOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileSourceId, setProfileSourceId] = useState<string>();
  const [prepareSourceId, setPrepareSourceId] = useState<string>();
  const [modelOpen, setModelOpen] = useState(false);
  const [refreshOpen, setRefreshOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [infographicOpen, setInfographicOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [inspectorWidth, setInspectorWidth] = useState(420);
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const undoStack = useRef<DashboardDefinition[]>([]);
  const redoStack = useRef<DashboardDefinition[]>([]);
  const currentRef = useRef<DashboardDefinition | undefined>(undefined);
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const savedWidth = Number(
        globalThis.localStorage?.getItem('datalab-studio-inspector-width')
      );
      if (Number.isFinite(savedWidth) && savedWidth >= 320 && savedWidth <= 640)
        setInspectorWidth(savedWidth);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }, []);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(
        'datalab-studio-inspector-width',
        String(inspectorWidth)
      );
    } catch {
      // The in-memory width remains usable when persistence is unavailable.
    }
  }, [inspectorWidth]);

  useEffect(() => {
    if (dashboard && !definition) {
      const normalized = normalizeDefinition(dashboard.definition);
      setDefinition(normalized);
      setActivePageId(normalized.pages[0].id);
      currentRef.current = normalized;
    }
  }, [dashboard, definition]);
  useEffect(() => {
    currentRef.current = definition;
  }, [definition]);
  const change = (updater: (draft: DashboardDefinition) => void) => {
    if (!definition) return;
    undoStack.current.push(structuredClone(definition));
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
    const next = structuredClone(definition);
    updater(next);
    setDefinition(next);
    setDirty(true);
  };
  const undo = () => {
    const previous = undoStack.current.pop();
    if (!previous || !definition) return;
    redoStack.current.push(structuredClone(definition));
    setDefinition(previous);
    setDirty(true);
  };
  const redo = () => {
    const next = redoStack.current.pop();
    if (!next || !definition) return;
    undoStack.current.push(structuredClone(definition));
    setDefinition(next);
    setDirty(true);
  };
  const save = async (automatic = false) => {
    if (!definition) return;
    const snapshot = structuredClone(definition);
    await saveDefinition.mutateAsync({
      definition: snapshot,
      note: automatic ? 'Studio autosave' : 'Saved from Dashboard Studio',
    });
    if (JSON.stringify(currentRef.current) === JSON.stringify(snapshot))
      setDirty(false);
  };
  useEffect(() => {
    if (!dirty || !definition) return;
    const timeout = globalThis.setTimeout(
      () => void save(true).catch(() => undefined),
      12000
    );
    return () => globalThis.clearTimeout(timeout);
    // Save is intentionally triggered from the latest definition snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, definition]);

  const activePage =
    definition?.pages.find((page) => page.id === activePageId) ??
    definition?.pages[0];
  const selected = activePage?.widgets.find(
    (widget) => widget.id === selectedId
  );
  const selectedSource = sources.find(
    (source) => source.id === selected?.source_id
  );
  const updateWidget = (patch: Partial<DashboardWidget>) =>
    change((draft) => {
      const page = draft.pages.find((item) => item.id === activePage?.id);
      if (page)
        page.widgets = page.widgets.map((widget) =>
          widget.id === selectedId ? { ...widget, ...patch } : widget
        );
    });
  const updateQuery = (patch: Partial<DashboardQuery>) =>
    selected &&
    updateWidget({
      query: {
        dimensions: [],
        measures: [],
        limit: 250,
        ...selected.query,
        ...patch,
      },
    });
  const addWidget = (type: DashboardWidgetType) => {
    const id = newId();
    const source = sources.find((item) => item.status === 'ready');
    const isDecorative = ['text', 'image', 'shape'].includes(type);
    const widget: DashboardWidget = {
      id,
      type,
      title: visualTypes.find((item) => item.value === type)?.label ?? 'Visual',
      source_id: isDecorative ? undefined : source?.id,
      query: isDecorative
        ? undefined
        : {
            dimensions: [],
            measures: [{ operation: 'count', label: 'Records' }],
            filters: [],
            limit: 250,
          },
      text:
        type === 'text'
          ? 'Explain the insight, methodology or recommended action here.'
          : undefined,
      config: {
        showGrid: true,
        showLegend: true,
        numberFormat: 'standard',
        decimals: 0,
        target: type === 'gauge' ? 100 : undefined,
      },
      layout: {
        width: type === 'kpi' ? 4 : type === 'text' ? 12 : 6,
        height: type === 'kpi' ? 240 : type === 'text' ? 220 : 360,
      },
    };
    change((draft) => {
      (
        draft.pages.find((page) => page.id === activePage?.id) ?? draft.pages[0]
      ).widgets.push(widget);
    });
    setSelectedId(id);
    setVisualOpen(false);
  };
  const removeWidget = () => {
    change((draft) => {
      const page = draft.pages.find((item) => item.id === activePage?.id);
      if (page)
        page.widgets = page.widgets.filter(
          (widget) => widget.id !== selectedId
        );
    });
    setSelectedId(undefined);
  };
  const duplicateWidget = () => {
    if (!selected) return;
    const copy = structuredClone(selected);
    copy.id = newId();
    copy.title = `${copy.title} copy`;
    change((draft) => {
      draft.pages
        .find((item) => item.id === activePage?.id)
        ?.widgets.push(copy);
    });
    setSelectedId(copy.id);
  };
  const moveWidget = (direction: -1 | 1) =>
    change((draft) => {
      const widgets = draft.pages.find(
        (item) => item.id === activePage?.id
      )?.widgets;
      if (!widgets) return;
      const index = widgets.findIndex((widget) => widget.id === selectedId);
      const target = index + direction;
      if (index >= 0 && target >= 0 && target < widgets.length)
        [widgets[index], widgets[target]] = [widgets[target], widgets[index]];
    });
  const run = async () => {
    if (!selected?.source_id || !selected.query) return;
    const data = await runAnalysis.mutateAsync({
      sourceId: selected.source_id,
      query: selected.query,
    });
    const columns = data.columns.map((column) => column.name);
    updateWidget({
      data,
      config: {
        ...selected.config,
        x: selected.config?.x ?? columns[0],
        y: selected.config?.y ?? columns[1] ?? columns[0],
      },
    });
  };
  const hydrateDashboard = async () => {
    if (!definition) return;
    const execution = await renderDashboard.mutateAsync({ definition });
    setDefinition((current) => {
      if (!current) return current;
      const next = structuredClone(current);
      for (const page of next.pages)
        for (const widget of page.widgets)
          if (execution.results[widget.id])
            widget.data = execution.results[widget.id];
      return next;
    });
  };
  useEffect(() => {
    if (!definition || !sources.length || hydratedRef.current) return;
    hydratedRef.current = true;
    void hydrateDashboard().catch(() => undefined);
    // Hydrate once when the authored definition and sources are available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definition, sources.length]);
  const addPage = () => {
    const id = newId();
    change((draft) =>
      draft.pages.push({
        id,
        title: `Page ${draft.pages.length + 1}`,
        widgets: [],
      })
    );
    setActivePageId(id);
    setSelectedId(undefined);
  };
  const deletePage = () => {
    if (!definition || definition.pages.length === 1) return;
    change((draft) => {
      draft.pages = draft.pages.filter((page) => page.id !== activePage?.id);
    });
    const next = definition.pages.find((page) => page.id !== activePage?.id);
    setActivePageId(next?.id);
    setSelectedId(undefined);
  };
  const restore = async (revisionId: string) => {
    const result = await restoreRevision.mutateAsync(revisionId);
    const restored = normalizeDefinition(result.definition);
    setDefinition(restored);
    setActivePageId(restored.pages[0].id);
    setSelectedId(undefined);
    setHistoryOpen(false);
    setDirty(false);
  };
  const infographic = () => selected && setInfographicOpen(true);
  const back = workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards/${dashboardId}`
    : `/app/my-dashboards/${dashboardId}`;

  if (isLoading || !dashboard || !definition)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  const studioGridStyle = preview
    ? undefined
    : ({
        '--studio-left-width': leftOpen ? '270px' : '48px',
        '--studio-inspector-width': rightOpen ? `${inspectorWidth}px` : '48px',
      } as CSSProperties);

  return (
    <div className="-m-4 min-h-screen bg-muted/30 lg:-m-6">
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 border-b bg-background px-4 py-2.5 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link to={back}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-semibold">
                {dashboard.title}
              </h1>
              <Badge variant="secondary">Studio</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {dirty
                ? 'Unsaved changes · autosaves in a few seconds'
                : 'All changes saved'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!undoStack.current.length}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!redoStack.current.length}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant={preview ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => {
              const next = !preview;
              setPreview(next);
              if (next) void hydrateDashboard().catch(() => undefined);
            }}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            {preview ? 'Exit preview' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="mr-1.5 h-4 w-4" />
            History
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModelOpen(true)}
          >
            <Network className="mr-1.5 h-4 w-4" />
            <span className="hidden 2xl:inline">Model</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshOpen(true)}
          >
            <RefreshCw className="mr-1.5 h-4 w-4" />
            <span className="hidden 2xl:inline">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlertsOpen(true)}
          >
            <Bell className="mr-1.5 h-4 w-4" />
            <span className="hidden 2xl:inline">Alerts</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommentsOpen(true)}
          >
            <MessageSquare className="mr-1.5 h-4 w-4" />
            <span className="hidden 2xl:inline">Review</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="mr-1.5 h-4 w-4" />
            Share
          </Button>
          <Button
            size="sm"
            onClick={() => void save(false).catch(() => undefined)}
            disabled={!dirty || saveDefinition.isPending}
          >
            {saveDefinition.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </header>

      {!preview && (
        <div className="flex items-center gap-1 border-b bg-background px-4 py-2">
          <div className="flex flex-1 flex-wrap gap-1">
            {definition.pages.map((page) => (
              <Button
                key={page.id}
                variant={page.id === activePage?.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActivePageId(page.id);
                  setSelectedId(undefined);
                }}
              >
                {page.title}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={addPage}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Page
            </Button>
          </div>
          <Select
            value={definition.theme?.preset}
            onValueChange={(preset) =>
              change((draft) => {
                draft.theme = {
                  ...draft.theme,
                  preset: preset as ThemePreset,
                };
              })
            }
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="datalab">Datalab</SelectItem>
              <SelectItem value="light">Clean light</SelectItem>
              <SelectItem value="soft">Soft canvas</SelectItem>
              <SelectItem value="contrast">High contrast</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftOpen((value) => !value)}
          >
            {leftOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightOpen((value) => !value)}
          >
            {rightOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      <div
        className={`grid min-h-[calc(100vh-108px)] ${
          preview
            ? 'grid-cols-1'
            : 'grid-cols-1 xl:grid-cols-[var(--studio-left-width)_minmax(0,1fr)_var(--studio-inspector-width)]'
        }`}
        style={studioGridStyle}
      >
        {!preview &&
          (leftOpen ? (
            <DataPanel
              workspaceId={workspaceId}
              sources={sources}
              sourceOpen={sourceOpen}
              setSourceOpen={setSourceOpen}
              addSource={addSource}
              deleteSource={deleteSource}
              setProfileSourceId={setProfileSourceId}
              setPrepareSourceId={setPrepareSourceId}
            />
          ) : (
            <aside className="border-r bg-background pt-4 text-center">
              <Database className="mx-auto h-4 w-4 text-muted-foreground" />
            </aside>
          ))}
        <main className="min-w-0 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-[1800px]">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                {!preview ? (
                  <Input
                    value={activePage?.title ?? ''}
                    onChange={(event) =>
                      change((draft) => {
                        const page = draft.pages.find(
                          (item) => item.id === activePage?.id
                        );
                        if (page) page.title = event.target.value;
                      })
                    }
                    className="h-9 max-w-xs border-transparent px-1 text-lg font-semibold hover:border-input focus:border-input"
                  />
                ) : (
                  <h2 className="text-xl font-semibold">{activePage?.title}</h2>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {preview
                    ? 'This is how viewers will experience this page.'
                    : 'Select a visual to configure it. Use Preview to test interactions.'}
                </p>
              </div>
              {!preview && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deletePage}
                    disabled={definition.pages.length === 1}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete page
                  </Button>
                  <Dialog open={visualOpen} onOpenChange={setVisualOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-1 h-4 w-4" />
                        Add visual
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Choose a visual</DialogTitle>
                      </DialogHeader>
                      <div className="grid max-h-[65vh] grid-cols-2 gap-3 overflow-auto p-1 sm:grid-cols-3 lg:grid-cols-4">
                        {visualTypes.map((item) => (
                          <button
                            type="button"
                            key={item.value}
                            onClick={() => addWidget(item.value)}
                            className="rounded-xl border p-4 text-left transition hover:border-primary hover:bg-primary/5"
                          >
                            <BarChart3 className="mb-3 h-5 w-5 text-primary" />
                            <span className="block text-sm font-semibold">
                              {item.label}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <DashboardRenderer
              definition={definition}
              activePageId={activePage?.id}
              onPageChange={setActivePageId}
              hidePageTabs
              selectedId={preview ? undefined : selectedId}
              onSelect={preview ? undefined : setSelectedId}
              loading={renderDashboard.isPending}
            />
            {!activePage?.widgets.length && (
              <button
                type="button"
                onClick={() => setVisualOpen(true)}
                className="mt-4 flex w-full flex-col items-center rounded-xl border-2 border-dashed p-20 text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <LayoutDashboard className="mb-3 h-10 w-10" />
                <span className="font-medium">Build this page</span>
                <span className="mt-1 text-xs">
                  Add a KPI, chart, table or narrative
                </span>
              </button>
            )}
          </div>
        </main>
        {!preview &&
          (rightOpen ? (
            <VisualPanel
              dashboardId={dashboardId}
              workspaceId={workspaceId}
              inspectorWidth={inspectorWidth}
              setInspectorWidth={setInspectorWidth}
              selected={selected}
              source={selectedSource}
              sources={sources}
              updateWidget={updateWidget}
              updateQuery={updateQuery}
              run={run}
              analysing={runAnalysis.isPending}
              removeWidget={removeWidget}
              duplicateWidget={duplicateWidget}
              moveWidget={moveWidget}
              infographic={infographic}
            />
          ) : (
            <aside className="border-l bg-background pt-4 text-center">
              <Settings2 className="mx-auto h-4 w-4 text-muted-foreground" />
            </aside>
          ))}
      </div>
      <SourceProfileDialog
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        source={sources.find((item) => item.id === profileSourceId)}
        open={Boolean(profileSourceId)}
        onOpenChange={(open) => !open && setProfileSourceId(undefined)}
      />
      <SourcePreparationDialog
        open={Boolean(prepareSourceId)}
        onOpenChange={(open) => !open && setPrepareSourceId(undefined)}
        source={sources.find((item) => item.id === prepareSourceId)}
        dashboardId={dashboardId}
        workspaceId={workspaceId}
      />
      <ShareDialog
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
      <HistoryDialog
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        restore={restore}
      />
      <DataModelDialog
        open={modelOpen}
        onOpenChange={setModelOpen}
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        sources={sources}
        initialModel={dashboard.semantic_model}
      />
      <RefreshDialog
        open={refreshOpen}
        onOpenChange={setRefreshOpen}
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        initialFrequency={dashboard.refresh_policy?.frequency}
      />
      <AlertsDialog
        open={alertsOpen}
        onOpenChange={setAlertsOpen}
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        definition={definition}
      />
      <CommentsDialog
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        pageId={activePage?.id}
        widgetId={selected?.id}
      />
      <InfographicBuilder
        open={infographicOpen}
        onOpenChange={setInfographicOpen}
        dashboardId={dashboardId}
        workspaceId={workspaceId}
        widget={selected}
      />
    </div>
  );
}

function DataPanel({
  workspaceId,
  sources,
  sourceOpen,
  setSourceOpen,
  addSource,
  deleteSource,
  setProfileSourceId,
  setPrepareSourceId,
}: Readonly<{
  workspaceId?: string;
  sources: DashboardDataSource[];
  sourceOpen: boolean;
  setSourceOpen: (value: boolean) => void;
  addSource: ReturnType<typeof useAddDashboardSource>;
  deleteSource: ReturnType<typeof useDeleteDashboardSource>;
  setProfileSourceId: (id: string) => void;
  setPrepareSourceId: (id: string) => void;
}>) {
  return (
    <aside className="max-h-[42vh] overflow-y-auto border-b bg-background p-4 xl:max-h-none xl:border-r xl:border-b-0">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Data sources</h2>
          <p className="text-[11px] text-muted-foreground">
            Profile and prepare your data
          </p>
        </div>
        <SourceDialog
          workspaceId={workspaceId}
          open={sourceOpen}
          setOpen={setSourceOpen}
          onAdd={(input) =>
            addSource.mutateAsync(input).then(() => setSourceOpen(false))
          }
        />
      </div>
      <div className="space-y-2">
        {sources.map((source) => (
          <div key={source.id} className="group rounded-xl border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${source.status === 'ready' ? 'bg-primary' : source.status === 'failed' ? 'bg-destructive' : 'bg-amber-500'}`}
                  />
                  <p className="truncate text-sm font-medium">{source.name}</p>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {source.row_count.toLocaleString()} rows ·{' '}
                  {source.schema.length} fields
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 opacity-0 group-hover:opacity-100"
                onClick={() => deleteSource.mutate(source.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {source.last_error && (
              <p className="mt-2 line-clamp-2 text-[11px] text-destructive">
                {source.last_error}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {source.schema.slice(0, 4).map((field) => (
                <Badge
                  key={field.name}
                  variant="outline"
                  className="max-w-full truncate text-[10px]"
                >
                  {field.name}
                </Badge>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setProfileSourceId(source.id)}
              >
                <SlidersHorizontal className="mr-1 h-3 w-3" />
                Profile
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setPrepareSourceId(source.id)}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Prepare
              </Button>
            </div>
          </div>
        ))}
        {!sources.length && (
          <div className="rounded-xl border border-dashed p-6 text-center">
            <Database className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Connect a dataset, file or API to begin analysis.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function VisualPanel({
  dashboardId,
  workspaceId,
  inspectorWidth,
  setInspectorWidth,
  selected,
  source,
  sources,
  updateWidget,
  updateQuery,
  run,
  analysing,
  removeWidget,
  duplicateWidget,
  moveWidget,
  infographic,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  inspectorWidth: number;
  setInspectorWidth: (width: number) => void;
  selected?: DashboardWidget;
  source?: DashboardDataSource;
  sources: DashboardDataSource[];
  updateWidget: (patch: Partial<DashboardWidget>) => void;
  updateQuery: (patch: Partial<DashboardQuery>) => void;
  run: () => Promise<void>;
  analysing: boolean;
  removeWidget: () => void;
  duplicateWidget: () => void;
  moveWidget: (direction: -1 | 1) => void;
  infographic: () => void;
}>) {
  const resizeStart = useRef<{ x: number; width: number } | null>(null);
  const resizeTo = (width: number) =>
    setInspectorWidth(Math.min(640, Math.max(320, width)));
  const resizeHandle = (
    <div
      role="separator"
      aria-label="Resize visual properties panel"
      aria-orientation="vertical"
      aria-valuemin={320}
      aria-valuemax={640}
      aria-valuenow={inspectorWidth}
      tabIndex={0}
      title="Drag to resize properties panel"
      className="absolute inset-y-0 -left-1.5 z-20 hidden w-3 cursor-col-resize touch-none items-center justify-center xl:flex"
      onPointerDown={(event) => {
        resizeStart.current = { x: event.clientX, width: inspectorWidth };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!resizeStart.current) return;
        resizeTo(
          resizeStart.current.width + resizeStart.current.x - event.clientX
        );
      }}
      onPointerUp={(event) => {
        resizeStart.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        resizeStart.current = null;
      }}
      onDoubleClick={() => resizeTo(420)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          resizeTo(inspectorWidth + 24);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          resizeTo(inspectorWidth - 24);
        }
      }}
    >
      <span className="h-12 w-1 rounded-full bg-border transition-colors hover:bg-primary focus:bg-primary" />
    </div>
  );
  if (!selected)
    return (
      <aside className="relative border-l bg-background p-4">
        {resizeHandle}
        <h2 className="text-sm font-semibold">Properties</h2>
        <div className="mt-4 rounded-xl border border-dashed p-6 text-center">
          <Settings2 className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Select a visual to edit its data, analysis, layout and formatting.
          </p>
        </div>
      </aside>
    );
  const query = selected.query ?? {
    dimensions: [],
    measures: [],
    filters: [],
    limit: 250,
  };
  const calculatedMeasureFields = (query.calculated_fields ?? []).filter(
    (field) => field.name.trim().length > 0
  );
  const includedSourceIds = [
    selected.source_id,
    ...(query.source_ids ?? []),
  ].filter(Boolean) as string[];
  const analysisFields =
    includedSourceIds.length > 1
      ? sources
          .filter((item) => includedSourceIds.includes(item.id))
          .flatMap((item) =>
            item.schema.map((field) => ({
              ...field,
              name: `${item.id}::${field.name}`,
            }))
          )
      : (source?.schema ?? []);
  const analysisSource = source
    ? { ...source, schema: analysisFields }
    : undefined;
  const setMeasure = (
    index: number,
    patch: Partial<DashboardQuery['measures'][number]>
  ) =>
    updateQuery({
      measures: query.measures.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    });
  return (
    <aside className="relative min-w-0 border-t bg-background xl:border-t-0 xl:border-l">
      {resizeHandle}
      <div className="flex items-start justify-between gap-2 border-b p-4">
        <div>
          <h2 className="text-sm font-semibold">Visual properties</h2>
          <p className="text-[11px] text-muted-foreground">
            {visualTypes.find((item) => item.value === selected.type)?.label}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Select
            value={String(inspectorWidth)}
            onValueChange={(width) => resizeTo(Number(width))}
          >
            <SelectTrigger
              className="h-8 w-[118px]"
              aria-label="Properties panel width"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="320">Compact</SelectItem>
              <SelectItem value="420">Comfortable</SelectItem>
              <SelectItem value="560">Wide</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="icon"
            variant="ghost"
            onClick={removeWidget}
            title="Delete visual"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="max-h-[calc(100vh-175px)] space-y-4 overflow-y-auto p-4">
        <Field label="Title">
          <Input
            value={selected.title}
            onChange={(event) => updateWidget({ title: event.target.value })}
          />
        </Field>
        <Field label="Description">
          <Input
            value={selected.config?.description ?? ''}
            onChange={(event) =>
              updateWidget({
                config: { ...selected.config, description: event.target.value },
              })
            }
            placeholder="Optional context"
          />
        </Field>
        <Field label="Visual type">
          <Select
            value={selected.type}
            onValueChange={(type) =>
              updateWidget({ type: type as DashboardWidgetType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visualTypes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {selected.type === 'text' ? (
          <Field label="Narrative">
            <Textarea
              rows={10}
              value={selected.text ?? ''}
              onChange={(event) => updateWidget({ text: event.target.value })}
            />
          </Field>
        ) : selected.type === 'image' ? (
          <>
            <Field label="Image URL">
              <Input
                type="url"
                value={selected.config?.imageUrl ?? ''}
                onChange={(event) =>
                  updateWidget({
                    config: {
                      ...selected.config,
                      imageUrl: event.target.value,
                    },
                  })
                }
                placeholder="https://example.org/image.png"
              />
            </Field>
            <Field label="Accessible description">
              <Input
                value={selected.config?.imageAlt ?? ''}
                onChange={(event) =>
                  updateWidget({
                    config: {
                      ...selected.config,
                      imageAlt: event.target.value,
                    },
                  })
                }
              />
            </Field>
          </>
        ) : selected.type === 'shape' ? (
          <p className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
            Shapes inherit the dashboard accent colour and can be used to group
            or emphasise content.
          </p>
        ) : (
          <>
            <div className="border-t pt-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Data & analysis
              </h3>
              <Field label="Source">
                <Select
                  value={selected.source_id}
                  onValueChange={(source_id) =>
                    updateWidget({ source_id, data: undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources
                      .filter((item) => item.status === 'ready')
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Related sources">
                <Picker
                  multi
                  items={sources
                    .filter(
                      (item) =>
                        item.status === 'ready' &&
                        item.id !== selected.source_id
                    )
                    .map((item) => ({ value: item.id, label: item.name }))}
                  value={query.source_ids ?? []}
                  onChange={(source_ids) =>
                    updateQuery({ source_ids: [...source_ids] })
                  }
                  placeholder="Use the data model"
                  emptyMessage="No other ready sources"
                />
              </Field>
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Group by</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7"
                    onClick={() =>
                      updateQuery({
                        dimensions: [
                          ...query.dimensions,
                          analysisFields.find(
                            (field) => !query.dimensions.includes(field.name)
                          )?.name ?? '',
                        ],
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                {query.dimensions.map((dimension, index) => (
                  <div key={`${index}-${dimension}`} className="flex gap-2">
                    <Select
                      value={dimension}
                      onValueChange={(value) =>
                        updateQuery({
                          dimensions: query.dimensions.map((item, itemIndex) =>
                            itemIndex === index ? value : item
                          ),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose field" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisFields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        updateQuery({
                          dimensions: query.dimensions.filter(
                            (_, itemIndex) => itemIndex !== index
                          ),
                        })
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {!query.dimensions.length && (
                  <p className="text-[11px] text-muted-foreground">
                    No grouping — results will be aggregated into one row.
                  </p>
                )}
              </div>
              {!!analysisFields.some((field) => field.type === 'date') && (
                <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border p-2">
                  <Field label="Date grouping">
                    <Select
                      value={query.dimension_specs?.[0]?.column ?? '__none'}
                      onValueChange={(column) =>
                        updateQuery({
                          dimensions:
                            column === '__none'
                              ? query.dimensions
                              : query.dimensions.filter(
                                  (dimension) => dimension !== column
                                ),
                          dimension_specs:
                            column === '__none'
                              ? []
                              : [
                                  {
                                    column,
                                    label: `${column} (${query.dimension_specs?.[0]?.date_grain ?? 'month'})`,
                                    date_grain:
                                      query.dimension_specs?.[0]?.date_grain ??
                                      'month',
                                  },
                                ],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">None</SelectItem>
                        {analysisFields
                          .filter((field) => field.type === 'date')
                          .map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Period">
                    <Select
                      value={query.dimension_specs?.[0]?.date_grain ?? 'month'}
                      disabled={!query.dimension_specs?.length}
                      onValueChange={(date_grain) => {
                        const current = query.dimension_specs?.[0];
                        if (current)
                          updateQuery({
                            dimension_specs: [
                              {
                                ...current,
                                date_grain: date_grain as
                                  | 'year'
                                  | 'quarter'
                                  | 'month'
                                  | 'week'
                                  | 'day',
                                label: `${current.column} (${date_grain})`,
                              },
                            ],
                          });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['year', 'quarter', 'month', 'week', 'day'].map(
                          (grain) => (
                            <SelectItem key={grain} value={grain}>
                              {grain}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}
              <CalculatedFields
                comfortable={inspectorWidth >= 400}
                query={query}
                source={analysisSource}
                updateQuery={updateQuery}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Measures</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7"
                    onClick={() =>
                      updateQuery({
                        measures: [
                          ...query.measures,
                          {
                            operation: 'count',
                            label: `Measure ${query.measures.length + 1}`,
                          },
                        ],
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                {query.measures.map((measure, index) => (
                  <div
                    key={`measure-${index}`}
                    className="space-y-2 rounded-lg border p-2"
                  >
                    <div className="flex gap-2">
                      <Select
                        value={measure.column ?? '__rows'}
                        onValueChange={(value) =>
                          setMeasure(index, {
                            column: value === '__rows' ? undefined : value,
                            ...(value === '__rows'
                              ? { operation: 'count' as const }
                              : {}),
                          })
                        }
                      >
                        <SelectTrigger className="min-w-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__rows">Rows</SelectItem>
                          {!!analysisFields.length && (
                            <>
                              <SelectSeparator />
                              <SelectGroup>
                                <SelectLabel>Dataset fields</SelectLabel>
                                {analysisFields.map((field) => (
                                  <SelectItem
                                    key={field.name}
                                    value={field.name}
                                  >
                                    {field.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </>
                          )}
                          {!!calculatedMeasureFields.length && (
                            <>
                              <SelectSeparator />
                              <SelectGroup>
                                <SelectLabel>Calculated fields</SelectLabel>
                                {calculatedMeasureFields.map(
                                  (field, fieldIndex) => (
                                    <SelectItem
                                      key={`calculated-measure-${fieldIndex}`}
                                      value={field.name.trim()}
                                    >
                                      ƒ {field.name.trim()}
                                    </SelectItem>
                                  )
                                )}
                              </SelectGroup>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <Select
                        value={measure.operation}
                        onValueChange={(operation) =>
                          setMeasure(index, {
                            operation:
                              operation as DashboardQuery['measures'][number]['operation'],
                          })
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operations.map((operation) => (
                            <SelectItem key={operation} value={operation}>
                              {operation.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          updateQuery({
                            measures: query.measures.filter(
                              (_, itemIndex) => itemIndex !== index
                            ),
                          })
                        }
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Input
                      value={measure.label ?? ''}
                      onChange={(event) =>
                        setMeasure(index, { label: event.target.value })
                      }
                      placeholder="Display label"
                    />
                  </div>
                ))}
                {!!calculatedMeasureFields.length && (
                  <p className="text-[11px] text-muted-foreground">
                    Calculated fields are available in the field selector above
                    and are marked with ƒ.
                  </p>
                )}
              </div>
              {!!query.measures.length && (
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border p-2">
                  <Field label="Table calculation">
                    <Select
                      value={
                        query.table_calculations?.[0]?.operation ?? '__none'
                      }
                      onValueChange={(operation) =>
                        updateQuery({
                          table_calculations:
                            operation === '__none'
                              ? []
                              : [
                                  {
                                    column:
                                      query.measures[0].label ||
                                      `${query.measures[0].operation}_${query.measures[0].column ?? 'rows'}`,
                                    operation: operation as
                                      | 'running_total'
                                      | 'rank'
                                      | 'percent_of_total'
                                      | 'moving_average',
                                    label: `${operation.replaceAll('_', ' ')} · ${query.measures[0].label ?? 'measure'}`,
                                    window: 3,
                                  },
                                ],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">None</SelectItem>
                        <SelectItem value="running_total">
                          Running total
                        </SelectItem>
                        <SelectItem value="rank">Rank</SelectItem>
                        <SelectItem value="percent_of_total">
                          Percent of total
                        </SelectItem>
                        <SelectItem value="moving_average">
                          Moving average
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Based on">
                    <Select
                      value={
                        query.table_calculations?.[0]?.column ??
                        query.measures[0].label ??
                        ''
                      }
                      disabled={!query.table_calculations?.length}
                      onValueChange={(column) => {
                        const current = query.table_calculations?.[0];
                        if (current)
                          updateQuery({
                            table_calculations: [{ ...current, column }],
                          });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {query.measures.map((measure, index) => {
                          const value =
                            measure.label ||
                            `${measure.operation}_${measure.column ?? 'rows'}`;
                          return (
                            <SelectItem key={`${value}-${index}`} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}
              <Filters
                query={query}
                source={analysisSource}
                updateQuery={updateQuery}
              />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Sort by">
                  <Input
                    value={query.sort?.column ?? ''}
                    onChange={(event) =>
                      updateQuery({
                        sort: event.target.value
                          ? {
                              column: event.target.value,
                              direction: query.sort?.direction ?? 'desc',
                            }
                          : undefined,
                      })
                    }
                    placeholder="Result column"
                  />
                </Field>
                <Field label="Direction">
                  <Select
                    value={query.sort?.direction ?? 'desc'}
                    onValueChange={(direction) =>
                      updateQuery({
                        sort: query.sort
                          ? {
                              ...query.sort,
                              direction: direction as 'asc' | 'desc',
                            }
                          : undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {selected.type === 'map' && (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Latitude field">
                    <Select
                      value={selected.config?.latitude}
                      onValueChange={(latitude) =>
                        updateWidget({
                          config: { ...selected.config, latitude },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Latitude" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisFields
                          .filter((field) => field.type === 'number')
                          .map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Longitude field">
                    <Select
                      value={selected.config?.longitude}
                      onValueChange={(longitude) =>
                        updateWidget({
                          config: { ...selected.config, longitude },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Longitude" />
                      </SelectTrigger>
                      <SelectContent>
                        {analysisFields
                          .filter((field) => field.type === 'number')
                          .map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}
              {selected.type === 'gauge' && (
                <Field label="Target value">
                  <Input
                    type="number"
                    value={selected.config?.target ?? 100}
                    onChange={(event) =>
                      updateWidget({
                        config: {
                          ...selected.config,
                          target: Number(event.target.value),
                        },
                      })
                    }
                  />
                </Field>
              )}
              <Button
                className="mt-3 w-full"
                onClick={() => void run().catch(() => undefined)}
                disabled={!selected.source_id || analysing}
              >
                {analysing ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="mr-1.5 h-4 w-4" />
                )}
                Run analysis
              </Button>
              {selected.source_id && selected.query && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(['csv', 'xlsx'] as const).map((format) => (
                    <Button
                      key={format}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void exportDashboardAnalysis(
                          dashboardId,
                          selected.source_id!,
                          selected.query!,
                          format,
                          workspaceId
                        )
                      }
                    >
                      <Download className="mr-1.5 h-4 w-4" />
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div className="border-t pt-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Layout & format
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Width">
              <Select
                value={String(selected.layout?.width ?? 6)}
                onValueChange={(width) =>
                  updateWidget({
                    layout: {
                      width: Number(width) as WidgetWidth,
                      height: selected.layout?.height ?? 360,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 6, 8, 9, 12].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value}/12
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Height">
              <Select
                value={String(selected.layout?.height ?? 360)}
                onValueChange={(height) =>
                  updateWidget({
                    layout: {
                      width: selected.layout?.width ?? 6,
                      height: Number(height),
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[220, 300, 360, 440, 520, 640].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Toggle
            label="Show legend"
            checked={selected.config?.showLegend !== false}
            onChange={(showLegend) =>
              updateWidget({ config: { ...selected.config, showLegend } })
            }
          />
          <Toggle
            label="Show grid"
            checked={selected.config?.showGrid !== false}
            onChange={(showGrid) =>
              updateWidget({ config: { ...selected.config, showGrid } })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Field label="Number">
              <Select
                value={selected.config?.numberFormat ?? 'standard'}
                onValueChange={(numberFormat) =>
                  updateWidget({
                    config: {
                      ...selected.config,
                      numberFormat: numberFormat as NumberFormat,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Decimals">
              <Select
                value={String(selected.config?.decimals ?? 0)}
                onValueChange={(decimals) =>
                  updateWidget({
                    config: { ...selected.config, decimals: Number(decimals) },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1 border-t pt-4">
          <Button
            size="icon"
            variant="outline"
            onClick={() => moveWidget(-1)}
            title="Move earlier"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => moveWidget(1)}
            title="Move later"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={duplicateWidget}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={infographic}
            title="Create infographic"
          >
            <ImageDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={removeWidget}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function CalculatedFields({
  comfortable,
  query,
  source,
  updateQuery,
}: Readonly<{
  comfortable: boolean;
  query: DashboardQuery;
  source?: DashboardDataSource;
  updateQuery: (patch: Partial<DashboardQuery>) => void;
}>) {
  type CalculatedField = NonNullable<
    DashboardQuery['calculated_fields']
  >[number];
  const fields = query.calculated_fields ?? [];
  const numericFields = source?.schema.filter((item) => item.type === 'number');
  const update = (index: number, patch: Partial<CalculatedField>) => {
    const previousName = fields[index]?.name;
    const nextFields = fields.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    );
    updateQuery({
      calculated_fields: nextFields,
      ...(patch.name !== undefined && previousName !== patch.name
        ? {
            measures: query.measures.map((measure) =>
              measure.column === previousName
                ? { ...measure, column: patch.name }
                : measure
            ),
          }
        : {}),
    });
  };
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label>Calculated fields</Label>
          <p className="text-[10px] text-muted-foreground">
            Create a numeric result for this visual.
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7"
          onClick={() =>
            updateQuery({
              calculated_fields: [
                ...fields,
                {
                  name: `Calculation ${fields.length + 1}`,
                  left: numericFields?.[0]?.name ?? '',
                  operator: 'add',
                  right_value: 0,
                },
              ],
            })
          }
        >
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>
      {fields.map((field, index) => (
        <div
          key={`calculated-field-${index}`}
          className="space-y-3 rounded-xl border bg-muted/20 p-3"
        >
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Label className="text-[11px]">Calculated field name</Label>
              <Input
                value={field.name}
                onChange={(event) =>
                  update(index, { name: event.target.value })
                }
                placeholder="e.g. Budget utilization"
              />
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                updateQuery({
                  calculated_fields: fields.filter(
                    (_, itemIndex) => itemIndex !== index
                  ),
                })
              }
              title="Remove calculated field"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px]">
              Formula (optional advanced mode)
            </Label>
            <Input
              value={field.expression ?? ''}
              onChange={(event) =>
                update(index, { expression: event.target.value || undefined })
              }
              placeholder="e.g. ([spent] / [allocated]) * 100"
            />
            <p className="text-[10px] text-muted-foreground">
              Reference columns in square brackets. Leave blank to use the
              guided calculation below.
            </p>
          </div>
          <div
            className={`grid gap-2 ${
              comfortable
                ? 'grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)]'
                : 'grid-cols-1'
            }`}
          >
            <div className="min-w-0 space-y-1.5">
              <Label className="text-[11px]">First field</Label>
              <Select
                value={field.left}
                onValueChange={(left) => update(index, { left })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose field" />
                </SelectTrigger>
                <SelectContent>
                  {numericFields?.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-[11px]">Operation</Label>
              <Select
                value={field.operator}
                onValueChange={(operator) =>
                  update(index, {
                    operator: operator as CalculatedField['operator'],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add (+)</SelectItem>
                  <SelectItem value="subtract">Subtract (−)</SelectItem>
                  <SelectItem value="multiply">Multiply (×)</SelectItem>
                  <SelectItem value="divide">Divide (÷)</SelectItem>
                  <SelectItem value="percent">Percent of</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-[11px]">Second value</Label>
              <Select
                value={field.right ?? '__constant'}
                onValueChange={(right) =>
                  update(index, {
                    right: right === '__constant' ? undefined : right,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__constant">Fixed number</SelectItem>
                  {numericFields?.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {!field.right && (
            <div className="space-y-1.5">
              <Label className="text-[11px]">Fixed number</Label>
              <Input
                type="number"
                value={field.right_value ?? 0}
                onChange={(event) =>
                  update(index, { right_value: Number(event.target.value) })
                }
                placeholder="Enter a number"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Filters({
  query,
  source,
  updateQuery,
}: Readonly<{
  query: DashboardQuery;
  source?: DashboardDataSource;
  updateQuery: (patch: Partial<DashboardQuery>) => void;
}>) {
  const filters = query.filters ?? [];
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label>Filters</Label>
        <Button
          size="sm"
          variant="ghost"
          className="h-7"
          onClick={() =>
            updateQuery({
              filters: [
                ...filters,
                {
                  column: source?.schema[0]?.name ?? '',
                  operator: 'equals',
                  value: '',
                },
              ],
            })
          }
        >
          <Plus className="mr-1 h-3 w-3" />
          Add
        </Button>
      </div>
      {filters.map((filter, index) => (
        <div
          key={`${index}-${filter.column}`}
          className="space-y-2 rounded-lg border p-2"
        >
          <div className="flex gap-2">
            <Select
              value={filter.column}
              onValueChange={(column) =>
                updateQuery({
                  filters: filters.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, column } : item
                  ),
                })
              }
            >
              <SelectTrigger className="min-w-0">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                {source?.schema.map((field) => (
                  <SelectItem key={field.name} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                updateQuery({
                  filters: filters.filter(
                    (_, itemIndex) => itemIndex !== index
                  ),
                })
              }
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Select
            value={filter.operator}
            onValueChange={(operator) =>
              updateQuery({
                filters: filters.map((item, itemIndex) =>
                  itemIndex === index
                    ? {
                        ...item,
                        operator: operator as FilterOperator,
                      }
                    : item
                ),
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOperators.map((operator) => (
                <SelectItem key={operator} value={operator}>
                  {operator.replaceAll('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!['is_null', 'not_null'].includes(filter.operator) && (
            <Input
              value={
                Array.isArray(filter.value)
                  ? filter.value.join(',')
                  : String(filter.value)
              }
              onChange={(event) =>
                updateQuery({
                  filters: filters.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, value: event.target.value }
                      : item
                  ),
                })
              }
              placeholder={
                filter.operator === 'in' ? 'A, B, C' : 'Filter value'
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="mb-3 space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
function Toggle({
  label,
  checked,
  onChange,
}: Readonly<{
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}>) {
  return (
    <div className="flex items-center justify-between py-2">
      <Label className="text-xs font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SourceDialog({
  workspaceId,
  open,
  setOpen,
  onAdd,
}: Readonly<{
  workspaceId?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (input: FormData | Record<string, unknown>) => Promise<unknown>;
}>) {
  const {
    data: datasetOptions = [],
    isLoading: datasetsLoading,
    isError: datasetsError,
  } = useDashboardDatasetOptions(workspaceId);
  const scopedDatasets = datasetOptions.filter(
    (item) => item.scope !== 'public'
  );
  const publicDatasets = datasetOptions.filter(
    (item) => item.scope === 'public'
  );
  const [kind, setKind] = useState('file_upload');
  const [name, setName] = useState('');
  const [dataset, setDataset] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [recordsPath, setRecordsPath] = useState('');
  const [file, setFile] = useState<File>();
  const [submitting, setSubmitting] = useState(false);
  const reset = () => {
    setName('');
    setDataset('');
    setApiUrl('');
    setRecordsPath('');
    setFile(undefined);
  };
  const submit = async () => {
    setSubmitting(true);
    try {
      if (kind === 'file_upload') {
        const form = new FormData();
        form.append('name', name);
        form.append('kind', kind);
        if (file) form.append('file', file);
        await onAdd(form);
      } else
        await onAdd({
          name,
          kind,
          dataset: kind === 'datalab_dataset' ? dataset : undefined,
          api_url: kind === 'public_api' ? apiUrl : undefined,
          config: { records_path: recordsPath },
        });
      reset();
    } finally {
      setSubmitting(false);
    }
  };
  const ready = Boolean(
    name &&
    ((kind === 'file_upload' && file) ||
      (kind === 'datalab_dataset' && dataset) ||
      (kind === 'public_api' && apiUrl))
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'file_upload', label: 'File', icon: FileSpreadsheet },
              { id: 'datalab_dataset', label: 'Datalab', icon: Database },
              { id: 'public_api', label: 'API', icon: Globe2 },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setKind(option.id)}
                className={`rounded-xl border p-3 text-center text-xs ${kind === option.id ? 'border-primary bg-primary/5 text-primary' : ''}`}
              >
                <option.icon className="mx-auto mb-1 h-5 w-5" />
                {option.label}
              </button>
            ))}
          </div>
          <Field label="Source name">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Sales data"
            />
          </Field>
          {kind === 'file_upload' && (
            <Field label="CSV, TSV, Excel, JSON or Parquet">
              <Input
                type="file"
                accept=".csv,.tsv,.xlsx,.xls,.json,.parquet"
                onChange={(event) => setFile(event.target.files?.[0])}
              />
            </Field>
          )}
          {kind === 'datalab_dataset' && (
            <>
              <Field
                label={
                  workspaceId
                    ? 'Workspace and public Datalab datasets'
                    : 'Your and public Datalab datasets'
                }
              >
                <Select value={dataset} onValueChange={setDataset}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        datasetsLoading
                          ? 'Loading datasets…'
                          : 'Choose a dataset'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {scopedDatasets.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>
                          {workspaceId ? 'Current workspace' : 'My datasets'}
                        </SelectLabel>
                        {scopedDatasets.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {scopedDatasets.length > 0 && publicDatasets.length > 0 && (
                      <SelectSeparator />
                    )}
                    {publicDatasets.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>Approved public datasets</SelectLabel>
                        {publicDatasets.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
                {!datasetsLoading && datasetOptions.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No eligible datasets are available. Publish and approve a
                    dataset, or create one in this workspace.
                  </p>
                )}
                {datasetsError && (
                  <p className="text-xs text-destructive">
                    Dataset options could not be loaded. You may paste a valid
                    dataset ID below or retry this dialog.
                  </p>
                )}
              </Field>
              <Field label="Dataset ID (optional alternative)">
                <Input
                  value={dataset}
                  onChange={(event) => setDataset(event.target.value.trim())}
                  placeholder="Paste the dataset ID, not its slug or URL"
                />
              </Field>
            </>
          )}
          {kind === 'public_api' && (
            <>
              <Field label="Public HTTPS JSON URL">
                <Input
                  value={apiUrl}
                  onChange={(event) => setApiUrl(event.target.value)}
                  placeholder="https://api.example.org/data"
                />
              </Field>
              <Field label="Records path (optional)">
                <Input
                  value={recordsPath}
                  onChange={(event) => setRecordsPath(event.target.value)}
                  placeholder="results.items"
                />
              </Field>
            </>
          )}
          <Button
            className="w-full"
            onClick={() => void submit()}
            disabled={!ready || submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect and profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SourceProfileDialog({
  dashboardId,
  workspaceId,
  source,
  open,
  onOpenChange,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  source?: DashboardDataSource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const { data, isLoading } = useDashboardSourceProfile(
    dashboardId,
    source?.id,
    workspaceId
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{source?.name} · data profile</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          data && (
            <div>
              <div className="mb-4 grid grid-cols-3 gap-3">
                <Stat label="Rows" value={data.row_count} />
                <Stat label="Columns" value={data.column_count} />
                <Stat label="Duplicate rows" value={data.duplicate_rows} />
              </div>
              <div className="max-h-[55vh] overflow-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">Field</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-right">Missing</th>
                      <th className="p-2 text-right">Unique</th>
                      <th className="p-2 text-left">Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.columns.map((column) => (
                      <tr key={column.name} className="border-t">
                        <td className="p-2 font-medium">{column.name}</td>
                        <td className="p-2">
                          <Badge variant="outline">{column.type}</Badge>
                        </td>
                        <td className="p-2 text-right">
                          {column.missing_percent}%
                        </td>
                        <td className="p-2 text-right">
                          {(column.unique_count ?? 0).toLocaleString()}
                        </td>
                        <td className="max-w-xs truncate p-2 text-muted-foreground">
                          {column.sample_values.map(String).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
function Stat({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}

function ShareDialog({
  dashboardId,
  workspaceId,
  open,
  onOpenChange,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}>) {
  const { data: links = [] } = useDashboardShareLinks(dashboardId, workspaceId);
  const create = useCreateDashboardShare(dashboardId, workspaceId);
  const revoke = useRevokeDashboardShare(dashboardId, workspaceId);
  const [access, setAccess] = useState<'view' | 'interact'>('interact');
  const [password, setPassword] = useState('');
  const [expires, setExpires] = useState('');
  const make = async () => {
    const link = await create.mutateAsync({
      access,
      password: password || undefined,
      expires_at: expires ? new Date(expires).toISOString() : null,
    });
    const url = `${globalThis.location.origin}/shared-dashboards/${link.id}`;
    await globalThis.navigator.clipboard.writeText(url);
    toastUtils.success('Share link copied');
    setPassword('');
  };
  const copy = async (id: string) => {
    await globalThis.navigator.clipboard.writeText(
      `${globalThis.location.origin}/shared-dashboards/${id}`
    );
    toastUtils.success('Link copied');
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share dashboard</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Permission">
            <Select
              value={access}
              onValueChange={(value) => setAccess(value as 'view' | 'interact')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interact">View and interact</SelectItem>
                <SelectItem value="view">View only</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Password (optional)">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Field label="Expires (optional)">
            <Input
              type="datetime-local"
              value={expires}
              onChange={(event) => setExpires(event.target.value)}
            />
          </Field>
        </div>
        <Button onClick={() => void make()} disabled={create.isPending}>
          <Share2 className="mr-1.5 h-4 w-4" />
          Create and copy link
        </Button>
        <div className="mt-2 space-y-2 border-t pt-4">
          <h3 className="text-sm font-semibold">Active links</h3>
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {link.access === 'interact' ? 'Interactive' : 'View only'}{' '}
                  {link.password_protected && '· Password protected'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(link.created_at).toLocaleDateString()}
                  {link.expires_at
                    ? ` · Expires ${new Date(link.expires_at).toLocaleString()}`
                    : ''}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => void copy(link.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {link.is_active && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => revoke.mutate(link.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!links.length && (
            <p className="text-sm text-muted-foreground">No share links yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({
  dashboardId,
  workspaceId,
  open,
  onOpenChange,
  restore,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  restore: (id: string) => Promise<void>;
}>) {
  const { data: revisions = [], isLoading } = useDashboardRevisions(
    dashboardId,
    workspaceId
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Version history</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-primary" />
        ) : (
          <div className="max-h-[60vh] space-y-2 overflow-auto">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {revision.note || 'Dashboard revision'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(revision.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void restore(revision.id)}
                >
                  Restore
                </Button>
              </div>
            ))}
            {!revisions.length && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                History will appear after the first save.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
