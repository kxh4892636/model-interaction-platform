import { DataFetchAPIInterface } from '@/type'
import { extendFetch } from '../api.util'
import {
  ModelActionBodyType,
  ModelActionResponseType,
  ModelActionType,
  ModelParamResponseType,
  ModelParamType,
  MudParamBodyType,
  QualityWaspParamBodyType,
  SandParamBodyType,
  Water2DParamBodyType,
} from './model.type'

export const postWater2DParamAPI = async (params: Water2DParamBodyType) => {
  const url = `/api/v1/model/param/water-2d`
  const response: DataFetchAPIInterface<ModelParamType> = await extendFetch(
    url,
    {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ModelParamResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ModelParamType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const postQualityWaspParamAPI = async (
  params: QualityWaspParamBodyType,
) => {
  const url = `/api/v1/model/param/quality-wasp`
  const response: DataFetchAPIInterface<ModelParamType> = await extendFetch(
    url,
    {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ModelParamResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ModelParamType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const postSandParamAPI = async (params: SandParamBodyType) => {
  const url = `/api/v1/model/param/sand`
  const response: DataFetchAPIInterface<ModelParamType> = await extendFetch(
    url,
    {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ModelParamResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ModelParamType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const postMudParamAPI = async (params: MudParamBodyType) => {
  const url = `/api/v1/model/param/mud`
  const response: DataFetchAPIInterface<ModelParamType> = await extendFetch(
    url,
    {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ModelParamResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ModelParamType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const postModelActionAPI = async (params: ModelActionBodyType) => {
  const url = `/api/v1/model/water/action`
  const response: DataFetchAPIInterface<ModelActionType> = await extendFetch(
    url,
    {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ModelActionResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ModelActionType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}
