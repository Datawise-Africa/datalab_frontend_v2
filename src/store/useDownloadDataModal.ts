import { create } from 'zustand';
type DownloadDataModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};
const useDownloadDataModal = create<DownloadDataModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useDownloadDataModal;
