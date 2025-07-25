import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { extractCorrectErrorMessage } from '@/lib/error';
import { licenceQueryKeys } from '@/lib/features/licences-keys';
import type { PaginatedResponse } from '@/constants/pagination';
import { useAxios } from './use-axios';

export interface ILicence {
  id: number;
  license_type: string;
  title: string;
  advantages: string[];
  disadvantages: string[];
  description: string;
}

type LicenceResponse = PaginatedResponse<
  Pick<ILicence, 'title' | 'license_type' | 'description'> & {
    id: number;
    advantages: string;
    disadvantages: string;
  }
>;

export type SingleFormLicence = Omit<
  LicenceResponse['data'][number],
  'advantages' | 'disadvantages'
> & {
  advantages: string[];
  disadvantages: string[];
};

// Extracted and memoized for better performance
const SPLITTER_REGEX = /[\n\r,]+/;

const processLicenceMeritsAndDemerits = (
  advantages: string,
  disadvantages: string,
) => ({
  advantages: advantages.split(SPLITTER_REGEX).filter(Boolean),
  disadvantages: disadvantages.split(SPLITTER_REGEX).filter(Boolean),
});

const transformLicenceData = (licenceResp: LicenceResponse): ILicence[] =>
  licenceResp.data.map((licence) => ({
    ...licence,
    ...processLicenceMeritsAndDemerits(
      licence.advantages,
      licence.disadvantages,
    ),
  }));

export function useLicences() {
  const axiosClient = useAxios();
  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchLicences = useMemo(
    () => async (): Promise<ILicence[]> => {
      try {
        const response =
          await axiosClient.get<LicenceResponse>('/data/license/');
        return transformLicenceData(response.data);
      } catch (error) {
        console.error('Error fetching licences:', error);
        throw new Error(extractCorrectErrorMessage(error));
      }
    },
    [],
  );
  const licenceQuery = useQuery({
    queryKey: licenceQueryKeys.all,
    queryFn: fetchLicences,
    staleTime: 5 * 60 * 1000, // 5 minutes (more readable)
    retry: 2, // Specific retry count instead of boolean
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: 'always', // More explicit than boolean
    placeholderData: [],
  });
  return licenceQuery;
}
