import { extendFetch } from '@/util/api'
import {
  ModelActionResponseType,
  ModelInfoResponseType,
} from '../type/model.type'

export const getModelInfo = async (modelID: string) => {
  const url = `/api/v1/model/info/${modelID}`
  const response = await extendFetch(url, { method: 'get' })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then((result: ModelInfoResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return {
          modelID: '',
          modelDatasetID: '',
          progress: 0,
          modelStatus: -1,
        }
      }
    })
    .catch(() => {
      return null
    })

  return response
}

export const postWaterAction = async (
  modelID: string,
  action: 'run' | 'stop',
  modelInit: {
    modelType: 'water' | 'sand' | 'quality'
    modelName: string
    projectID: string
    paramsID: string
    hours: number
    uvetID: string | null
  } | null,
) => {
  let jsonHeaders = new Headers({
    'Content-Type': 'application/json',
  })
  const response = await extendFetch('/api/v1/model/water/action', {
    method: 'post',
    body: JSON.stringify({ modelID, action, modelInit }),
    headers: jsonHeaders,
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then((result: ModelActionResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => {
      return null
    })

  return response
}
