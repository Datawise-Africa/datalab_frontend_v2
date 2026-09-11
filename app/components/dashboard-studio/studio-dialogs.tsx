import { InfographicBuilder } from './infographic-builder';
import { SourcePreparationDialog } from './source-preparation-dialog';
import { SourceProfileDialog } from './source-profile-dialog';
import { DataModelDialog, RefreshDialog } from './studio-management-dialogs';
import { activityPanels } from './studio-aside';
import { StudioSettingsSheet } from './studio-settings-sheet';
import { StudioInsertPanel } from './studio-insert-panel';
import { StudioInspector } from './studio-inspector';
import { AppSheet } from '~/components/ui/app-sheet';
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
      <AppSheet
        {...dialogProps('insert')}
        side="left"
        size="sm"
        title="Insert a visual"
        description="Pick a visual to add to this page."
        hideHeader
        bodyClassName="overflow-hidden p-0"
      >
        <StudioInsertPanel onInserted={() => openDialog(null)} />
      </AppSheet>
      {!isWide && !preview && (
        <AppSheet
          open={Boolean(selected)}
          onOpenChange={(open) => !open && setSelectedId(undefined)}
          side="bottom"
          title="Visual properties"
          description="Edit the selected visual's data, analysis and formatting."
          hideHeader
          className="h-[85dvh]"
          bodyClassName="overflow-hidden p-0"
        >
          <StudioInspector variant="sheet" />
        </AppSheet>
      )}
      {!isWide &&
        (['history', 'comments', 'alerts'] as const).map((id) => (
          <AppSheet
            key={id}
            {...dialogProps(id)}
            title={activityPanels[id].title}
            closeMode={id === 'history' ? 'auto' : 'explicit'}
          >
            {dialog === id && activityPanels[id].render(() => openDialog(null))}
          </AppSheet>
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
