import { useParams } from 'react-router';
import type { Route } from './+types/edit-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { DatasetEditView } from '~/components/dataset-preview/dataset-edit-view';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dataset',
    description: 'Edit an existing dataset on Datalab',
  });
}

export default function EditDataset() {
  const { id: datasetId } = useParams() as { id: string };
  return (
    <DatasetEditView datasetId={datasetId} context={{ kind: 'personal' }} />
  );
}
