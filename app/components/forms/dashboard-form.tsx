import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Form } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import {
  FormTextField,
  FormTextareaField,
  FormSelectField,
} from '~/components/form-fields';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import {
  createDashboardSchema,
  type CreateDashboardFormValues,
} from '~/lib/schema/dashboard-schema';

export type DashboardFormMode = 'create' | 'edit';

type DashboardFormProps = {
  mode: DashboardFormMode;
  defaultValues: CreateDashboardFormValues;
  onSubmit: (data: CreateDashboardFormValues) => Promise<void> | void;
  isSubmitting: boolean;
  error?: string;
  categories?: ReadonlyArray<{ id: string; name: string }>;
};

export function DashboardForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  error,
  categories = [],
}: Readonly<DashboardFormProps>) {
  const form = useForm({
    resolver: zodResolver(createDashboardSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <FormTextField
          control={form.control}
          name="title"
          label="Title"
          placeholder="My Dashboard"
          required
        />

        <FormTextareaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="What does this dashboard visualize?"
          rows={3}
        />

        <FormTextField
          control={form.control}
          name="dashboard_url"
          label="Dashboard URL"
          placeholder="https://..."
          required
        />

        {categoryOptions.length > 0 && (
          <FormSelectField
            control={form.control}
            name="category"
            label="Category"
            options={categoryOptions}
          />
        )}

        <div className="flex items-start gap-3">
          <Checkbox
            id="dashboard-public"
            checked={form.watch('is_public') === true}
            onCheckedChange={(checked) =>
              form.setValue('is_public', Boolean(checked))
            }
          />
          <Label
            htmlFor="dashboard-public"
            className="text-sm font-normal leading-relaxed cursor-pointer"
          >
            Make this dashboard public
            <span className="block text-xs text-muted-foreground">
              Public dashboards are visible to anyone with the link.
            </span>
          </Label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create Dashboard' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
