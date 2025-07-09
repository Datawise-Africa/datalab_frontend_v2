import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';
import useApi from './use-api';

export function useDatasetViewTracker(datasetId: string) {
  const hasTrackedView = useRef(false);
  const startTime = useRef<number>(Date.now());
  const auth = useAuth();
  const { privateApi, publicApi } = useApi();
  const api = auth?.isAuthenticated ? privateApi : publicApi;

  function updateViewCount(datasetId: string) {
    return api.post(
      `/data/datasets/${datasetId}/track_view/`,
      {
        dataset_id: auth?.isAuthenticated ? datasetId : null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const viewMutation = useMutation({
    mutationFn: () => updateViewCount(datasetId),
    onSuccess: () => {
      console.log('View count updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update view count:', error);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        viewMutation.mutate();
      }
    }, 30000); // 30 seconds

    // Cleanup timer on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [viewMutation]);

  // Track when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime.current;
      if (timeSpent >= 30000 && !hasTrackedView.current) {
        hasTrackedView.current = true;
        // Use sendBeacon for reliable tracking on page unload
        navigator.sendBeacon(
          `/api/datasets/${datasetId}/views`,
          JSON.stringify({}),
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [datasetId]);

  return {
    isTracking: !hasTrackedView.current,
    hasTracked: hasTrackedView.current,
  };
}
