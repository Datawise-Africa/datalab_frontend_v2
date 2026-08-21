import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '~/lib/api/client';
import type {
  ProductValidation,
  ValidationDecisionInput,
} from '~/lib/types/validation';
import { extractError } from '~/lib/utils/extract-error';
import { toastUtils } from '~/lib/utils/toast';
import { validationKeys } from './query-keys';

function useValidationAction(
  action: 'start-review' | 'rerun-checks' | 'decision'
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input?: ValidationDecisionInput;
    }) => {
      const { data } = await apiClient.post<ProductValidation>(
        `/admin/validations/${id}/${action}/`,
        input
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: validationKeys.all });
      toastUtils.success('Review updated');
    },
    onError: (error) => {
      toastUtils.error('Review failed', extractError(error));
    },
  });
}

export const useStartValidationReview = () =>
  useValidationAction('start-review');
export const useRerunValidationChecks = () =>
  useValidationAction('rerun-checks');
export const useDecideValidation = () => useValidationAction('decision');
