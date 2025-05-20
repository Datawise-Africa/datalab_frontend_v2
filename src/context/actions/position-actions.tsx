import type { InferActions } from '@/lib/types/utils';

export const positionProviderActions = {
  SET_POSITION: (payload: string) =>
    ({ type: 'SET_POSITION', payload }) as const,
  RESET_POSITION: () => ({ type: 'RESET_POSITION' }) as const,
};
export type PositionAction = InferActions<typeof positionProviderActions>;
