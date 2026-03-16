import { useEffect, useRef } from 'react';
import { apiClient } from '~/lib/api/client';

/**
 * Tracks a dataset view by calling POST /data/datasets/{id}/track_view/.
 * Only fires once per mount.
 */
export function useTrackView(datasetId: string | undefined) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!datasetId || tracked.current) return;
    tracked.current = true;

    apiClient.post(`/data/datasets/${datasetId}/track_view/`).catch(() => {
      // Silently ignore tracking failures
    });
  }, [datasetId]);
}
