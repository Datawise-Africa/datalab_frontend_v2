import { datasetDownloadKeys } from '@/lib/features/dataset-download-keys';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type {
  PaginatedResponse,
  PaginationParamsInterface,
} from '@/constants/pagination';
import { useAuth } from '@/store/auth-store';
import { useAxios } from './use-axios';

export type DownloadedDatasetType = {
  id: number;
  user: string;
  dataset: {
    id: string;
    title: string;
    category: { id: number; title: string };
  };
  intended_use: string;
  project_description: string;
  download_continent: null | string;
  download_country: null | string;
  intended_audience: string;
  email_address: string;
  download_date: string;
};

export function useUserDownloadedDatasets() {
  const axiosClient = useAxios();
  const [pagination, setPagination] = useState<PaginationParamsInterface>({
    limit: 50,
    page: 1,
  });

  function updatePagination(newPagination: Partial<PaginationParamsInterface>) {
    setPagination((prev) => ({
      ...prev,
      ...newPagination,
    }));
  }
  const auth = useAuth();
  const userId = auth?.user?.user_id;


  async function fetchUserDownloadedDatasets() {
    try {
      const response = await axiosClient.get<PaginatedResponse<DownloadedDatasetType>>(
        `/data/dataset_downloads/?page=${pagination.page}&limit=${pagination.limit}`,
      );
      return response.data; // Assuming the API returns an array of downloaded datasets
    } catch (error) {
      console.error('Error fetching user downloaded datasets:', error);
      throw error; // Re-throw the error to be handled by the query
    }
  }

  const userDownloadsQuery = useQuery({
    queryKey: datasetDownloadKeys.userDownloads(userId!),
    queryFn: fetchUserDownloadedDatasets,
    enabled: !!userId, // Only run the query if userId is available
    refetchOnWindowFocus: false, // Optional: Prevent refetching on window focus
    staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes
    retry: 1, // Optional: Retry once on failure
  });
  const data = useMemo(() => {
    return userDownloadsQuery.data?.data || [];
  }, [userDownloadsQuery.data]);
  return {
    pagination: {
      pagination,
      setPagination: updatePagination,
    },
    query: {
      userDownloadsQuery,
    },
    data,
    isLoading: userDownloadsQuery.isLoading,
    isError: userDownloadsQuery.isError,
    error: userDownloadsQuery.error,
    refetch: userDownloadsQuery.refetch,
  };
}
