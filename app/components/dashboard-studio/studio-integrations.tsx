import { useState } from 'react';
import {
  Database,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { ConnectSourceForm } from './connect-source-form';
import { useStudio } from './studio-context';
import { useStudioUi } from './studio-ui-context';

/** Settings → Integrations: connected data sources + connect form. */
export function StudioIntegrations() {
  const { sources, deleteSource } = useStudio();
  const { setProfileSourceId, setPrepareSourceId } = useStudioUi();
  const [connecting, setConnecting] = useState(sources.length === 0);

  if (connecting)
    return (
      <div>
        <h3 className="mb-3 text-sm font-semibold">Connect data</h3>
        <ConnectSourceForm
          onDone={() => setConnecting(false)}
          onCancel={() => setConnecting(false)}
        />
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Data sources</h3>
          <p className="text-xs text-muted-foreground">
            Connected to this dashboard. Profile and prepare before analysing.
          </p>
        </div>
        <Button size="sm" onClick={() => setConnecting(true)}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Connect
        </Button>
      </div>
      {sources.map((source) => (
        <div key={source.id} className="rounded-xl border p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    source.status === 'ready'
                      ? 'bg-primary'
                      : source.status === 'failed'
                        ? 'bg-destructive'
                        : 'bg-amber-500'
                  )}
                />
                <p className="truncate text-sm font-medium">{source.name}</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {source.row_count.toLocaleString()} rows ·{' '}
                {source.schema.length} fields
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setProfileSourceId(source.id)}
              >
                <SlidersHorizontal className="mr-1 h-3 w-3" />
                Profile
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => setPrepareSourceId(source.id)}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Prepare
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                aria-label={`Remove ${source.name}`}
                onClick={() => deleteSource.mutate(source.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {source.last_error && (
            <p className="mt-2 line-clamp-2 text-xs text-destructive">
              {source.last_error}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {source.schema.slice(0, 6).map((field) => (
              <Badge
                key={field.name}
                variant="outline"
                className="max-w-full truncate text-[10px]"
              >
                {field.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
      {!sources.length && (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <Database className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            No data sources yet. Connect a dataset, file or API.
          </p>
        </div>
      )}
    </div>
  );
}
