import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { Form } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import {
  FormTextField,
  FormTextareaField,
  FormPickerField,
  FormTagInputField,
  FormCheckboxField,
} from '~/components/form-fields';
import { Label } from '~/components/ui/label';
import { DropZone } from '~/components/ui/drop-zone';
import { useFileUpload } from '~/hooks/use-file-upload';
import {
  createDashboardSchema,
  type CreateDashboardFormValues,
} from '~/lib/schema/dashboard-schema';
import { resolveMediaUrl } from '~/lib/utils/media-url';

export type DashboardFormMode = 'create' | 'edit';

type DashboardFormProps = {
  mode: DashboardFormMode;
  defaultValues: CreateDashboardFormValues;
  onSubmit: (data: CreateDashboardFormValues) => Promise<void> | void;
  isSubmitting: boolean;
  error?: string;
  categories?: ReadonlyArray<{ id: string; name: string }>;
};

const statusOptions = [
  { label: 'Draft', value: 'DF' },
  { label: 'Published', value: 'PB' },
  { label: 'Archived', value: 'AR' },
];

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
    // In edit mode defaultValues may arrive after mount (async load).
    // `values` forces RHF to sync whenever the prop reference changes.
    values: defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const thumbnail = form.watch('thumbnail');
  const builderMode = form.watch('builder_mode');
  const {
    addFiles,
    files,
    error: thumbnailError,
  } = useFileUpload({
    multiple: false,
    output: 'base64',
    preview: true,
    maxSizeBytes: 2 * 1024 * 1024,
    accept: ['image/*'],
  });

  // Only update thumbnail when the user actually adds a new file.
  // (useFileUpload fires onFileChange on mount with an empty list — which would
  // clobber a pre-loaded thumbnail URL in edit mode.)
  const newBase64 = files[0]?.data as string | undefined;
  useEffect(() => {
    if (newBase64) {
      form.setValue('thumbnail', newBase64, { shouldDirty: true });
    }
  }, [newBase64, form]);

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

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => form.setValue('builder_mode', 'native')}
            className={`rounded-xl border p-4 text-left transition ${builderMode === 'native' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/40'}`}
          >
            <span className="block font-semibold">Build in Datalab</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Connect data, analyse it and create an interactive dashboard.
            </span>
          </button>
          <button
            type="button"
            onClick={() => form.setValue('builder_mode', 'external')}
            className={`rounded-xl border p-4 text-left transition ${builderMode === 'external' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/40'}`}
          >
            <span className="block font-semibold">Embed another tool</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Keep using Power BI, Tableau, Flourish or another provider.
            </span>
          </button>
        </div>

        {builderMode === 'external' && (
          <FormTextField
            control={form.control}
            name="dashboard_url"
            label="Dashboard embed URL"
            placeholder="https://..."
            required
          />
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">Thumbnail</Label>
          {thumbnail ? (
            <div className="relative inline-flex items-start gap-3 rounded-md border p-3">
              <img
                src={resolveMediaUrl(thumbnail) ?? undefined}
                alt="Dashboard thumbnail preview"
                className="h-24 w-40 rounded-md object-cover"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  form.setValue('thumbnail', null, { shouldDirty: true })
                }
                className="text-destructive hover:text-destructive"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          ) : (
            <DropZone
              onFiles={addFiles}
              accept="image/*"
              hint="PNG, JPG, or WebP — max 2 MB"
            />
          )}
          {thumbnailError && (
            <p className="text-xs text-destructive">{thumbnailError}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormPickerField
            control={form.control}
            name="category"
            label="Category"
            placeholder={
              categoryOptions.length > 0
                ? 'Select a category'
                : 'No categories available yet'
            }
            options={categoryOptions}
          />

          <FormPickerField
            control={form.control}
            name="status"
            label="Status"
            options={statusOptions}
          />
        </div>

        <FormTagInputField
          control={form.control}
          name="tags"
          label="Tags"
          placeholder="Add a tag and press Enter"
        />

        <FormCheckboxField
          control={form.control}
          name="is_public"
          label="Make this dashboard public"
          description="Public dashboards are visible to anyone with the link."
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' && builderMode === 'native'
              ? 'Create & open Studio'
              : mode === 'create'
                ? 'Create Dashboard'
                : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
