import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Form } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import {
  FormTextField,
  FormTextareaField,
  FormSelectField,
  FormTagInputField,
  FormCheckboxField,
} from '~/components/form-fields';
import {
  reportResolver,
  type ReportFormValues,
} from '~/lib/schema/report-schema';
import { useReportCategories } from '~/features/report-categories';

export type ReportFormMode = 'create' | 'edit';

interface ReportFormProps {
  mode: ReportFormMode;
  defaultValues: ReportFormValues;
  onSubmit: (data: ReportFormValues) => Promise<void> | void;
  isSubmitting: boolean;
  onCancel?: () => void;
  /** When set, the report is pinned to this workspace and no picker is shown. */
  lockedWorkspaceId?: string;
}

const reportTypeOptions = [
  { value: 'research_paper', label: 'Research Paper' },
  { value: 'market_report', label: 'Market Report' },
  { value: 'climate_assessment', label: 'Climate Assessment' },
  { value: 'policy_brief', label: 'Policy Brief' },
  { value: 'technical_report', label: 'Technical Report' },
  { value: 'white_paper', label: 'White Paper' },
  { value: 'other', label: 'Other' },
];

const accessTypeOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'restricted', label: 'Restricted' },
];

export function ReportForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  onCancel,
  lockedWorkspaceId,
}: Readonly<ReportFormProps>) {
  const form = useForm({
    resolver: reportResolver,
    defaultValues: lockedWorkspaceId
      ? { ...defaultValues, workspace: lockedWorkspaceId }
      : defaultValues,
  });

  // Categories are a small bounded set; one page covers the picker.
  const { data: categoriesResponse } = useReportCategories({ limit: 100 });
  const categoryOptions = (categoriesResponse?.data ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const isPremium = form.watch('is_premium');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormTextField
          control={form.control}
          name="title"
          label="Title"
          placeholder="e.g. Kenya Climate Resilience 2026"
          required
        />

        <FormTextareaField
          control={form.control}
          name="abstract"
          label="Abstract"
          placeholder="A short summary of the report's findings"
          rows={3}
        />

        <FormTextareaField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Fuller description of scope and methodology"
          rows={4}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelectField
            control={form.control}
            name="report_type"
            label="Report type"
            options={reportTypeOptions}
            required
          />
          <FormSelectField
            control={form.control}
            name="category"
            label="Category"
            options={categoryOptions}
            placeholder="Select a category"
            emptyText="No categories yet"
          />
        </div>

        <FormSelectField
          control={form.control}
          name="access_type"
          label="Access"
          options={accessTypeOptions}
          placeholder="Who can access this report"
        />

        <FormTagInputField
          control={form.control}
          name="tags"
          label="Tags"
          placeholder="Add a tag and press Enter"
        />

        <FormCheckboxField
          control={form.control}
          name="is_private"
          label="Keep this report private"
          description="Private reports are not listed publicly."
        />

        <FormCheckboxField
          control={form.control}
          name="is_premium"
          label="Premium report"
          description="Premium reports require payment before download."
        />

        {isPremium && (
          <FormTextField
            control={form.control}
            name="price"
            label="Price"
            placeholder="0.00"
          />
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Create report' : 'Save changes'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
