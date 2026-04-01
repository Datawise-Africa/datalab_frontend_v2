import { useNavigate, useParams, Link } from 'react-router';
import type { Route } from './+types/edit-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useDatasetCategories, useLicenses } from '~/features/metadata';
import { useDataset, useUpdateDataset } from '~/features/datasets';
import { DatasetForm } from '~/components/dataset-form';
import type { UploadFormValues } from '~/components/upload-dataset-steps';
import type { IDataset } from '~/lib/types/dataset';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dataset',
    description: 'Edit an existing dataset on Datalab Africa',
  });
}

function mapDatasetToFormValues(dataset: IDataset): UploadFormValues {
  return {
    name: dataset.title,
    description: dataset.description,
    dataset_type: 'tabular',
    category: dataset.category?.id ?? 0,
    license: dataset.license?.id ?? 0,
    is_premium: dataset.is_premium,
    is_private: dataset.is_private,
    dataset_image: dataset.dataset_image ?? '',
    workspace: dataset.workspace_id ?? undefined,
    tags: dataset.tags ?? [],
    authors: dataset.authors.map((a) => ({
      user: `${a.first_name} ${a.last_name}`.trim(),
      role: 'contributor' as const,
    })),
    access: { access_type: 'public', access_instructions: '' },
    datasheet: undefined,
  };
}

export default function EditDataset() {
  const { id: datasetId } = useParams() as { id: string };
  const navigate = useNavigate();

  const { data: dataset, isLoading } = useDataset(datasetId);
  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const updateDataset = useUpdateDataset();

  const handleSubmit = async (data: UploadFormValues) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    await updateDataset.mutateAsync(
      { id: datasetId, input: formData },
      {
        onSuccess: () => {
          navigate(`/datasets/${datasetId}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Protect roles={['dataset_creator', 'admin']}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading dataset...</span>
        </div>
      </Protect>
    );
  }

  if (!dataset) {
    return (
      <Protect roles={['dataset_creator', 'admin']}>
        <div className="py-20 text-center">
          <p className="text-lg font-semibold">Dataset not found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/app/creator-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </Protect>
    );
  }

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/creator-dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Dataset</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6 ml-18">
          Update &ldquo;{dataset.title}&rdquo;
        </p>

        <DatasetForm
          mode="edit"
          defaultValues={mapDatasetToFormValues(dataset)}
          onSubmit={handleSubmit}
          isSubmitting={updateDataset.isPending}
          error={
            updateDataset.isError
              ? 'Failed to update dataset. Please try again.'
              : undefined
          }
          categories={categories}
          licenses={licenses}
        />
      </div>
    </Protect>
  );
}
