import { useParams } from 'react-router';
import { ViewDatasetView } from '~/routes/app/view-dataset';

export default function WorkspaceViewDataset() {
  const { id: workspaceId, datasetId } = useParams<{
    id: string;
    datasetId: string;
  }>();
  return (
    <ViewDatasetView
      datasetId={datasetId!}
      workspaceIdOverride={workspaceId ?? null}
      hideBack
    />
  );
}
