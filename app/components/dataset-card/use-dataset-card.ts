import { createContext, useContext } from 'react';
import type { NormalizedDataset } from '~/lib/utils/dataset-adapter';

export interface DatasetCardContextValue {
  dataset: NormalizedDataset;
}

export const DatasetCardContext = createContext<DatasetCardContextValue | null>(
  null
);

export function useDatasetCard() {
  const ctx = useContext(DatasetCardContext);
  if (!ctx) {
    throw new Error(
      'useDatasetCard must be used within a <DatasetCard> component'
    );
  }
  return ctx;
}
