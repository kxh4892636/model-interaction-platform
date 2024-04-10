import { create } from 'zustand'

interface MapStore {
  map: mapboxgl.Map | null
  mapPosition: [number, number, number]
  setMap: (value: mapboxgl.Map) => void
  setMapPosition: (value: [number, number, number]) => void
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  mapPosition: [119.8618, 26.7011, 7],
  setMap: (value) => set({ map: value }),
  setMapPosition: (value) => set({ mapPosition: value }),
}))
