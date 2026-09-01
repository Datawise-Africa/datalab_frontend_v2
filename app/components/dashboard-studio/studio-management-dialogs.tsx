import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Bell,
  Loader2,
  MessageSquare,
  Network,
  Play,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Form } from '~/components/ui/form';
import { FormTextField } from '~/components/form-fields/form-text-field';
import { FormNumberField } from '~/components/form-fields/form-number-field';
import { FormPickerField } from '~/components/form-fields/form-picker-field';
import { FormTextareaField } from '~/components/form-fields/form-textarea-field';
import { Badge } from '~/components/ui/badge';
import type {
  DashboardAlert,
  DashboardDataSource,
  DashboardDefinition,
  DashboardRelationship,
  DashboardSemanticModel,
} from '~/lib/types/dashboard';
import {
  alertSchema,
  commentSchema,
  refreshPolicySchema,
  relationshipSchema,
  type AlertFormValues,
  type CommentFormValues,
  type RefreshPolicyFormValues,
  type RelationshipFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import {
  useCreateDashboardAlert,
  useCreateDashboardComment,
  useDashboardAlerts,
  useDashboardComments,
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" /> Data model
          </DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" /> Data freshness
          </DialogTitle>
        </DialogHeader>
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
              {run.error && (
                <p className="mt-1 text-destructive">{run.error}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AlertsDialog({
  open,
  onOpenChange,
  dashboardId,
  workspaceId,
  definition,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
  workspaceId?: string;
  definition: DashboardDefinition;
}>) {
  const { data: alerts = [] } = useDashboardAlerts(dashboardId, workspaceId);
  const create = useCreateDashboardAlert(dashboardId, workspaceId);
  const widgets = definition.pages.flatMap((page) =>
    page.widgets
      .filter((widget) => widget.type !== 'text')
      .map((widget) => ({
        value: widget.id,
        label: `${page.title} · ${widget.title}`,
      }))
  );
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      name: '',
      widget_id: '',
      operator: 'gte',
      threshold: 0,
      recipients: '',
    },
  });
  const submit = form.handleSubmit(async (values) => {
    await create.mutateAsync({
      ...values,
      recipients: values.recipients
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      is_active: true,
    } as Omit<DashboardAlert, 'id'>);
    form.reset();
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Data alerts
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={submit}
            className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"
          >
            <FormTextField
              control={form.control}
              name="name"
              label="Alert name"
              required
            />
            <FormPickerField
              control={form.control}
              name="widget_id"
              label="Visual"
              options={widgets}
              required
            />
            <FormPickerField
              control={form.control}
              name="operator"
              label="Condition"
              options={[
                { value: 'gt', label: 'Greater than' },
                { value: 'gte', label: 'At least' },
                { value: 'lt', label: 'Less than' },
                { value: 'lte', label: 'At most' },
                { value: 'equals', label: 'Equals' },
              ]}
            />
            <FormNumberField
              control={form.control}
              name="threshold"
              label="Threshold"
              required
            />
            <div className="sm:col-span-2">
              <FormTextField
                control={form.control}
                name="recipients"
                label="Recipients"
                placeholder="name@example.org, team@example.org"
                required
              />
            </div>
            <Button type="submit" className="sm:col-span-2">
              Create alert
            </Button>
          </form>
        </Form>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-xl border p-3 text-sm">
              <div className="flex justify-between">
                <strong>{alert.name}</strong>
                <Badge variant={alert.is_active ? 'success' : 'secondary'}>
                  {alert.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                {alert.operator} {alert.threshold} · Last value{' '}
                {alert.last_value ?? 'not evaluated'}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CommentsDialog({
  open,
  onOpenChange,
  dashboardId,
  workspaceId,
  pageId,
  widgetId,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
  workspaceId?: string;
  pageId?: string;
  widgetId?: string;
}>) {
  const { data: comments = [] } = useDashboardComments(
    dashboardId,
    workspaceId
  );
  const create = useCreateDashboardComment(dashboardId, workspaceId);
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: '' },
  });
  const submit = form.handleSubmit(async (values) => {
    await create.mutateAsync({
      ...values,
      page_id: pageId,
      widget_id: widgetId,
    });
    form.reset();
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Review comments
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={submit} className="space-y-3">
            <FormTextareaField
              control={form.control}
              name="body"
              label="Add a comment"
              placeholder="Describe the question, decision or change needed"
            />
            <Button type="submit">Post comment</Button>
          </form>
        </Form>
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border p-3">
              <div className="flex justify-between text-xs">
                <strong>{comment.author_name || 'Team member'}</strong>
                <span className="text-muted-foreground">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{comment.body}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
