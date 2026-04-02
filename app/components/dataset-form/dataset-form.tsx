import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MultiStepForm,
  type StepConfig,
} from '~/components/ui/multi-step-form';
import { Form } from '~/components/ui/form';
import { Info, UserPlus, Globe, ShieldCheck } from 'lucide-react';
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
                <StepBasicInfo categories={categories} licenses={licenses} />
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
