import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MultiStepForm,
  type StepConfig,
} from '~/components/ui/multi-step-form';
import { Form } from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Info, Loader2, UserPlus, Globe, ShieldCheck } from 'lucide-react';
import {
  StepBasicInfo,
  StepAuthorsAccess,
  StepDiscovery,
  StepReview,
  uploadDatasetFormSchema,
  type UploadDatasetFormValues,
} from '~/components/upload-dataset-steps';

export type DatasetFormMode = 'create' | 'edit';

type DatasetFormProps = {
  mode: DatasetFormMode;
  defaultValues: UploadDatasetFormValues;
  onSubmit: (data: UploadDatasetFormValues) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
  categories?: ReadonlyArray<{ id: string; name: string }>;
  licenses?: ReadonlyArray<{ id: string; name: string }>;
  countries?: ReadonlyArray<{ name: string }>;
};

const STEPS: StepConfig[] = [
  { key: 'basic', label: 'Basic Info', icon: Info },
  { key: 'authors', label: 'Authors & Access', icon: UserPlus },
  { key: 'discovery', label: 'Tags & Docs', icon: Globe },
  { key: 'review', label: 'Review', icon: ShieldCheck },
];

export function DatasetForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  error,
  categories,
  licenses,
  countries,
}: Readonly<DatasetFormProps>) {
  const form = useForm({
    resolver: zodResolver(uploadDatasetFormSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const isEdit = mode === 'edit';
  const submitLabel = isEdit ? 'Update Dataset' : 'Create Dataset';

  if (isEdit) {
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
          <StepBasicInfo
            categories={categories}
            licenses={licenses}
            countries={countries}
          />
          <Separator />
          <StepAuthorsAccess />
          <Separator />
          <StepDiscovery />

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <MultiStepForm
        steps={STEPS}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        error={error}
      >
        {(step) => {
          switch (step.key) {
            case 'basic':
              return (
                <StepBasicInfo
                  categories={categories}
                  licenses={licenses}
                  countries={countries}
                />
              );
            case 'authors':
              return <StepAuthorsAccess />;
            case 'discovery':
              return <StepDiscovery />;
            case 'review':
              return <StepReview mode={mode} />;
            default:
              return null;
          }
        }}
      </MultiStepForm>
    </Form>
  );
}
