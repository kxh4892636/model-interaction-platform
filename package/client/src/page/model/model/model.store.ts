import { create } from 'zustand'
import { ModelStepType } from './model.type'

interface MetaInterface {
  modelArea: ModelStepType
  setModelArea: (type: ModelStepType) => void
}

export const useModeStore = create<MetaInterface>((set) => ({
  modelArea: 'undefined',
  setModelArea: (value) => {
    set({
      modelArea: value,
    })
  },
}))
