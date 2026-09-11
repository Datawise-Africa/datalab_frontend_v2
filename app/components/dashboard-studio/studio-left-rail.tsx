import type { ComponentType } from 'react';
import { Network, Plus, Settings } from 'lucide-react';
import { cn } from '~/lib/utils';
import { StudioInsertPanel } from './studio-insert-panel';
import { useStudioUi } from './studio-ui-context';

type RailItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  onClick: () => void;
};

/** `xl` left edge: tool rail + the Insert palette it toggles. */
export function StudioLeftRail() {
  const { leftOpen, setLeftOpen, openDialog, openSettings } = useStudioUi();
  const items: RailItem[] = [
    {
      id: 'insert',
      label: 'Insert',
      icon: Plus,
      active: leftOpen,
      onClick: () => setLeftOpen(!leftOpen),
    },
    {
      id: 'model',
      label: 'Data model',
      icon: Network,
      onClick: () => openDialog('model'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => openSettings(),
    },
  ];

  return (
    <aside className="hidden min-h-0 border-r bg-background xl:flex">
      <nav
        aria-label="Studio tools"
        className="flex w-12 shrink-0 flex-col items-center gap-1 border-r py-2"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            aria-label={item.label}
            aria-pressed={item.active}
            title={item.label}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground',
              item.active && 'bg-primary/10 text-primary'
            )}
          >
            <item.icon className="h-4 w-4" />
          </button>
        ))}
      </nav>
      {leftOpen && (
        <div className="min-w-0 flex-1">
          <StudioInsertPanel />
        </div>
      )}
    </aside>
  );
}
