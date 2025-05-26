import type { PaginatedGetBecomeDatasetCreatorResponse } from '@/lib/types/dataset-creator';
import React, { useCallback, useEffect } from 'react';
import useApi from './use-api';
import type { BecomeDatasetCreatorSchema } from '@/lib/schema/become-dataset-creator-schema';
import { extractCorrectErrorMessage } from '@/lib/error';
type Props = {
  shouldFetch?: boolean;
};

type DatasetCreatorStatus =
  | Pick<
      PaginatedGetBecomeDatasetCreatorResponse['docs'][number],
      'status'
    >['status']
  | 'N/A';
/**
 * A hook for managing dataset creator data and operations.
 * This hook handles fetching dataset creator information, creating new dataset creator requests,
 * and tracking the current status of dataset creator applications.
 *
 * @param {Object} props - The hook configuration options
 * @param {boolean} [props.shouldFetch=true] - Whether to automatically fetch dataset creator data on mount
 *
 * @returns {Object} The dataset creator state and actions
 * @returns {function(BecomeDatasetCreatorSchema): Promise<any>} returns.createDatasetCreator - Function to submit a dataset creator application
 * @returns {boolean} returns.isLoading - Loading state flag for API operations
 * @returns {Array<PaginatedGetBecomeDatasetCreatorResponse['docs'][number]>} returns.data - Raw dataset creator data
 * @returns {DatasetCreatorStatus} returns.currentStatus - Current status of the dataset creator application
 */
export default function useDatasetCreator(
  { shouldFetch }: Props = { shouldFetch: true },
) {
  const [isLoading, setIsLoading] = React.useState(false);
  const api = useApi().privateApi;
  const [data, setData] = React.useState<
    PaginatedGetBecomeDatasetCreatorResponse['docs']
  >([]);
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PaginatedGetBecomeDatasetCreatorResponse>(
        '/users/become-dataset-creator/',
      );
      if (Array.isArray(response.data.docs)) {
        setData(response.data.docs);
      }
    } catch (error) {
      console.error(extractCorrectErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDatasetCreator = useCallback(
    async (data: BecomeDatasetCreatorSchema) => {
      setIsLoading(true);
      try {
        const response = await api.post('/users/become-dataset-creator/', data);
        return response.data;
      } catch (error) {
        console.error(extractCorrectErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );
  useEffect(() => {
    if (!shouldFetch) return;
    fetchData();
  }, [fetchData, shouldFetch]);

  const currentStatus = React.useMemo(() => {
    return (data.length === 0 ? 'N/A' : data[0].status) as DatasetCreatorStatus;
  }, [data]);
  return {
    createDatasetCreator,
    isLoading,
    data,
    currentStatus,
  };
}
