import { useParams } from 'react-router';
import type { Route } from './+types/dataset-edit';
import { generateSEOTags } from '~/lib/utils/seo';
import { DatasetEditView } from '~/components/dataset-preview/dataset-edit-view';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dataset',
    description: 'Edit an existing dataset on Datalab',
  });
}

export default function WorkspaceDatasetEdit() {
  const { id: workspaceId, datasetId } = useParams() as {
    id: string;
    datasetId: string;
  };
  return (
    <DatasetEditView
      datasetId={datasetId}
      context={{ kind: 'workspace', workspaceId }}
    />
  );
}
