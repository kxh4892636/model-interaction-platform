import { WaterModelTypeType } from '@/type'
import { produce } from 'immer'
import { create } from 'zustand'

interface MetaInterface {
  projectID: string | null
  modelType: WaterModelTypeType
  intervalIDMap: Record<string, NodeJS.Timeout>
  setProjectID: (id: string | null) => void
  setModelType: (type: WaterModelTypeType) => void
  addInterValID: (layerID: string, intervalID: NodeJS.Timeout) => void
  getInterValIDByLayerID: (layerID: string) => NodeJS.Timeout | null
  removeInterValIDByLayerID: (layerID: string) => void
}

export const useMetaStore = create<MetaInterface>((set, get) => ({
  projectID: null,
  modelType: 'water-2d',
  intervalIDMap: {},
  setProjectID: (value) => set({ projectID: value }),
  setModelType: (value) => set({ modelType: value }),
  addInterValID: (layerID, intervalID) =>
    set(
      produce((draft: MetaInterface) => {
        draft.intervalIDMap[layerID] = intervalID
      }),
    ),
  getInterValIDByLayerID: (layerID) => {
    return get().intervalIDMap[layerID] || null
  },
  removeInterValIDByLayerID: (layerID) =>
    set(
      produce((draft: MetaInterface) => {
        delete draft.intervalIDMap[layerID]
      }),
    ),
}))
