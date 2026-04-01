import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/upload-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { useDatasetCategories, useLicenses } from '~/features/metadata';
import { useCreateDataset } from '~/features/datasets';
import { useAppSelector } from '~/store';
import { DatasetForm } from '~/components/dataset-form';
import type { UploadFormValues } from '~/components/upload-dataset-steps';

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

  const defaultValues: UploadFormValues = {
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
    authors: user ? [{ user: user.first_name, role: 'creator' }] : [],
    access: { access_type: 'public', access_instructions: '' },
    datasheet: undefined,
  };

  const handleSubmit = async (data: UploadFormValues) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    await createDataset.mutateAsync(formData, {
      onSuccess: (result) => {
        navigate(
          workspaceId
            ? `/app/workspaces/${workspaceId}`
            : `/datasets/${result.id}`
        );
      },
    });
  };

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div>
        <h1 className="text-2xl font-bold mb-1">Create Dataset</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Set up your dataset in 4 steps. You&apos;ll upload files after
          creating a version.
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

        <DatasetForm
          mode="create"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={createDataset.isPending}
          error={
            createDataset.isError
              ? 'Failed to create dataset. Please try again.'
              : undefined
          }
          categories={categories}
          licenses={licenses}
        />
      </div>
    </Protect>
  );
}
