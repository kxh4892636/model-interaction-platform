import { create } from "zustand";

interface ManualRefreshStore {
  refreshTag: number;
  manualRefresh: () => void;
}

export const useManualRefreshStore = create<ManualRefreshStore>((set) => ({
  refreshTag: 0,
  manualRefresh: () => set((state: ManualRefreshStore) => ({ refreshTag: state.refreshTag + 1 })),
}));
