import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Info } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Optional decoration. Most cards look cleaner without — only pass when it adds meaning. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Tooltip content shown next to the label. */
  hint?: ReactNode;
  /** Period-over-period delta as a percentage. Positive = up arrow + green pill, negative = red. */
  delta?: number | null;
  /** Optional sub-line below the value (e.g. "vs. last month"). */
  sublabel?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  delta,
  sublabel,
  className,
}: Readonly<StatCardProps>) {
  return (
    <Card className={cn('h-full', className)}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && (
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {hint && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground/50 hover:text-muted-foreground"
                      aria-label={`${label} info`}
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    {hint}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {typeof delta === 'number' && <DeltaPill delta={delta} />}
        </div>

        <p className="mt-4 text-3xl font-bold tracking-tight tabular-nums">
          {value}
        </p>

        {sublabel && (
          <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
        )}
      </CardContent>
    </Card>
  );
}

function DeltaPill({ delta }: Readonly<{ delta: number }>) {
  const positive = delta >= 0;
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5 text-xs font-medium',
        positive ? 'text-success' : 'text-destructive'
      )}
    >
      <Arrow className="h-3 w-3" />
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}
