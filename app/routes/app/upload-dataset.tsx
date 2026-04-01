import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from './+types/upload-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import {
  MultiStepForm,
  type StepConfig,
} from '~/components/ui/multi-step-form';
import { Form } from '~/components/ui/form';
import { Info, UserPlus, Globe, ShieldCheck } from 'lucide-react';
import { useDatasetCategories, useLicenses } from '~/features/metadata';
import { useCreateDataset } from '~/features/datasets';
import { useAppSelector } from '~/store';
import { createDatasetSchema } from '~/lib/schema/upload-dataset-schema';
import {
  StepBasicInfo,
  StepAuthorsAccess,
  StepDiscovery,
  StepReview,
  uploadFormSchema,
  type UploadFormValues,
} from '~/components/upload-dataset-steps';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Create Dataset',
    description: 'Create a new dataset on Datalab Africa',
  });
}

export default function UploadDataset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const user = useAppSelector((s) => s.auth.user);

  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const createDataset = useCreateDataset();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      name: '',
      description: '',
      dataset_type: 'tabular',
      category: '',
      license: '',
      is_premium: false,
      is_private: false,
      dataset_image: '',
      workspace: workspaceId ?? undefined,
      tags: [],
      authors: user ? [{ user: user.id, role: 'creator' }] : [],
      access: { access_type: 'public', access_instructions: '' },
      datasheet: undefined,
    },
  });

  const handleCreateDataset = (data: UploadFormValues) => {
    // Parse with the API schema to coerce category/license strings to numbers
    const payload = createDatasetSchema.parse(data);
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    createDataset.mutate(formData, {
      onSuccess: (result) => {
        navigate(
          workspaceId
            ? `/app/workspaces/${workspaceId}`
            : `/datasets/${result.id}`
        );
      },
    });
  };

  const steps: StepConfig[] = [
    { key: 'basic', label: 'Basic Info', icon: Info },
    { key: 'authors', label: 'Authors & Access', icon: UserPlus },
    { key: 'discovery', label: 'Tags & Docs', icon: Globe },
    { key: 'review', label: 'Review', icon: ShieldCheck },
  ];

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-1">Create Dataset</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Set up your dataset in {steps.length} steps. You&apos;ll upload files
          after creating a version.
        </p>

        {workspaceId && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <span className="font-medium text-primary">Workspace upload</span>
            <span className="text-muted-foreground">
              {' '}
              — This dataset will be added to your workspace.
            </span>
          </div>
        )}

        <Form {...form}>
          <MultiStepForm
            steps={steps}
            onSubmit={() => form.handleSubmit(handleCreateDataset)()}
            isSubmitting={createDataset.isPending}
            submitLabel="Create Dataset"
            error={
              createDataset.isError
                ? 'Failed to create dataset. Please try again.'
                : undefined
            }
          >
            {(step) => {
              switch (step.key) {
                case 'basic':
                  return (
                    <StepBasicInfo
                      categories={categories}
                      licenses={licenses}
                    />
                  );
                case 'authors':
                  return <StepAuthorsAccess />;
                case 'discovery':
                  return <StepDiscovery />;
                case 'review':
                  return <StepReview />;
                default:
                  return null;
              }
            }}
          </MultiStepForm>
        </Form>
      </div>
    </Protect>
  );
}
