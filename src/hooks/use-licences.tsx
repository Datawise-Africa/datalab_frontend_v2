import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import useApi from './use-api';
import { extractCorrectErrorMessage } from '@/lib/error';
import { licenceQueryKeys } from '@/lib/features/licences-keys';

export interface ILicence {
  id: number;
  license_type: string;
  title: string;
  advantages: string[];
  disadvantages: string[];
  description: string;
  // fields: Record<string, boolean>;
}

const processLicenceMeritsAndDemerits = ({
  advantages,
  disadvantages,
}: {
  advantages: string;
  disadvantages: string;
}) => {
  // New line or carriage return or both or even comma
  const splitter = /[\n\r,]+/;
  return {
    advantages: advantages.split(splitter).filter(Boolean),
    disadvantages: disadvantages.split(splitter).filter(Boolean),
  };
};

export function useLicences() {
  const api = useApi().privateApi;
  const fetchLicences = useCallback(async () => {
    try {
      type LicenceResponse = Pick<
        ILicence,
        'title' | 'license_type' | 'description'
      > & {
        id: number;
        advantages: string;
        disadvantages: string;
      };
      const response = await api.get<LicenceResponse[]>('/data/license/');
      return response.data.map((licence: LicenceResponse) => {
        const { advantages, disadvantages } =
          processLicenceMeritsAndDemerits(licence);
        return {
          ...licence,
          advantages,
          disadvantages,
        };
      });
    } catch (error) {
      console.error('Error fetching licences:', error);
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, []);
  const licenceQuery = useQuery({
    queryKey: licenceQueryKeys.all,
    queryFn: fetchLicences,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: true,
    initialData: [],
    refetchOnMount: true,
  });
  return licenceQuery;
}
