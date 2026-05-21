import { useParams } from 'react-router';
import type { Route } from './+types/view-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { DatasetPreviewView } from '~/components/dataset-preview/dataset-preview-view';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'View Dataset',
    description: 'View dataset details',
  });
}

export default function ViewDataset() {
  const { id: datasetId } = useParams() as { id: string };
  return (
    <DatasetPreviewView datasetId={datasetId} context={{ kind: 'personal' }} />
  );
}
