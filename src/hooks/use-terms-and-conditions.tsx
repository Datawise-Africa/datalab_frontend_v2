import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { termsAndConditionsQueryKeys } from '@/lib/features/terms-and-condition-keys';
import { extractCorrectErrorMessage } from '@/lib/error';
import { useAxios } from './use-axios';

export function useTermsAndConditions() {
const axiosClient = useAxios();
  const fetchTermsAndConditions = useCallback(async () => {
    try {
      const res = await axiosClient.get('/data/terms-and-conditions/');
      return res.data;
    } catch (error) {
      throw new Error(extractCorrectErrorMessage(error));
    }
  }, []);

  const tAndConditions = useQuery({
    queryKey: termsAndConditionsQueryKeys.all,
    queryFn: fetchTermsAndConditions,
  });

  return tAndConditions;
}
