import {
  Globe,
  Building2,
  GraduationCap,
  Landmark,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { useDatasetCard } from './use-dataset-card';

const audienceIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  'Non-Profit': Landmark,
  Company: Building2,
  Student: GraduationCap,
  Public: Globe,
  Government: Landmark,
  Academic: BookOpen,
};

export function DatasetCardAudience({ className }: { className?: string }) {
  const { dataset } = useDatasetCard();

  if (dataset.availableTo.length === 0) return null;

  return (
    <div className={cn('space-y-1.5', className)}>
      <p className="text-xs font-medium text-muted-foreground">Available to:</p>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {dataset.availableTo.map((audience) => {
          const Icon = audienceIcons[audience] ?? Globe;
          return (
            <span
              key={audience}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {audience}
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            </span>
          );
        })}
      </div>
    </div>
  );
}
