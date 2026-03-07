import type { IEdukenDataStructure } from '@/lib/types/edu-ken';
import { useCallback, useEffect, useState } from 'react';
import { useAxios } from './use-axios';

export function useEduData() {
  const [countyData, setCountyData] = useState<IEdukenDataStructure | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const axiosClient = useAxios();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // const response = await fetch(
      //   `${REACT_PUBLIC_API_HOST}/data/edu_dashboard_data/`,
      // );
      const { data } = await axiosClient.get<IEdukenDataStructure>(
        '/data/edu_dashboard_data/',
      );
      // const data: IEdukenDataStructure = await response.json();

      const uppercasedData = {
        ...data,
        qualifications_per_county: Object.fromEntries(
          Object.entries(data.qualifications_per_county).map(
            ([county, qualifications]) => [
              county.toUpperCase(),
              qualifications,
            ],
          ),
        ),
        institutions_per_county: Object.fromEntries(
          Object.entries(data.institutions_per_county).map(
            ([county, institutions]) => [county.toUpperCase(), institutions],
          ),
        ),
        categories_per_county: Object.fromEntries(
          Object.entries(data.categories_per_county).map(
            ([county, categories]) => [county.toUpperCase(), categories],
          ),
        ),
      };
      setCountyData(uppercasedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return {
    countyData,
    isLoading,
  };
}
