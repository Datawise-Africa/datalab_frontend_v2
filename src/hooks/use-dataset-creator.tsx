import type {
  BecomeDatasetCreatorType,
  PaginatedGetBecomeDatasetCreatorResponse,
} from '@/lib/types/dataset-creator';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useApi from './use-api';
import type { BecomeDatasetCreatorSchema } from '@/lib/schema/become-dataset-creator-schema';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useAuth } from '@/context/AuthProvider';
import { AuthPerm } from '@/lib/auth/perm';
type Props = {
  shouldFetch?: boolean;
};

type DatasetCreatorStatus =
  | Pick<
      PaginatedGetBecomeDatasetCreatorResponse['data'][number],
      'status'
    >['status']
  | 'N/A'
  | 'Confirmed';
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
  const authPerm = AuthPerm.getInstance();
  const auth = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);
  const api = useApi().privateApi;
  const [data, setData] = React.useState<
    PaginatedGetBecomeDatasetCreatorResponse['data']
  >([]);
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] =
    React.useState(false);
  const [selectedApplicantID, setSelectedApplicantID] = useState<number | null>(
    null,
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PaginatedGetBecomeDatasetCreatorResponse>(
        '/users/become-dataset-creator/',
      );
      if (Array.isArray(response.data.data)) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(extractCorrectErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated]);
  const refreshData = useCallback(async () => {
    if (auth.isAuthenticated) {
      await fetchData();
    }
  }, [auth.isAuthenticated, fetchData]);
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
    if (!shouldFetch || !auth.isAuthenticated) return;
    fetchData();
  }, [fetchData, shouldFetch]);

  const handleChangeStatus = async (
    id: number,
    status: BecomeDatasetCreatorType['status'],
  ) => {
    setIsStatusUpdateLoading(true);
    try {
      // const response =
      await api.put(`/users/become-dataset-creator/${id}/ `);
      setData(
        data.map((applicant) =>
          applicant.id === id ? { ...applicant, status: status } : applicant,
        ),
      );
    } catch (error) {
      console.error(extractCorrectErrorMessage(error));
    } finally {
      setIsStatusUpdateLoading(false);
    }
  };
  const currentStatus = React.useMemo<DatasetCreatorStatus>(() => {
    if (!data || data.length === 0) {
      return 'N/A';
    }
    if (
      data[0].status === 'Approved' ||
      (auth.isAuthenticated &&
        authPerm.hasAnyPermission(
          ['dataset_creator', 'admin'],
          auth.state.userRole,
        ))
    ) {
      return 'Confirmed';
    }
    return data[0].status || 'N/A';
  }, [data, auth.isAuthenticated, authPerm, auth.state.userRole, data]);

  const selectedApplicant = useMemo(() => {
    return selectedApplicantID
      ? data.find(function (applicant) {
          return applicant.id === selectedApplicantID;
        })
      : null;
  }, [selectedApplicantID, data]);
  return {
    createDatasetCreator,
    isLoading,
    data,
    currentStatus,
    refreshData,
    handleChangeStatus,
    isStatusUpdateLoading,
    selectedApplicant,
    setSelectedApplicantID,
  };
}
