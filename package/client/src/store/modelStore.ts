import { WaterModelTypeType } from '@/type'
import { produce } from 'immer'
import { create } from 'zustand'

interface IModelStatus {
  name: WaterModelTypeType
  progress: number
  status: null | 'pending' | 'success' | 'error'
}

interface IModelStore {
  modelStatusRecord: Record<WaterModelTypeType, IModelStatus>
  getModelStatus: (model: WaterModelTypeType) => IModelStatus
  updateModelProgress: (model: WaterModelTypeType, progress: number) => void
  setInitStatus: (model: WaterModelTypeType) => void
  setRunStatus: (model: WaterModelTypeType) => void
  setErrorStatus: (model: WaterModelTypeType) => void
  setSuccessStatus: (model: WaterModelTypeType) => void
}

export const useModelStore = create<IModelStore>((set, get) => ({
  modelStatusRecord: {
    'water-2d': {
      name: 'water-2d',
      progress: 0,
      status: null,
    },
    'water-3d': {
      name: 'water-3d',
      progress: 0,
      status: null,
    },
    'quality-wasp': {
      name: 'quality-wasp',
      progress: 0,
      status: null,
    },
    'quality-phreec': {
      name: 'quality-phreec',
      progress: 0,
      status: null,
    },
    'quality-phreec-3d': {
      name: 'quality-phreec-3d',
      progress: 0,
      status: null,
    },
    sand: {
      name: 'sand',
      progress: 0,
      status: null,
    },
    mud: {
      name: 'mud',
      progress: 0,
      status: null,
    },
    ewe: {
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
          name: modelName,
          progress: 0,
          status: null,
        }
      }),
    )
  },
  setRunStatus: (modelName: WaterModelTypeType) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[modelName] = {
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
        draft.modelStatusRecord[modelName] = {
          name: modelName,
          progress: 100,
          status: 'success',
        }
      }),
    )
  },
}))
