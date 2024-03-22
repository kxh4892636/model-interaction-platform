import { extendFetch } from '@/util/api'
import {
  DataInfoResponseType,
  DatasetActionResponseType,
  ProjectTreeResponseType,
} from './layer.type'

export const getProjectTree = async (projectID: string) => {
  const result = await extendFetch(`/api/v1/project/tree/${projectID}`, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then((result: ProjectTreeResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const getDataInfo = async (dataID: string) => {
  const result = await extendFetch(`/api/v1/data/info/${dataID}`, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then((result: DataInfoResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const getMeshData = async (dataID: string, index: number) => {
  const url =
    '/api/v1/data/mesh?' +
    new URLSearchParams({
      dataID: dataID,
      index: index.toString(),
    })
  const result = await extendFetch(url, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.blob()
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const getTextData = async (dataID: string, index: number) => {
  const url =
    '/api/v1/data/text?' +
    new URLSearchParams({
      dataID: dataID,
      index: index.toString(),
    })
  const result = await extendFetch(url, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.text()
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const operateDataset = async (
  datasetID: string,
  action: 'delete' | 'rename',
  datasetName: string,
) => {
  let jsonHeaders = new Headers({
    'Content-Type': 'application/json',
  })
  const result = await extendFetch(`/api/v1/dataset/action`, {
    method: 'POST',
    body: JSON.stringify({
      datasetID,
      datasetAction: action,
      datasetName,
    }),
    headers: jsonHeaders,
  })
    .then((res) => {
      return res.json()
    })
    .then((result: DatasetActionResponseType) => {
      if (result.code) {
        return true
      } else {
        return false
      }
    })
    .catch(() => false)

  return result
}
