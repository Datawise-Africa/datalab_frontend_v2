import type { ComponentType, MouseEvent } from 'react';
import { ArrowDown, ArrowUp, Copy, ImageDown, Trash2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

type Tool = {
  label: string;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  destructive?: boolean;
};

/** Floating actions pinned to the selected visual on the canvas. */
export function StudioWidgetToolbar() {
  const { moveWidget, duplicateWidget, removeWidget } = useStudio();
  const { openDialog } = useStudioUi();
  const tools: Tool[] = [
    { label: 'Move earlier', icon: ArrowUp, onClick: () => moveWidget(-1) },
    { label: 'Move later', icon: ArrowDown, onClick: () => moveWidget(1) },
    {
      label: 'Duplicate',
      hint: 'Ctrl/⌘+D',
      icon: Copy,
      onClick: duplicateWidget,
    },
    {
      label: 'Create infographic',
      icon: ImageDown,
      onClick: () => openDialog('infographic'),
    },
    {
      label: 'Delete visual',
      hint: 'Delete',
      icon: Trash2,
      onClick: removeWidget,
      destructive: true,
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Visual actions"
      className="absolute -top-4 right-3 z-10 flex items-center gap-0.5 rounded-lg border bg-background p-0.5 shadow-md"
    >
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          aria-label={tool.label}
          title={tool.hint ? `${tool.label} (${tool.hint})` : tool.label}
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            tool.onClick();
          }}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground',
            tool.destructive && 'hover:bg-destructive/10 hover:text-destructive'
          )}
        >
          <tool.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
