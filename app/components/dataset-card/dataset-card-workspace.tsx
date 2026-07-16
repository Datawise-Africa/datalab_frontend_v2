import { Building2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardWorkspaceProps {
  className?: string;
}

export function DatasetCardWorkspace({
  className,
}: Readonly<DatasetCardWorkspaceProps>) {
  const { dataset } = useDatasetCard();
  if (!dataset.workspaceName) return null;

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 truncate text-sm text-muted-foreground',
        className
      )}
    >
      <Building2 className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{dataset.workspaceName}</span>
    </span>
  );
}
