import type { ComponentType } from 'react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  Bell,
  History,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Network,
  PanelRightClose,
  PanelRightOpen,
  Redo2,
  RefreshCw,
  Save,
  Settings,
  Undo2,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { useStudio } from './studio-context';
import { SharePopover } from './studio-share-popover';
import { useStudioUi, type StudioActivityPanel } from './studio-ui-context';

type Action = {
  id: 'refresh' | StudioActivityPanel;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

/** Document tools — icon buttons from `md`, otherwise in the ⋯ menu. */
const toolActions: Action[] = [
  { id: 'refresh', label: 'Refresh data', icon: RefreshCw },
  { id: 'history', label: 'Version history', icon: History },
  { id: 'comments', label: 'Review comments', icon: MessageSquare },
  { id: 'alerts', label: 'Data alerts', icon: Bell },
];

export function StudioTopBar() {
  const {
    dashboardId,
    workspaceId,
    dashboard,
    undo,
    redo,
    canUndo,
    canRedo,
    dirty,
    saving,
    save,
    hydrate,
  } = useStudio();
  const {
    preview,
    setPreview,
    openDialog,
    openSettings,
    isWide,
    rightOpen,
    setRightOpen,
    aside,
    toggleActivity,
  } = useStudioUi();
  const runAction = (id: Action['id']) =>
    id === 'refresh' ? openDialog('refresh') : toggleActivity(id);
  const back = workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards/${dashboardId}`
    : `/app/my-dashboards/${dashboardId}`;
  const setMode = (next: boolean) => {
    setPreview(next);
    if (next) void hydrate().catch(() => undefined);
  };

  return (
    <header className="z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-2 sm:px-3">
      <Button asChild variant="ghost" size="icon" className="shrink-0">
        <Link to={back} aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold">{dashboard.title}</h1>
        <p className="truncate text-[11px] text-muted-foreground">
          {saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved'}
        </p>
      </div>

      <div
        role="group"
        aria-label="Mode"
        className="hidden shrink-0 rounded-md bg-muted p-0.5 sm:flex"
      >
        {[
          { label: 'Edit', value: false },
          { label: 'Preview', value: true },
        ].map((mode) => (
          <button
            key={mode.label}
            type="button"
            aria-pressed={preview === mode.value}
            onClick={() => setMode(mode.value)}
            className={cn(
              'rounded px-3 py-1 text-xs font-medium text-muted-foreground transition',
              preview === mode.value &&
                'bg-background text-foreground shadow-sm'
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <span className="mx-1 hidden h-5 w-px bg-border md:block" />
        {toolActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="icon"
            className={cn(
              'hidden md:inline-flex',
              isWide &&
                rightOpen &&
                aside === action.id &&
                'bg-primary/10 text-primary'
            )}
            onClick={() => runAction(action.id)}
            aria-pressed={
              action.id === 'refresh' ? undefined : aside === action.id
            }
            aria-label={action.label}
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
        {isWide && !preview && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightOpen(!rightOpen)}
            aria-label={rightOpen ? 'Hide properties' : 'Show properties'}
            title={rightOpen ? 'Hide properties' : 'Show properties'}
          >
            {rightOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="sm:hidden"
              onSelect={() => setMode(!preview)}
            >
              {preview ? 'Back to edit' : 'Preview'}
            </DropdownMenuItem>
            {toolActions.map((action) => (
              <DropdownMenuItem
                key={action.id}
                className="md:hidden"
                onSelect={() => runAction(action.id)}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem onSelect={() => openDialog('model')}>
              <Network className="h-4 w-4" />
              Data model
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openSettings()}>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="mx-1 h-5 w-px bg-border" />
        <SharePopover />
        <Button
          size="sm"
          className="ml-1"
          onClick={() => void save(false).catch(() => undefined)}
          disabled={!dirty || saving}
          aria-label="Save"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin sm:mr-1.5" />
          ) : (
            <Save className="h-4 w-4 sm:mr-1.5" />
          )}
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </header>
  );
}
