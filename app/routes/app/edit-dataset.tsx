import { useNavigate, useParams, useSearchParams, Link } from 'react-router';
import type { Route } from './+types/edit-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  useDatasetCategories,
  useLicenses,
  useCountries,
} from '~/features/metadata';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';
import { DatasetForm } from '~/components/forms';
import { useMyDataset, useUpdateMyDataset } from '~/features/my-datasets';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import { getWorkspaceId } from '~/features/my-datasets/types';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dataset',
    description: 'Edit an existing dataset on Datalab Africa',
  });
}

function mapDatasetToFormValues(
  dataset: MyDatasetInterface
): UploadDatasetFormValues {
  return {
    name: dataset.name,
    description: dataset.description,
    dataset_type: dataset.dataset_type,
    category: dataset.category?.id ?? '',
    license: dataset.license?.id ?? '',
    is_premium: dataset.is_premium,
    is_private: dataset.is_private,
    origin_region: dataset.origin_region
      ? dataset.origin_region
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean)
      : [],
    dataset_image: dataset.dataset_image ?? null,
    workspace: getWorkspaceId(dataset.workspace) ?? undefined,
    tags: dataset.tags ?? [],
    authors: dataset.authors.map((a) => ({
      user: a.user.id,
      role: a.role,
    })),
    access: {
      access_type: (dataset.access?.access_type ?? 'public') as
        | 'public'
        | 'restricted'
        | 'private',
      access_instructions: dataset.access?.access_instructions ?? '',
    },
    datasheet: dataset.datasheet
      ? {
          motivation: dataset.datasheet.motivation ?? '',
          composition: dataset.datasheet.composition ?? '',
          collection_process: dataset.datasheet.collection_process ?? '',
          preprocessing: dataset.datasheet.preprocessing ?? '',
          uses: dataset.datasheet.uses ?? '',
          distribution: dataset.datasheet.distribution ?? '',
          maintenance: dataset.datasheet.maintenance ?? '',
        }
      : undefined,
  };
}

export default function EditDataset() {
  const { id: datasetId } = useParams() as { id: string };
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: dataset, isLoading } = useMyDataset(datasetId);
  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const { data: countries } = useCountries();
  const updateDataset = useUpdateMyDataset();

  const workspaceId =
    searchParams.get('workspace') ?? getWorkspaceId(dataset?.workspace) ?? null;
  const backHref = workspaceId
    ? `/app/workspaces/${workspaceId}/datasets`
    : '/app/creator-dashboard';

  const handleSubmit = async (data: UploadDatasetFormValues) => {
    const { dataset_image, ...rest } = data;
    const payload: Record<string, unknown> = {
      ...rest,
      origin_region: data.origin_region.join(','),
    };

    // Only send dataset_image when it changed: a new base64 upload, or
    // explicit removal. Skip when unchanged to avoid clobbering existing URL.
    const isDataUrl =
      typeof dataset_image === 'string' && dataset_image.startsWith('data:');
    const originalImage = dataset?.dataset_image ?? null;
    if (isDataUrl || dataset_image === null) {
      if (dataset_image !== originalImage) {
        payload.dataset_image = dataset_image;
      }
    }

    await updateDataset.mutateAsync(
      { id: datasetId, input: payload as never },
      {
        onSuccess: () => {
          const previewHref = workspaceId
            ? `/app/view-dataset/${datasetId}?workspace=${workspaceId}`
            : `/app/view-dataset/${datasetId}`;
          navigate(previewHref);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Protect roles={['creator', 'admin']}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading dataset...</span>
        </div>
      </Protect>
    );
  }

  if (!dataset) {
    return (
      <Protect roles={['creator', 'admin']}>
        <div className="py-20 text-center">
          <p className="text-lg font-semibold">Dataset not found</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to={backHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </Protect>
    );
  }

  return (
    <Protect roles={['creator', 'admin']}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Button asChild variant="ghost" size="sm">
            <Link to={backHref}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Dataset</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6 ml-18">
          Update &ldquo;{dataset.name}&rdquo;
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
          categories={categories?.data ?? []}
          licenses={licenses?.data ?? []}
          countries={countries ?? []}
        />
      </div>
    </Protect>
  );
}
