import { DataFetchAPIInterface } from '@/type'
import { extendFetch } from '../api.util'
import {
  ModelActionBodyType,
  ModelActionResponseType,
  ModelActionType,
  ModelInfoResponseType,
  ModelInfoType,
  ModelParamResponseType,
  ModelParamType,
  MudParamBodyType,
  QualityWaspParamBodyType,
  SandParamBodyType,
  Water2DParamBodyType,
  Water3DParamBodyType,
  EWEParamBodyType,
} from './model.type'

export const getModelInfoAPI = async (modelID: string) => {
  const url =
    `/api/v1/model/info?` +
    new URLSearchParams({
      modelID,
    })
  const response: DataFetchAPIInterface<ModelInfoType> = await extendFetch(
    url,
    { method: 'get' },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ModelInfoResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ModelInfoType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

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

export const postWater3DParamAPI = async (params: Water3DParamBodyType) => {
  const url = `/api/v1/model/param/water-3d`
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

export const postEWEModelLoadAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/Load`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        console.log('ERROE')
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postEWEModelImportAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/Import`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        console.log('ERROE')
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postEWEModelRunAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/Run`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postRunEcoSimSwitchAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/RunEcoSim_Switch`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postGroupPlotSwitchAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/GroupPlot_Switch`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postFleetPlotSwitchAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/FleetPlot_Switch`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postEcoSpaceGraphSwitchAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/RunEcoSpace_Switch`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postEcoSpaceMapSwitchAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/RunEcoSpace_SwitchMap`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postUplaodTimeserieAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/UploadTimeseries`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postUplaodForcingAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/UploadForcing`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}

export const postUplaodMeasuredAPI = async (params: EWEParamBodyType) => {
  const url = `/api/v1/model/ewe/UploadMeasured`
  const response = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result = {
        status: 'error',
        data: null,
        message: 'Mloading',
      }
      return result
    })

  return response
}
