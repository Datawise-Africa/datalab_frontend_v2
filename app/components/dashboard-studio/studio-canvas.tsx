import { useEffect, useEffectEvent, useRef } from 'react';
import { LayoutDashboard, Plug, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { canvasFrames } from '~/lib/constants/dashboard-studio';
import { cn } from '~/lib/utils';
import { DashboardRenderer } from './dashboard-renderer';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';
import { StudioWidgetToolbar } from './studio-widget-toolbar';
import { StudioZoomBar } from './studio-zoom-bar';

/** Horizontal room kept around a framed page when fitting it to the canvas. */
const FIT_GUTTER = 64;

export function StudioCanvas() {
  const {
    definition,
    change,
    activePage,
    setActivePageId,
    selected,
    setSelectedId,
    rendering,
    sources,
    reorderWidget,
    updateWidget,
  } = useStudio();
  const {
    preview,
    openInsert,
    openSettings,
    isWide,
    leftOpen,
    showProperties,
    zoom,
    setZoom,
    frame,
    showGrid,
  } = useStudioUi();
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameWidth = canvasFrames.find((item) => item.value === frame)?.width;
  // Zoom and frames are editing aids; Preview shows the page as viewers see it.
  const scale = preview ? 1 : zoom;
  const framed = !preview && Boolean(frameWidth);

  // Ctrl/⌘ + wheel zooms the canvas (non-passive so the browser page doesn't).
  const onWheel = useEffectEvent((event: WheelEvent) => {
    if (preview || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    setZoom(zoom * (event.deltaY > 0 ? 0.9 : 1.1));
  });
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const handler = (event: WheelEvent) => onWheel(event);
    element.addEventListener('wheel', handler, { passive: false });
    return () => element.removeEventListener('wheel', handler);
    // onWheel is a useEffectEvent — intentionally excluded per React docs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fit = () => {
    const element = scrollRef.current;
    if (!element) return;
    setZoom(frameWidth ? (element.clientWidth - FIT_GUTTER) / frameWidth : 1);
  };

  return (
    <main className="relative min-h-0 min-w-0">
      <div
        ref={scrollRef}
        className={cn(
          'scrollbar-thin h-full overflow-auto p-4 lg:p-6',
          framed &&
            'bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[16px_16px]'
        )}
      >
        <div
          className={cn(
            'mx-auto',
            framed
              ? 'rounded-xl bg-background p-4 shadow-sm ring-1 ring-border'
              : 'max-w-450'
          )}
          style={{
            width: framed ? (frameWidth ?? undefined) : undefined,
            zoom: scale,
          }}
        >
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
            {!preview && !(isWide && leftOpen) && (
              <Button size="sm" onClick={openInsert}>
                <Plus className="mr-1 h-4 w-4" />
                Add visual
              </Button>
            )}
          </div>
          {!preview && !sources.length && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-4">
              <div>
                <p className="text-sm font-medium">No data connected yet</p>
                <p className="text-xs text-muted-foreground">
                  Connect a file, Datalab dataset or API to power your visuals.
                </p>
              </div>
              <Button size="sm" onClick={() => openSettings('integrations')}>
                <Plug className="mr-1.5 h-4 w-4" />
                Connect data
              </Button>
            </div>
          )}
          <DashboardRenderer
            definition={definition}
            activePageId={activePage?.id}
            onPageChange={setActivePageId}
            hidePageTabs
            selectedId={preview ? undefined : selected?.id}
            onSelect={
              preview
                ? undefined
                : (id) => {
                    setSelectedId(id);
                    showProperties();
                  }
            }
            loading={rendering}
            selectedActions={<StudioWidgetToolbar />}
            onReorder={preview ? undefined : reorderWidget}
            // Only the selected visual shows a handle, so updateWidget targets it.
            onResize={
              preview ? undefined : (_id, layout) => updateWidget({ layout })
            }
            showGridGuides={!preview && showGrid}
          />
          {!activePage?.widgets.length && (
            <button
              type="button"
              onClick={openInsert}
              className="mt-4 flex w-full flex-col items-center rounded-xl border-2 border-dashed p-20 text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <LayoutDashboard className="mb-3 h-10 w-10" />
              <span className="font-medium">Build this page</span>
              <span className="mt-1 text-xs">
                Pick a KPI, chart, table or narrative from Insert
              </span>
            </button>
          )}
        </div>
      </div>
      {!preview && <StudioZoomBar onFit={fit} />}
    </main>
  );
}
