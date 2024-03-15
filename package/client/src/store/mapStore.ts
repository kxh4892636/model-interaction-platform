import { create } from 'zustand'

interface MapStore {
  map: mapboxgl.Map | null
  mapPosition: [number, number, number]
  isDisplay: boolean
  setMap: (value: mapboxgl.Map) => void
  setMapPosition: (value: [number, number, number]) => void
  setDisplay: (value: boolean) => void
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  mapPosition: [119.8618, 26.7011, 9],
  isDisplay: true,
  setMap: (value) => set({ map: value }),
  setMapPosition: (value) => set({ mapPosition: value }),
  setDisplay: (value) =>
    set({
      isDisplay: value,
    }),
}))
