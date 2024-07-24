import { WaterModelTypeType } from '@/type'
import { produce } from 'immer'
import { create } from 'zustand'

interface MetaInterface {
  projectID: string | null
  areaName: string | null
  modelType: WaterModelTypeType | null
  intervalIDMap: Record<string, NodeJS.Timeout>
  init: () => void
  setProjectID: (id: string | null) => void
  setAreaName: (name: string | null) => void
  setModelType: (type: WaterModelTypeType) => void
  addInterValID: (layerID: string, intervalID: NodeJS.Timeout) => void
  getInterValIDByLayerID: (layerID: string) => NodeJS.Timeout | null
  removeInterValIDByLayerID: (layerID: string) => void
}

export const useMetaStore = create<MetaInterface>((set, get) => ({
  projectID: null,
  areaName: null,
  modelType: null,
  intervalIDMap: {},
  init: () => {
    Object.values(get().intervalIDMap).forEach((value) => {
      clearInterval(value)
    })
    set({
      projectID: null,
      areaName: null,
      modelType: null,
      intervalIDMap: {},
    })
  },
  setProjectID: (value) => set({ projectID: value }),
  setAreaName: (value) => set({ areaName: value }),
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
