import { create } from 'zustand'

interface StateStoreInterface {
  forceUpdateTag: number
  forceUpdate: () => void
}

export const useStateStore = create<StateStoreInterface>((set, get) => ({
  forceUpdateTag: 0,
  forceUpdate: () =>
    set({
      forceUpdateTag: get().forceUpdateTag + 1,
    }),
}))
