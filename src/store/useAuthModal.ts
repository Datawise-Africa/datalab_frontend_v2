import { create } from 'zustand';

export const useAuthModal = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// export default useAuthModal;
