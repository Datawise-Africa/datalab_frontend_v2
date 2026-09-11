import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Network, Play, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { AppDialog } from '~/components/ui/app-dialog';
import { Form } from '~/components/ui/form';
import { FormTextField } from '~/components/form-fields/form-text-field';
import { FormPickerField } from '~/components/form-fields/form-picker-field';
import { Badge } from '~/components/ui/badge';
import type {
  DashboardDataSource,
  DashboardRelationship,
  DashboardSemanticModel,
} from '~/lib/types/dashboard';
import {
  refreshPolicySchema,
  relationshipSchema,
  type RefreshPolicyFormValues,
  type RelationshipFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import {
  useDashboardRefreshRuns,
  useRefreshDashboard,
  useSaveRefreshPolicy,
  useSaveSemanticModel,
} from '~/features/dashboard-studio';

const options = (items: Array<{ id: string; name: string }>) =>
  items.map((item) => ({ value: item.id, label: item.name }));

export function DataModelDialog({
  open,
  onOpenChange,
  dashboardId,
  workspaceId,
  sources,
  initialModel,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
  workspaceId?: string;
  sources: DashboardDataSource[];
  initialModel?: DashboardSemanticModel;
}>) {
  const save = useSaveSemanticModel(dashboardId, workspaceId);
  const [relationships, setRelationships] = useState<DashboardRelationship[]>(
    initialModel?.relationships ?? []
  );
  useEffect(
    () => setRelationships(initialModel?.relationships ?? []),
    [initialModel]
  );
  const form = useForm<RelationshipFormValues>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      left_source: '',
      left_key: '',
      right_source: '',
      right_key: '',
      join_type: 'left',
      cardinality: 'many_to_one',
    },
  });
  const left = sources.find(
    (source) => source.id === form.watch('left_source')
  );
  const right = sources.find(
    (source) => source.id === form.watch('right_source')
  );
  const add = form.handleSubmit((values) => {
    setRelationships((current) => [
      ...current,
      { id: crypto.randomUUID(), ...values, enabled: true },
    ]);
    form.reset({
      left_source: '',
      left_key: '',
      right_source: '',
      right_key: '',
      join_type: 'left',
      cardinality: 'many_to_one',
    });
  });
  const persist = async () => {
    await save.mutateAsync({
      version: 1,
      relationships,
      unions: initialModel?.unions ?? [],
      dimensions: initialModel?.dimensions ?? [],
      measures: initialModel?.measures ?? [],
    });
    onOpenChange(false);
  };
  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Data model"
      closeMode="explicit"
      icon={Network}
      size="xl"
    >
      <p className="text-sm text-muted-foreground">
        Relate sources once, then analyse their fields together without
        flattening your original data.
      </p>
      <Form {...form}>
        <form
          onSubmit={add}
          className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <FormPickerField
            control={form.control}
            name="left_source"
            label="First source"
            options={options(sources)}
            required
          />
          <FormPickerField
            control={form.control}
            name="left_key"
            label="Matching field"
            options={(left?.schema ?? []).map((field) => ({
              value: field.name,
              label: field.name,
            }))}
            required
          />
          <FormPickerField
            control={form.control}
            name="join_type"
            label="Keep rows from"
            options={[
              { value: 'left', label: 'First source' },
              { value: 'inner', label: 'Matches only' },
              { value: 'right', label: 'Second source' },
              { value: 'outer', label: 'Both sources' },
            ]}
            required
          />
          <FormPickerField
            control={form.control}
            name="right_source"
            label="Second source"
            options={options(
              sources.filter(
                (source) => source.id !== form.watch('left_source')
              )
            )}
            required
          />
          <FormPickerField
            control={form.control}
            name="right_key"
            label="Matching field"
            options={(right?.schema ?? []).map((field) => ({
              value: field.name,
              label: field.name,
            }))}
            required
          />
          <FormPickerField
            control={form.control}
            name="cardinality"
            label="Cardinality"
            options={[
              { value: 'one_to_one', label: 'One to one' },
              { value: 'one_to_many', label: 'One to many' },
              { value: 'many_to_one', label: 'Many to one' },
              { value: 'many_to_many', label: 'Many to many' },
            ]}
            required
          />
          <Button type="submit" className="md:col-span-2 lg:col-span-3">
            Add relationship
          </Button>
        </form>
      </Form>
      <div className="space-y-2">
        {relationships.map((relationship) => (
          <div
            key={relationship.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 text-sm"
          >
            <span>
              {
                sources.find((item) => item.id === relationship.left_source)
                  ?.name
              }{' '}
              · {relationship.left_key}{' '}
              <Badge variant="outline">{relationship.join_type}</Badge>{' '}
              {
                sources.find((item) => item.id === relationship.right_source)
                  ?.name
              }{' '}
              · {relationship.right_key}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setRelationships((items) =>
                  items.filter((item) => item.id !== relationship.id)
                )
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {!relationships.length && (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No relationships yet. Single-source analysis remains available.
          </p>
        )}
      </div>
      <Button onClick={() => void persist()} disabled={save.isPending}>
        {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save data model
      </Button>
    </AppDialog>
  );
}

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
