import { DataFetchInterface } from '@/type'
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

export const getUVETDescription = async (
  dataID: string,
): Promise<DataFetchInterface<object>> => {
  const url =
    '/api/v1/data/uvet/description?' +
    new URLSearchParams({
      dataID: dataID,
      index: '0',
    })

  const result = (await extendFetch(url, {
    method: 'get',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (!result.extent) {
        throw Error()
      } else {
        return {
          status: 'success',
          data: result,
          message: '',
        }
      }
    })
    .catch(() => {
      return {
        status: 'error',
        data: null,
        message: '',
      }
    })) as DataFetchInterface<object>

  return result
}

export const getUVETImage = async (
  dataID: string,
  type: 'mask' | 'uv' | 'valid',
  hours: number,
  index: number,
): Promise<Blob | DataFetchInterface<null>> => {
  const transformIndex = (() => {
    if (type === 'mask') {
      return index + 1
    } else if (type === 'uv') {
      return 1 + hours + index
    }
    return 1 + 2 * hours + index
  })()
  const url =
    '/api/v1/data/uvet/image?' +
    new URLSearchParams({
      dataID: dataID,
      index: transformIndex.toString(),
    })

  const result = (await extendFetch(url, {
    method: 'get',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.blob()
      } else {
        throw Error()
      }
    })
    .catch(() => {
      return {
        status: 'error',
        data: null,
        message: '',
      }
    })) as Blob | DataFetchInterface<null>

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
  const jsonHeaders = new Headers({
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
