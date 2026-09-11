import { LayoutDashboard, Plug, Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { DashboardRenderer } from './dashboard-renderer';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

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
  } = useStudio();
  const { preview, openInsert, openSettings, isWide, leftOpen } = useStudioUi();

  return (
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
          onSelect={preview ? undefined : setSelectedId}
          loading={rendering}
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
    </main>
  );
}
