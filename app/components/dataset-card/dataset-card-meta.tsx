import moment from 'moment';
import { Clock, HardDrive, Users } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

interface DatasetCardMetaProps {
  className?: string;
}

export function DatasetCardMeta({ className }: Readonly<DatasetCardMetaProps>) {
  const { dataset } = useDatasetCard();

  return (
    <div
      className={cn(
        'mt-auto space-y-1.5 border-t pt-3 text-xs text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span>Updated {moment(dataset.lastUpdated).fromNow()}</span>
      </div>
      {dataset.formats.length > 0 && (
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3.5 w-3.5" />
          <span>
            {dataset.formats.join(', ')} ({dataset.size})
          </span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" />
        <span>{dataset.downloads.toLocaleString()} downloads</span>
      </div>
    </div>
  );
}
