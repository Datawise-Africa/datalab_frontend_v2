import { useNavigate, Link } from 'react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import {
  useDatasetCategories,
  useLicenses,
  useCountries,
} from '~/features/metadata';
import type { UploadDatasetFormValues } from '~/components/upload-dataset-steps';
import { DatasetForm } from '~/components/forms';
import { useMyDataset, useUpdateMyDataset } from '~/features/my-datasets';
import {
  useWorkspaceDataset,
  useUpdateWorkspaceDataset,
} from '~/features/workspaces';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import { getWorkspaceId } from '~/features/my-datasets/types';
import {
  backHrefFor,
  previewHrefFor,
  type PreviewContext,
} from './preview-context';

type Props = Readonly<{
  datasetId: string;
  context: PreviewContext;
}>;

function useDatasetForContext(context: PreviewContext, datasetId: string) {
  const isWorkspace = context.kind === 'workspace';
  const workspaceId = isWorkspace ? context.workspaceId : '';
  const personal = useMyDataset(isWorkspace ? '' : datasetId);
  const workspace = useWorkspaceDataset(
    workspaceId,
    isWorkspace ? datasetId : ''
  );
  return isWorkspace ? workspace : personal;
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
    price: dataset.price ?? null,
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

export function DatasetEditView({ datasetId, context }: Props) {
  const navigate = useNavigate();
  const isWorkspace = context.kind === 'workspace';
  const { data: dataset, isLoading } = useDatasetForContext(context, datasetId);
  const { data: categories } = useDatasetCategories();
  const { data: licenses } = useLicenses();
  const { data: countries } = useCountries();
  const personalUpdate = useUpdateMyDataset();
  const workspaceUpdate = useUpdateWorkspaceDataset(
    isWorkspace ? context.workspaceId : ''
  );
  const updateDataset = isWorkspace ? workspaceUpdate : personalUpdate;

  const backHref = backHrefFor(context);

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
          navigate(previewHrefFor(context, datasetId));
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
