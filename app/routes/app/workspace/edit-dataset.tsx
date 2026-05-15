import { useParams } from 'react-router';
import { EditDatasetView } from '~/routes/app/edit-dataset';

export default function WorkspaceEditDataset() {
  const { id: workspaceId, datasetId } = useParams<{
    id: string;
    datasetId: string;
  }>();
  return (
    <EditDatasetView
      datasetId={datasetId!}
      workspaceIdOverride={workspaceId ?? null}
    />
  );
}
