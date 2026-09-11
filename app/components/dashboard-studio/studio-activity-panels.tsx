/**
 * Collaboration / document panels shown beside the canvas: in the right
 * column on wide screens, in a right-hand sheet otherwise (see `StudioAside`
 * and `StudioDialogs`). Content only — the frame supplies the title bar.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  FormNumberField,
  FormPickerField,
  FormTextareaField,
  FormTextField,
} from '~/components/form-fields';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import {
  useCreateDashboardAlert,
  useCreateDashboardComment,
  useDashboardAlerts,
  useDashboardComments,
  useDashboardRevisions,
} from '~/features/dashboard-studio';
import { alertConditionOptions } from '~/lib/constants/dashboard-studio';
import {
  alertSchema,
  commentSchema,
  type AlertFormValues,
  type CommentFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import type { DashboardAlert } from '~/lib/types/dashboard';
import { useStudio } from './studio-context';

export function HistoryPanel({
  onRestored,
}: Readonly<{ onRestored?: () => void }>) {
  const { dashboardId, workspaceId, restore } = useStudio();
  const { data: revisions = [], isLoading } = useDashboardRevisions(
    dashboardId,
    workspaceId
  );
  if (isLoading)
    return (
      <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-primary" />
    );
  return (
    <ol className="space-y-2">
      {revisions.map((revision, index) => (
        <li
          key={revision.id}
          className="flex items-center justify-between gap-2 rounded-lg border p-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {revision.note || 'Dashboard revision'}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(revision.created_at).toLocaleString()}
              {index === 0 && ' · Latest'}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={async () => {
              await restore(revision.id);
              onRestored?.();
            }}
          >
            Restore
          </Button>
        </li>
      ))}
      {!revisions.length && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          History will appear after the first save.
        </p>
      )}
    </ol>
  );
}

export function CommentsPanel() {
  const { dashboardId, workspaceId, activePage, selected, definition } =
    useStudio();
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
      page_id: activePage?.id,
      widget_id: selected?.id,
    });
    form.reset();
  });
  const widgetTitle = (id?: string) =>
    definition.pages
      .flatMap((page) => page.widgets)
      .find((widget) => widget.id === id)?.title;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={submit} className="space-y-2">
          <FormTextareaField
            control={form.control}
            name="body"
            label={
              selected
                ? `Comment on “${selected.title}”`
                : `Comment on “${activePage?.title ?? 'this page'}”`
            }
            placeholder="Describe the question, decision or change needed"
            rows={3}
          />
          <Button type="submit" size="sm" disabled={create.isPending}>
            Post comment
          </Button>
        </form>
      </Form>
      <div className="space-y-2">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-lg border p-3">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <strong className="truncate">
                {comment.author_name || 'Team member'}
              </strong>
              <time className="shrink-0 text-muted-foreground">
                {new Date(comment.created_at).toLocaleString()}
              </time>
            </div>
            {widgetTitle(comment.widget_id) && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                On {widgetTitle(comment.widget_id)}
              </p>
            )}
            <p className="mt-2 text-sm whitespace-pre-wrap">{comment.body}</p>
          </article>
        ))}
        {!comments.length && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No comments yet.
          </p>
        )}
      </div>
    </div>
  );
}

export function AlertsPanel() {
  const { dashboardId, workspaceId, definition } = useStudio();
  const { data: alerts = [] } = useDashboardAlerts(dashboardId, workspaceId);
  const create = useCreateDashboardAlert(dashboardId, workspaceId);
  const widgets = definition.pages.flatMap((page) =>
    page.widgets
      .filter((widget) => widget.type !== 'text')
      .map((widget) => ({
        value: widget.id,
        label: widget.title,
        group: page.title,
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
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={submit} className="space-y-3 rounded-lg border p-3">
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
            emptyMessage="Add a visual first."
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <FormPickerField
              control={form.control}
              name="operator"
              label="Condition"
              options={alertConditionOptions}
              clearable={false}
              searchable={false}
            />
            <FormNumberField
              control={form.control}
              name="threshold"
              label="Threshold"
              required
            />
          </div>
          <FormTextField
            control={form.control}
            name="recipients"
            label="Recipients"
            placeholder="name@example.org, team@example.org"
            required
          />
          <Button type="submit" size="sm" disabled={create.isPending}>
            Create alert
          </Button>
        </form>
      </Form>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <strong className="truncate">{alert.name}</strong>
              <Badge variant={alert.is_active ? 'success' : 'secondary'}>
                {alert.is_active ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {alertConditionOptions.find(
                (option) => option.value === alert.operator
              )?.label ?? alert.operator}{' '}
              {alert.threshold} · Last value{' '}
              {alert.last_value ?? 'not evaluated'}
            </p>
          </div>
        ))}
        {!alerts.length && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No alerts yet.
          </p>
        )}
      </div>
    </div>
  );
}
