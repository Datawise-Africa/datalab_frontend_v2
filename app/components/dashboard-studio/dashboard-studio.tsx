import { lazy, Suspense, type CSSProperties } from 'react';
import { Loader2, Settings2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { StudioProvider } from './studio-context';
import { StudioUiProvider, useStudioUi } from './studio-ui-context';
import { StudioTopBar } from './studio-top-bar';
import { StudioLeftRail } from './studio-left-rail';
import { StudioCanvas } from './studio-canvas';
import { StudioAside } from './studio-aside';
import { StudioBottomBar } from './studio-bottom-bar';
import { StudioDialogs } from './studio-dialogs';

// React Flow only downloads when someone opens the data model.
const StudioModelView = lazy(() => import('./studio-model-view'));
import { StudioShortcuts } from './studio-shortcuts';
import { StudioConflictDialog } from './studio-conflict-dialog';
import { StudioLeaveGuard } from './studio-leave-guard';

export function DashboardStudio({
  dashboardId,
  workspaceId,
}: Readonly<{ dashboardId: string; workspaceId?: string }>) {
  return (
    <StudioProvider dashboardId={dashboardId} workspaceId={workspaceId}>
      <StudioUiProvider>
        <StudioEditor />
      </StudioUiProvider>
    </StudioProvider>
  );
}

/**
 * Layout: top bar / [rail + insert] canvas [inspector] / page tabs.
 * Below `xl` the side columns drop away: insert and settings open as sheets,
 * the inspector opens as a bottom sheet when a visual is selected.
 */
function StudioEditor() {
  const { preview, leftOpen, rightOpen, inspectorWidth, isWide, view } =
    useStudioUi();
  const modelView = view === 'model' && !preview;
  const studioGridStyle = {
    '--studio-left-width': leftOpen && !modelView ? '308px' : '48px',
    '--studio-inspector-width': rightOpen ? `${inspectorWidth}px` : '48px',
  } as CSSProperties;

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <StudioTopBar />
      <div
        className={cn(
          'scrollbar-thin grid min-h-0 flex-1 grid-cols-1',
          preview
            ? 'grid-rows-[minmax(0,1fr)]'
            : 'overflow-y-auto xl:grid-cols-[var(--studio-left-width)_minmax(0,1fr)_var(--studio-inspector-width)] xl:grid-rows-[minmax(0,1fr)] xl:overflow-y-hidden'
        )}
        style={preview ? undefined : studioGridStyle}
      >
        {!preview && <StudioLeftRail />}
        {modelView ? (
          <Suspense
            fallback={
              <div className="flex items-center justify-center xl:col-span-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            }
          >
            <StudioModelView />
          </Suspense>
        ) : (
          <StudioCanvas />
        )}
        {!preview &&
          !modelView &&
          isWide &&
          (rightOpen ? (
            <StudioAside />
          ) : (
            <aside className="border-l bg-background pt-4 text-center">
              <Settings2 className="mx-auto h-4 w-4 text-muted-foreground" />
            </aside>
          ))}
      </div>
      {!modelView && <StudioBottomBar />}
      <StudioDialogs />
      <StudioShortcuts />
      <StudioLeaveGuard />
      <StudioConflictDialog />
    </div>
  );
}
