import { DataFetchAPIInterface } from '@/type'
import { extendFetch } from '../api.util'
import {
  DataActionBodyType,
  DataActionResponseType,
  DataInfoCoordResponse,
  DataInfoCoordType,
  DataInfoResponseType,
  DataInfoType,
} from './data.type'

export const getDataInfoAPI = async (dataID: string) => {
  const url =
    '/api/v1/data/info?' +
    new URLSearchParams({
      dataID,
    })
  const response: DataFetchAPIInterface<DataInfoType> = await extendFetch(url, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: DataInfoResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<DataInfoType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const getDataInfoOfCoordAPI = async (
  dataID: string,
  coord: [number, number],
) => {
  const url =
    '/api/v1/data/info/coord?' +
    new URLSearchParams({
      dataID,
      lng: coord[0].toString(),
      lat: coord[1].toString(),
    })
  const response: DataFetchAPIInterface<DataInfoCoordType> = await extendFetch(
    url,
    {
      method: 'GET',
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: DataInfoCoordResponse) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<DataInfoCoordType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const getMeshAPI = async (dataID: string, index: number) => {
  const url =
    '/api/v1/data/mesh?' +
    new URLSearchParams({
      dataID,
      index: index.toString(),
    })
  const response: Blob | DataFetchAPIInterface<null> = await extendFetch(url, {
    method: 'GET',
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
    })

  return response
}

export const getUVETDescriptionAPI = async (dataID: string) => {
  const url =
    '/api/v1/data/uvet/description?' +
    new URLSearchParams({
      dataID,
      index: '0',
    })

  const response: DataFetchAPIInterface<object> = await extendFetch(url, {
    method: 'get',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((json: Record<string, unknown>) => {
      if (!json.extent) {
        throw Error()
      } else {
        const result: DataFetchAPIInterface<object> = {
          status: 'success',
          data: json,
          message: '',
        }
        return result
      }
    })
    .catch(() => {
      return {
        status: 'error',
        data: null,
        message: '',
      }
    })

  return response
}

// TODO 把逻辑放到后端
export const getUVETImageAPI = async (
  dataID: string,
  type: 'mask' | 'uv' | 'valid',
  hours: number,
  index: number,
) => {
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
      dataID,
      index: transformIndex.toString(),
    })

  const result: Blob | DataFetchAPIInterface<null> = await extendFetch(url, {
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
    })

  return result
}

export const getImageAPI = async (dataID: string, index: number) => {
  const url =
    '/api/v1/data/image?' +
    new URLSearchParams({
      dataID,
      index: index.toString(),
    })

  const result: Blob | DataFetchAPIInterface<null> = await extendFetch(url, {
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
    })

  return result
}

export const getTextAPI = async (dataID: string, index: number) => {
  const url =
    '/api/v1/data/text?' +
    new URLSearchParams({
      dataID,
      index: index.toString(),
    })
  const response: DataFetchAPIInterface<string> = await extendFetch(url, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.text()
      } else {
        throw Error()
      }
    })
    .then((text) => {
      const result: DataFetchAPIInterface<string> = {
        status: 'success',
        data: text,
        message: '',
      }
      return result
    })
    .catch(() => {
      return {
        status: 'error',
        data: null,
        message: '',
      }
    })

  return response
}

export const getJsonAPI = async (dataID: string, index: number) => {
  const url =
    '/api/v1/data/json?' +
    new URLSearchParams({
      dataID,
      index: index.toString(),
    })
  const response: DataFetchAPIInterface<object> = await extendFetch(url, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((json) => {
      const result: DataFetchAPIInterface<object> = {
        status: 'success',
        data: json,
        message: '',
      }
      return result
    })
    .catch(() => {
      return {
        status: 'error',
        data: null,
        message: '',
      }
    })

  return response
}

export const postDataActonAPI = async (params: DataActionBodyType) => {
  const jsonHeaders = new Headers({
    'Content-Type': 'application/json',
  })
  const response: DataFetchAPIInterface<DataActionResponseType> =
    await extendFetch(`/api/v1/data/action`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: jsonHeaders,
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw Error()
        }
      })
      .then((result: DataActionResponseType) => {
        if (result.status === 'success') {
          return result
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
      })

  return response
}
