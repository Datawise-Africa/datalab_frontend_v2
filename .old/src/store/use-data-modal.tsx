import { create } from 'zustand';

type DataModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const useDataModal = create<DataModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useDataModal;
