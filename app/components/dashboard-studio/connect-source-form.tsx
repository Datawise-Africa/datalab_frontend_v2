import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { FormTextField } from '~/components/form-fields';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { cn } from '~/lib/utils';
import {
  connectSourceSchema,
  type ConnectSourceFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import { getIntegration, integrations } from './registry/integrations';
import { useStudio } from './studio-context';

/** Generic connect form: connector tiles + the chosen integration's fields. */
export function ConnectSourceForm({
  onDone,
  onCancel,
}: Readonly<{ onDone: () => void; onCancel: () => void }>) {
  const { workspaceId, addSource } = useStudio();
  const form = useForm<ConnectSourceFormValues>({
    resolver: zodResolver(connectSourceSchema),
    defaultValues: integrations[0].defaults(''),
  });
  const kind = form.watch('kind');
  const integration = getIntegration(kind);

  const submit = form.handleSubmit(async (values) => {
    await addSource.mutateAsync(getIntegration(values.kind).toPayload(values));
    onDone();
  });

  return (
    <Form {...form}>
      <form onSubmit={submit} className="space-y-4">
        <div
          className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3"
          role="radiogroup"
        >
          {integrations.map((item) => (
            <button
              key={item.kind}
              type="button"
              role="radio"
              aria-checked={kind === item.kind}
              onClick={() =>
                form.reset(item.defaults(form.getValues('name') ?? ''))
              }
              className={cn(
                'rounded-xl border p-3 text-left transition hover:border-primary',
                kind === item.kind && 'border-primary bg-primary/5'
              )}
            >
              <item.icon className="mb-1.5 h-5 w-5 text-primary" />
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-[11px] leading-snug text-muted-foreground">
                {item.description}
              </span>
            </button>
          ))}
        </div>
        <FormTextField
          control={form.control}
          name="name"
          label="Source name"
          placeholder="Sales data"
          required
        />
        <integration.Fields workspaceId={workspaceId} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={addSource.isPending}>
            {addSource.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Connect and profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
