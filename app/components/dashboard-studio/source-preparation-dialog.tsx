import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GripVertical, Loader2, Trash2, WandSparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { FormPickerField } from '~/components/form-fields/form-picker-field';
import { FormTextField } from '~/components/form-fields/form-text-field';
import {
  preparationStepSchema,
  type PreparationStepFormValues,
} from '~/lib/schema/dashboard-studio-schema';
import type { DashboardDataSource } from '~/lib/types/dashboard';
import { usePrepareDashboardSource } from '~/features/dashboard-studio';

export function SourcePreparationDialog({
  open,
  onOpenChange,
  source,
  dashboardId,
  workspaceId,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: DashboardDataSource;
  dashboardId: string;
  workspaceId?: string;
}>) {
  const prepare = usePrepareDashboardSource(dashboardId, workspaceId);
  const [steps, setSteps] = useState<
    Array<PreparationStepFormValues & { id: string }>
  >([]);
  const form = useForm<PreparationStepFormValues>({
    resolver: zodResolver(preparationStepSchema),
    defaultValues: {
      operation: 'rename',
      column: '',
      target: '',
      value: '',
      strategy: 'value',
    },
  });
  const operation = form.watch('operation');
  const add = form.handleSubmit((values) => {
    setSteps((current) => [...current, { ...values, id: crypto.randomUUID() }]);
    form.reset({
      operation: values.operation,
      column: '',
      target: '',
      value: '',
      strategy: 'value',
    });
  });
  const apply = async () => {
    if (!source) return;
    await prepare.mutateAsync({
      sourceId: source.id,
      recipe: steps.map(({ id: _id, ...step }) => {
        if (step.operation === 'drop_columns')
          return { operation: 'drop_columns', columns: [step.column] };
        if (step.operation === 'replace')
          return {
            operation: 'replace',
            column: step.column,
            from: step.target,
            to: step.value,
          };
        return step;
      }),
    });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5" /> Prepare {source?.name}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Steps are saved as a repeatable recipe and reapplied whenever this
          source refreshes.
        </p>
        <Form {...form}>
          <form
            onSubmit={add}
            className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2"
          >
            <FormPickerField
              control={form.control}
              name="operation"
              label="Operation"
              options={[
                { value: 'rename', label: 'Rename field' },
                { value: 'cast', label: 'Change data type' },
                { value: 'replace', label: 'Replace value' },
                { value: 'fill_missing', label: 'Fill missing values' },
                { value: 'drop_columns', label: 'Remove field' },
              ]}
            />
            <FormPickerField
              control={form.control}
              name="column"
              label="Field"
              options={(source?.schema ?? []).map((field) => ({
                value: field.name,
                label: field.name,
              }))}
              required
            />
            {operation === 'cast' ? (
              <FormPickerField
                control={form.control}
                name="target"
                label="New type"
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'number', label: 'Number' },
                  { value: 'date', label: 'Date and time' },
                  { value: 'boolean', label: 'True/false' },
                ]}
                required
              />
            ) : operation === 'fill_missing' ? (
              <FormPickerField
                control={form.control}
                name="strategy"
                label="Fill strategy"
                options={[
                  { value: 'value', label: 'Fixed value' },
                  { value: 'mean', label: 'Mean' },
                  { value: 'median', label: 'Median' },
                  { value: 'mode', label: 'Most common' },
                  { value: 'forward', label: 'Previous value' },
                  { value: 'backward', label: 'Next value' },
                ]}
              />
            ) : operation === 'replace' ? (
              <div className="grid grid-cols-2 gap-2">
                <FormTextField
                  control={form.control}
                  name="target"
                  label="Find value"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="value"
                  label="Replacement"
                  required
                />
              </div>
            ) : operation !== 'drop_columns' ? (
              <FormTextField
                control={form.control}
                name="target"
                label="New field name"
                required
              />
            ) : (
              <div />
            )}
            {operation === 'fill_missing' &&
              form.watch('strategy') === 'value' && (
                <FormTextField
                  control={form.control}
                  name="value"
                  label="Fill value"
                  required
                />
              )}
            <Button type="submit" className="sm:col-span-2">
              Add step
            </Button>
          </form>
        </Form>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-3 rounded-xl border p-3 text-sm"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="w-6 text-muted-foreground">{index + 1}</span>
              <span className="flex-1">
                <strong>{step.operation.replaceAll('_', ' ')}</strong> ·{' '}
                {step.column}
                {step.target ? ` → ${step.target}` : ''}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  setSteps((current) =>
                    current.filter((item) => item.id !== step.id)
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {!steps.length && (
            <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Add preparation steps in the order they should run.
            </p>
          )}
        </div>
        <Button
          onClick={() => void apply()}
          disabled={!source || prepare.isPending}
        >
          {prepare.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Apply and profile
        </Button>
      </DialogContent>
    </Dialog>
  );
}
