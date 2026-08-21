import { useNavigate, useSearchParams } from 'react-router';
import type { Route } from './+types/upload-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import {
  useDatasetCategories,
  useLicenses,
  useCountries,
} from '~/features/metadata';
import { useAppSelector } from '~/store';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';
import { DatasetForm } from '~/components/forms';
import { useCreateMyDataset } from '~/features/my-datasets';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Create Dataset',
    description: 'Create a new dataset on Datalab',
  });
}

export default function UploadDataset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const user = useAppSelector((s) => s.auth.user);

  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const { data: countries } = useCountries();
  const createDataset = useCreateMyDataset();

  const defaultValues: UploadDatasetFormValues = {
    name: '',
    description: '',
    dataset_type: 'tabular',
    category: '',
    license: '',
    is_premium: false,
    is_private: false,
    price: null,
    dataset_image: null,
    workspace: workspaceId ?? undefined,
    origin_region: [],
    tags: [],
    authors: user ? [{ user: user.id, role: 'creator' }] : [],
    access: { access_type: 'public', access_instructions: '' },
    datasheet: undefined,
    doi: '',
    doi_option: 'none',
  };

  const handleSubmit = async (data: UploadDatasetFormValues) => {
    const { dataset_image, ...rest } = data;
    const payload: Record<string, unknown> = {
      ...rest,
      origin_region: data.origin_region.join(','),
    };
    if (dataset_image) payload.dataset_image = dataset_image;

    await createDataset.mutateAsync(payload as never, {
      onSuccess: () => {
        navigate('/app/creator-dashboard');
      },
    });
  };

  return (
    <Protect roles={['creator', 'admin']}>
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
          categories={categories?.data ?? []}
          licenses={licenses?.data ?? []}
          countries={countries ?? []}
        />
      </div>
    </Protect>
  );
}
