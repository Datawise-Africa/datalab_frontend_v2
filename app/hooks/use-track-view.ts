import { useEffect, useRef } from 'react';
import { apiClient } from '~/lib/api/client';

/**
 * Tracks a dataset view by calling POST /datasets/{id}/track-view/.
 * Only fires once per unique datasetId.
 */
export function useTrackView(datasetId: string | undefined) {
  const trackedId = useRef<string | null>(null);

  useEffect(() => {
    if (!datasetId || trackedId.current === datasetId) return;
    trackedId.current = datasetId;

    apiClient.post(`/datasets/${datasetId}/track-view/`).catch(() => {
      // Silently ignore tracking failures
    });
  }, [datasetId]);
}

/**
 * Tracks a dashboard view by calling POST /dashboards/{id}/track_views/.
 * Only fires once per unique dashboardId.
 *
 * Endpoint name differs from the dataset variant (track_views vs track-view) —
 * the backend OpenAPI spec is the source of truth.
 */
export function useTrackDashboardView(dashboardId: string | undefined) {
  const trackedId = useRef<string | null>(null);

  useEffect(() => {
    if (!dashboardId || trackedId.current === dashboardId) return;
    trackedId.current = dashboardId;

    apiClient.post(`/dashboards/${dashboardId}/track_views/`).catch(() => {
      // Silently ignore tracking failures
    });
  }, [dashboardId]);
}
