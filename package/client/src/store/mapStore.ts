import { create } from 'zustand'

interface MapStore {
  map: mapboxgl.Map | null
  mapPosition: [number, number, number]
  clickPosition: [number, number]
  setMap: (value: mapboxgl.Map) => void
  setMapPosition: (value: [number, number, number]) => void
  setClickPosition: (value: [number, number]) => void
}

export const useMapStore = create<MapStore>((set, get) => ({
  map: null,
  mapPosition: [119.8618, 26.7011, 7],
  clickPosition: [0, 0],
  setMap: (value) => set({ map: value }),
  setMapPosition: (value) => set({ mapPosition: value }),
  setClickPosition: (value) => set({ clickPosition: value }),
}))
