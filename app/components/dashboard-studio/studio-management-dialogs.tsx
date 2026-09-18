import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
import { Form } from '~/components/ui/form';
import { FormTextField } from '~/components/form-fields/form-text-field';
import { FormPickerField } from '~/components/form-fields/form-picker-field';
import { Badge } from '~/components/ui/badge';
import {
  refreshPolicySchema,
  type RefreshPolicyFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import {
  useDashboardRefreshRuns,
  useRefreshDashboard,
  useSaveRefreshPolicy,
} from '~/features/dashboard-studio';

export function RefreshDialog({
  open,
  onOpenChange,
  dashboardId,
  workspaceId,
  initialFrequency = 'manual',
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
  workspaceId?: string;
  initialFrequency?: RefreshPolicyFormValues['frequency'];
}>) {
  const refresh = useRefreshDashboard(dashboardId, workspaceId);
  const savePolicy = useSaveRefreshPolicy(dashboardId, workspaceId);
  const { data: runs = [] } = useDashboardRefreshRuns(dashboardId, workspaceId);
  const form = useForm<RefreshPolicyFormValues>({
    resolver: zodResolver(refreshPolicySchema),
    defaultValues: { frequency: initialFrequency, timezone: 'Africa/Nairobi' },
  });
  const submit = form.handleSubmit((values) =>
    savePolicy.mutate({ enabled: values.frequency !== 'manual', ...values })
  );
  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Data freshness"
      closeMode="explicit"
      icon={RefreshCw}
      size="lg"
    >
      <Button onClick={() => refresh.mutate()} disabled={refresh.isPending}>
        {refresh.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Refresh all sources now
      </Button>
      <Form {...form}>
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"
        >
          <FormPickerField
            control={form.control}
            name="frequency"
            label="Automatic refresh"
            options={[
              { value: 'manual', label: 'Manual only' },
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
            ]}
          />
          <FormTextField
            control={form.control}
            name="timezone"
            label="Timezone"
          />
          <Button type="submit" className="sm:col-span-2">
            Save schedule
          </Button>
        </form>
      </Form>
      <div className="max-h-56 space-y-2 overflow-y-auto">
        <h3 className="text-sm font-semibold">Refresh history</h3>
        {runs.map((run) => (
          <div key={run.id} className="rounded-lg border p-3 text-xs">
            <div className="flex justify-between">
              <strong>{run.trigger}</strong>
              <Badge
                variant={
                  run.status === 'succeeded'
                    ? 'success'
                    : run.status === 'failed'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {run.status}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              {run.refreshed_count}/{run.source_count} sources ·{' '}
              {new Date(run.created_at).toLocaleString()}
            </p>
            {run.error && <p className="mt-1 text-destructive">{run.error}</p>}
          </div>
        ))}
      </div>
    </AppDialog>
  );
}
