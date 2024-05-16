import { WaterModelTypeType } from '@/type'
import { produce } from 'immer'
import { create } from 'zustand'

interface IModelStatus {
  modelID: string | null
  name: WaterModelTypeType
  progress: number
  status: null | 'pending' | 'success' | 'error'
}

interface IModelStore {
  modelStatusRecord: Record<WaterModelTypeType, IModelStatus>
  getModelStatus: (model: WaterModelTypeType) => IModelStatus
  updateModelProgress: (model: WaterModelTypeType, progress: number) => void
  setInitStatus: (model: WaterModelTypeType) => void
  setRunStatus: (model: WaterModelTypeType, modelID: string) => void
  setErrorStatus: (model: WaterModelTypeType) => void
  setSuccessStatus: (model: WaterModelTypeType) => void
}

export const useModelStore = create<IModelStore>((set, get) => ({
  modelStatusRecord: {
    'water-2d': {
      modelID: null,
      name: 'water-2d',
      progress: 0,
      status: null,
    },
    'water-3d': {
      modelID: null,
      name: 'water-3d',
      progress: 0,
      status: null,
    },
    'quality-wasp': {
      modelID: null,
      name: 'quality-wasp',
      progress: 0,
      status: null,
    },
    'quality-phreec': {
      modelID: null,
      name: 'quality-phreec',
      progress: 0,
      status: null,
    },
    'quality-phreec-3d': {
      modelID: null,
      name: 'quality-phreec-3d',
      progress: 0,
      status: null,
    },
    sand: {
      modelID: null,
      name: 'sand',
      progress: 0,
      status: null,
    },
    mud: {
      modelID: null,
      name: 'mud',
      progress: 0,
      status: null,
    },
    ewe: {
      modelID: null,
      name: 'ewe',
      progress: 0,
      status: null,
    },
  },
  getModelStatus: (modelName: WaterModelTypeType) => {
    return get().modelStatusRecord[modelName]
  },
  updateModelProgress: (modelName: WaterModelTypeType, progress: number) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[modelName].progress = progress
      }),
    )
  },
  setInitStatus: (modelName: WaterModelTypeType) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[modelName] = {
          modelID: null,
          name: modelName,
          progress: 0,
          status: null,
        }
      }),
    )
  },
  setRunStatus: (modelName: WaterModelTypeType, modelID: string) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[modelName] = {
          modelID,
          name: modelName,
          progress: 0,
          status: 'pending',
        }
      }),
    )
  },
  setErrorStatus: (modelName: WaterModelTypeType) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[modelName] = {
          modelID: null,
          name: modelName,
          progress: 0,
          status: 'error',
        }
      }),
    )
  },
  setSuccessStatus: (modelName: WaterModelTypeType) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[modelName].progress = 100
        draft.modelStatusRecord[modelName].status = 'success'
      }),
    )
  },
}))
