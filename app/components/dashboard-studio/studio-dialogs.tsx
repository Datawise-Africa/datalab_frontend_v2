import { InfographicBuilder } from './infographic-builder';
import { SourcePreparationDialog } from './source-preparation-dialog';
import { SourceProfileDialog } from './source-profile-dialog';
import { DataModelDialog, RefreshDialog } from './studio-management-dialogs';
import { activityPanels } from './studio-aside';
import { StudioSettingsSheet } from './studio-settings-sheet';
import { StudioInsertPanel } from './studio-insert-panel';
import { StudioInspector } from './studio-inspector';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

/**
 * Studio-level dialogs driven by `useStudioUi().openDialog(...)`. Each mounts
 * only while open so its queries don't run on studio load.
 */
export function StudioDialogs() {
  const {
    dashboardId,
    workspaceId,
    dashboard,
    sources,
    selected,
    setSelectedId,
  } = useStudio();
  const {
    dialog,
    dialogProps,
    openDialog,
    isWide,
    preview,
    profileSourceId,
    setProfileSourceId,
    prepareSourceId,
    setPrepareSourceId,
  } = useStudioUi();
  const ids = { dashboardId, workspaceId };

  return (
    <>
      <StudioSettingsSheet />
      <Sheet {...dialogProps('insert')}>
        <SheetContent side="left" className="w-full gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="sr-only">
            <SheetTitle>Insert a visual</SheetTitle>
            <SheetDescription>
              Pick a visual to add to this page.
            </SheetDescription>
          </SheetHeader>
          <StudioInsertPanel onInserted={() => openDialog(null)} />
        </SheetContent>
      </Sheet>
      {!isWide && !preview && (
        <Sheet
          open={Boolean(selected)}
          onOpenChange={(open) => !open && setSelectedId(undefined)}
        >
          <SheetContent
            side="bottom"
            className="flex h-[85dvh] flex-col gap-0 rounded-t-xl p-0"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Visual properties</SheetTitle>
              <SheetDescription>
                Edit the selected visual's data, analysis and formatting.
              </SheetDescription>
            </SheetHeader>
            <StudioInspector variant="sheet" />
          </SheetContent>
        </Sheet>
      )}
      {!isWide &&
        (['history', 'comments', 'alerts'] as const).map((id) => (
          <Sheet key={id} {...dialogProps(id)}>
            <SheetContent
              side="right"
              className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
            >
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle>{activityPanels[id].title}</SheetTitle>
                <SheetDescription className="sr-only">
                  {activityPanels[id].title} for this dashboard
                </SheetDescription>
              </SheetHeader>
              <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
                {dialog === id &&
                  activityPanels[id].render(() => openDialog(null))}
              </div>
            </SheetContent>
          </Sheet>
        ))}
      {profileSourceId && (
        <SourceProfileDialog
          {...ids}
          source={sources.find((item) => item.id === profileSourceId)}
          open
          onOpenChange={(open) => !open && setProfileSourceId(undefined)}
        />
      )}
      {prepareSourceId && (
        <SourcePreparationDialog
          {...ids}
          source={sources.find((item) => item.id === prepareSourceId)}
          open
          onOpenChange={(open) => !open && setPrepareSourceId(undefined)}
        />
      )}
      {dialog === 'model' && (
        <DataModelDialog
          {...ids}
          {...dialogProps('model')}
          sources={sources}
          initialModel={dashboard.semantic_model}
        />
      )}
      {dialog === 'refresh' && (
        <RefreshDialog
          {...ids}
          {...dialogProps('refresh')}
          initialFrequency={dashboard.refresh_policy?.frequency}
        />
      )}
      {dialog === 'infographic' && (
        <InfographicBuilder
          {...ids}
          {...dialogProps('infographic')}
          widget={selected}
        />
      )}
    </>
  );
}
