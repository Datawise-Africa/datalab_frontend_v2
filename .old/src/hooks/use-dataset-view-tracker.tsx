import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/store/auth-store';
import { useAxios } from './use-axios';

export function useDatasetViewTracker(datasetId: string) {
  /**Timeout Duration was initially 30s Now 5s */
  const TIMEOUT_DURATION = 5000; // 5 seconds
  const hasTrackedView = useRef(false);
  const startTime = useRef<number>(Date.now());
  const auth = useAuth();
  const axiosClient = useAxios();

  function updateViewCount(datasetId: string) {
    return axiosClient.post(
      `/data/datasets/${datasetId}/track_view/`,
      {
        dataset_id: auth?.is_authenticated ? datasetId : null,
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
      // console.log('View count updated successfully');
    },
    onError: () => {
      // console.error('Failed to update view count:', error);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        viewMutation.mutate();
      }
    }, TIMEOUT_DURATION);

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
