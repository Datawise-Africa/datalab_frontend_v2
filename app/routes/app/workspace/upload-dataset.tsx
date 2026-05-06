import { useNavigate, useParams } from 'react-router';
import type { Route } from './+types/upload-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import {
  useDatasetCategories,
  useLicenses,
  useCountries,
} from '~/features/metadata';
import { useAppSelector } from '~/store';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';
import { DatasetForm } from '~/components/forms';
import { useCreateMyDataset } from '~/features/my-datasets';
import { useWorkspace } from '~/features/workspaces';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Create Dataset',
    description: 'Add a dataset to your workspace',
  });
}

export default function WorkspaceUploadDataset() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const { data: workspace } = useWorkspace(workspaceId!);
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
    workspace: workspaceId,
    origin_region: [],
    tags: [],
    authors: user ? [{ user: user.id, role: 'creator' }] : [],
    access: { access_type: 'public', access_instructions: '' },
    datasheet: undefined,
  };

  const handleSubmit = async (data: UploadDatasetFormValues) => {
    const { dataset_image, ...rest } = data;
    const payload: Record<string, unknown> = {
      ...rest,
      workspace: workspaceId,
      origin_region: data.origin_region.join(','),
    };
    if (dataset_image) payload.dataset_image = dataset_image;

    await createDataset.mutateAsync(payload as never, {
      onSuccess: () => {
        navigate(`/app/workspaces/${workspaceId}/datasets`);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create Dataset</h2>
        <p className="text-sm text-muted-foreground">
          This dataset will be scoped to
          {workspace ? ` "${workspace.name}"` : ' this workspace'}.
        </p>
      </div>

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
  );
}
