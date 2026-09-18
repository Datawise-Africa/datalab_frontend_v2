import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  AlertsPanel,
  CommentsPanel,
  HistoryPanel,
} from './studio-activity-panels';
import { StudioInspector } from './studio-inspector';
import { useStudioUi, type StudioActivityPanel } from './studio-ui-context';

export const activityPanels: Record<
  StudioActivityPanel,
  { title: string; render: (close: () => void) => ReactNode }
> = {
  history: {
    title: 'Version history',
    render: (close) => <HistoryPanel onRestored={close} />,
  },
  comments: { title: 'Review comments', render: () => <CommentsPanel /> },
  alerts: { title: 'Data alerts', render: () => <AlertsPanel /> },
};

/** `xl` right column: visual properties, or an activity panel over it. */
export function StudioAside() {
  const { aside, showProperties } = useStudioUi();
  if (aside === 'properties') return <StudioInspector />;
  const panel = activityPanels[aside];
  return (
    <aside className="flex min-h-0 min-w-0 flex-col border-l bg-background">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b py-2 pr-2 pl-4">
        <h2 className="text-sm font-semibold">{panel.title}</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={showProperties}
          aria-label={`Close ${panel.title.toLowerCase()}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4">
        {panel.render(showProperties)}
      </div>
    </aside>
  );
}
