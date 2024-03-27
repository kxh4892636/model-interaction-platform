import { produce } from 'immer'
import { create } from 'zustand'

interface ModelStatus {
  modelID: string | null
  modelType: string | null
  modelTitle: string | null
  datasetIDOfParams: string | null
  datasetIDOfResult: string | null
  uvetID: string | null
  hours: number | null
  progress: number
  isRunning: boolean
  intervalStore: NodeJS.Timeout | null
}

interface ModelStatusStore {
  modelStatus: ModelStatus[]
  initModelStatus: (model: string) => void
  getModelStatus: (model: string) => ModelStatus
  updateModelStatus: (
    model: string,
    prop:
      | 'modelID'
      | 'modelType'
      | 'modelTitle'
      | 'datasetIDOfParams'
      | 'datasetIDOfResult'
      | 'uvetID'
      | 'hours'
      | 'progress'
      | 'isRunning'
      | 'intervalStore',
    value: string | boolean | number | NodeJS.Timeout | null,
  ) => void
  removeModelStatus: (model: string) => void
}

export const useModelsStatus = create<ModelStatusStore>((set, get) => ({
  modelStatus: ['water', 'sand', 'quality'].map((value) => {
    return {
      datasetIDOfParams: null,
      datasetIDOfResult: null,
      intervalStore: null,
      isRunning: false,
      modelID: null,
      modelTitle: null,
      modelType: value,
      progress: 0,
      hours: null,
      uvetID: null,
    }
  }),
  initModelStatus: (modelType: string) => {
    set(
      produce((draft: ModelStatusStore) => {
        draft.modelStatus.forEach((value, index) => {
          if (value.modelType === modelType) {
            draft.modelStatus[index] = {
              datasetIDOfParams: null,
              datasetIDOfResult: null,
              intervalStore: null,
              isRunning: false,
              modelID: null,
              modelTitle: null,
              modelType: modelType,
              progress: 0,
              hours: null,
              uvetID: null,
            }
          }
        })
      }),
    )
  },
  getModelStatus: (model) => {
    const modelStatus = get().modelStatus
    const ms: ModelStatus | undefined = modelStatus.filter(
      (ms) => ms.modelType === model,
    )[0]
    return ms
  },
  updateModelStatus: (model, prop, value) => {
    set(
      produce((draft: ModelStatusStore) => {
        draft.modelStatus.forEach((ms) => {
          if (ms.modelType === model) {
            ;(ms as any)[prop] = value
          } else;
        })
      }),
    )
  },
  removeModelStatus: (model) => {
    set(
      produce((draft: ModelStatusStore) => {
        draft.modelStatus = draft.modelStatus.filter(
          (ms) => ms.modelType !== model,
        )
      }),
    )
  },
}))
