import { WaterModelTypeType } from '@/type'
import { create } from 'zustand'

interface MetaInterface {
  projectID: string | null
  modelType: WaterModelTypeType
  setProjectID: (id: string | null) => void
  setModelType: (type: WaterModelTypeType) => void
}

export const useMetaStore = create<MetaInterface>((set) => ({
  projectID: null,
  modelType: 'water-2d',
  setProjectID: (value) => set({ projectID: value }),
  setModelType: (value) => set({ modelType: value }),
}))
