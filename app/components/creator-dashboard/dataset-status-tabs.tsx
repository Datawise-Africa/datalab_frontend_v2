import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import type { DatasetStatus } from '~/lib/types/dataset';

interface DatasetStatusTabsProps {
  activeTab: DatasetStatus | 'all';
  onTabChange: (tab: DatasetStatus | 'all') => void;
  counts?: Record<string, number>;
}

const tabs: { key: DatasetStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'PB', label: 'Published' },
  { key: 'DF', label: 'Drafts' },
  { key: 'AR', label: 'Archived' },
];

export function DatasetStatusTabs({
  activeTab,
  onTabChange,
  counts,
}: Readonly<DatasetStatusTabsProps>) {
  return (
    <div className="flex gap-1 rounded-lg border p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === tab.key
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-muted'
          )}
        >
          {tab.label}
          {counts?.[tab.key] !== undefined && (
            <Badge
              variant="secondary"
              className={cn(
                'h-5 min-w-[20px] rounded-full px-1.5 text-xs',
                activeTab === tab.key && 'bg-white/20 text-white'
              )}
            >
              {counts[tab.key]}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}
