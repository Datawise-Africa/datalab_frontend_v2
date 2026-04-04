import { useEffect, useRef } from 'react';
import { apiClient } from '~/lib/api/client';

/**
 * Tracks a dataset view by calling POST /datasets/{id}/track_view/.
 * Only fires once per unique datasetId.
 */
export function useTrackView(datasetId: string | undefined) {
  const trackedId = useRef<string | null>(null);

  useEffect(() => {
    if (!datasetId || trackedId.current === datasetId) return;
    trackedId.current = datasetId;

    apiClient.post(`/datasets/${datasetId}/track_view/`).catch(() => {
      // Silently ignore tracking failures
    });
  }, [datasetId]);
}
