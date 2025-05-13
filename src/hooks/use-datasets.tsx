import type { IDataset } from '@/lib/types/data-set';
import apiService from '@/services/apiService';
import  { useCallback, useEffect, useState } from 'react';

export default function useDatasets() {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDatasets = useCallback(async () => {
    try {
      const response = await apiService.get<IDataset[]>('/data/local/');
      setDatasets(response);
    } catch (error) {
      console.log('Failed to fetch datasets', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Fetch data based on filters
  useEffect(() => {
    fetchDatasets();
  }, []);
  return {
    datasets,
    isLoading,
  };
}
