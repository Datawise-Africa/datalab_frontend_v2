import type { IDataset } from '@/lib/types/data-set';
import { create } from 'zustand';

type DatasetStoreState = {
  downloadDataset: IDataset | null;
  selectedDataset: IDataset | null;
};

type DatasetStoreActions = {
  setDownloadDataset: (dataset: IDataset | null) => void;
  setSelectedDataset: (dataset: IDataset | null) => void;
};

export const useDatasetStore = create<DatasetStoreState & DatasetStoreActions>(
  (set) => ({
    downloadDataset: null,
    selectedDataset: null,

    setDownloadDataset: (dataset) => set({ downloadDataset: dataset }),
    setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
  }),
);
