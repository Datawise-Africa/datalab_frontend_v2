import { useCallback } from 'react';
import useApi from './use-api';
import { useQuery } from '@tanstack/react-query';
import { termsAndConditionsQueryKeys } from '@/lib/features/terms-and-condition-keys';
import { extractCorrectErrorMessage } from '@/lib/error';

export function useTermsAndConditions() {
  const { api } = useApi();
  const fetchTermsAndConditions = useCallback(async () => {
    try {
      const res = await api.get('/data/terms-and-conditions/');
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
