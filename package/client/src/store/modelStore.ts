import { produce } from 'immer'
import { create } from 'zustand'

interface IModelStatus {
  modelID: string
  name: string
  progress: number
  status: null | 'pending' | 'success' | 'error'
}

interface IModelStore {
  modelStatusRecord: Record<string, IModelStatus>
  getModelStatus: (projectID: string) => IModelStatus
  updateModelProgress: (projectID: string, progress: number) => void
  setInitStatus: (projectID: string, modelID: string, modelName: string) => void
  setRunStatus: (projectID: string) => void
  setErrorStatus: (projectID: string) => void
  setSuccessStatus: (projectID: string) => void
}

export const useModelStore = create<IModelStore>((set, get) => ({
  modelStatusRecord: {},
  getModelStatus: (projectID: string) => {
    return get().modelStatusRecord[projectID]
  },
  updateModelProgress: (projectID: string, progress: number) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[projectID].progress = progress
      }),
    )
  },
  setInitStatus: (projectID: string, modelID: string, modelName: string) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[projectID] = {
          modelID,
          name: modelName,
          progress: 0,
          status: null,
        }
      }),
    )
  },
  setRunStatus: (projectID: string) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[projectID].progress = 0
        draft.modelStatusRecord[projectID].status = 'pending'
      }),
    )
  },
  setErrorStatus: (projectID: string) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[projectID].progress = 0
        draft.modelStatusRecord[projectID].status = 'error'
      }),
    )
  },
  setSuccessStatus: (projectID: string) => {
    set(
      produce((draft: IModelStore) => {
        draft.modelStatusRecord[projectID].progress = 100
        draft.modelStatusRecord[projectID].status = 'success'
      }),
    )
  },
}))
