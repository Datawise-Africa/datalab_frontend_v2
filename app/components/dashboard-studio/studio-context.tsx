import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link } from 'react-router';
import { arrayMove } from '@dnd-kit/sortable';
import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useMyDashboard } from '~/features/my-dashboards';
import { useWorkspaceDashboard } from '~/features/workspaces';
import {
  useAddDashboardSource,
  useDashboardSources,
  useDeleteDashboardSource,
  useRenderDashboard,
  useRestoreDashboardRevision,
  useRunDashboardAnalysis,
  useSaveDashboardDefinition,
} from '~/features/dashboard-studio';
import { getVisual } from './registry/visuals';
import type {
  Dashboard,
  DashboardDataSource,
  DashboardDefinition,
  DashboardPage,
  DashboardQuery,
  DashboardRelationship,
  DashboardWidget,
  DashboardWidgetType,
} from '~/lib/types/dashboard';

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

type StudioContextValue = {
  dashboardId: string;
  workspaceId?: string;
  dashboard: Dashboard;
  sources: DashboardDataSource[];
  addSource: ReturnType<typeof useAddDashboardSource>;
  deleteSource: ReturnType<typeof useDeleteDashboardSource>;

  definition: DashboardDefinition;
  change: (updater: (draft: DashboardDefinition) => void) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  dirty: boolean;
  saving: boolean;
  save: (automatic?: boolean) => Promise<void>;
  restore: (revisionId: string) => Promise<void>;

  activePage?: DashboardPage;
  setActivePageId: (id?: string) => void;
  addPage: () => void;
  deletePage: () => void;

  selected?: DashboardWidget;
  selectedSource?: DashboardDataSource;
  setSelectedId: (id?: string) => void;
  addWidget: (type: DashboardWidgetType) => void;
  updateWidget: (patch: Partial<DashboardWidget>) => void;
  updateQuery: (patch: Partial<DashboardQuery>) => void;
  removeWidget: () => void;
  duplicateWidget: () => void;
  moveWidget: (direction: -1 | 1) => void;
  reorderWidget: (sourceId: string, targetId: string) => void;

  /** Relationships as edited in the model view (draft survives view switches). */
  modelRelationships: DashboardRelationship[];
  setModelRelationships: (
    update: (current: DashboardRelationship[]) => DashboardRelationship[]
  ) => void;
  modelDirty: boolean;
  discardModel: () => void;

  run: () => Promise<void>;
  analysing: boolean;
  hydrate: () => Promise<void>;
  rendering: boolean;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio must be used inside StudioProvider');
  return value;
}

export function StudioProvider({
  dashboardId,
  workspaceId,
  children,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  children: ReactNode;
}>) {
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
  const [dirty, setDirty] = useState(false);
  const [modelDraft, setModelDraft] = useState<DashboardRelationship[]>();
  const undoStack = useRef<DashboardDefinition[]>([]);
  const redoStack = useRef<DashboardDefinition[]>([]);
  const currentRef = useRef<DashboardDefinition | undefined>(undefined);
  const hydratedRef = useRef(false);

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
      silent: automatic,
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
  const updateQuery = (patch: Partial<DashboardQuery>) => {
    if (!selected) return;
    updateWidget({
      query: {
        dimensions: [],
        measures: [],
        limit: 250,
        ...selected.query,
        ...patch,
      },
    });
  };
  const addWidget = (type: DashboardWidgetType) => {
    const id = newId();
    const source = sources.find((item) => item.status === 'ready');
    const widget: DashboardWidget = {
      id,
      ...getVisual(type).create({ sourceId: source?.id }),
    };
    change((draft) => {
      (
        draft.pages.find((page) => page.id === activePage?.id) ?? draft.pages[0]
      ).widgets.push(widget);
    });
    setSelectedId(id);
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
  const reorderWidget = (sourceId: string, targetId: string) =>
    change((draft) => {
      const page = draft.pages.find((item) => item.id === activePage?.id);
      if (!page) return;
      const from = page.widgets.findIndex((widget) => widget.id === sourceId);
      const to = page.widgets.findIndex((widget) => widget.id === targetId);
      if (from >= 0 && to >= 0)
        page.widgets = arrayMove(page.widgets, from, to);
    });
  const savedRelationships = dashboard?.semantic_model?.relationships ?? [];
  const modelRelationships = modelDraft ?? savedRelationships;
  const modelDirty =
    modelDraft !== undefined &&
    JSON.stringify(modelDraft) !== JSON.stringify(savedRelationships);
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
  const hydrate = async () => {
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
    void hydrate().catch(() => undefined);
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
    setDirty(false);
  };

  if (!isLoading && !dashboard)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <h2 className="text-xl font-semibold">Dashboard not found</h2>
        <Button asChild variant="outline">
          <Link
            to={
              workspaceId
                ? `/app/workspaces/${workspaceId}/dashboards`
                : '/app/my-dashboards'
            }
          >
            Back to dashboards
          </Link>
        </Button>
      </div>
    );
  if (isLoading || !dashboard || !definition)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );

  const value: StudioContextValue = {
    dashboardId,
    workspaceId,
    dashboard,
    sources,
    addSource,
    deleteSource,
    definition,
    change,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    dirty,
    saving: saveDefinition.isPending,
    save,
    restore,
    activePage,
    setActivePageId,
    addPage,
    deletePage,
    selected,
    selectedSource,
    setSelectedId,
    addWidget,
    updateWidget,
    updateQuery,
    removeWidget,
    duplicateWidget,
    moveWidget,
    reorderWidget,
    modelRelationships,
    setModelRelationships: (update) =>
      setModelDraft((current) => update(current ?? savedRelationships)),
    modelDirty,
    discardModel: () => setModelDraft(undefined),
    run,
    analysing: runAnalysis.isPending,
    hydrate,
    rendering: renderDashboard.isPending,
  };

  return (
    <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
  );
}
