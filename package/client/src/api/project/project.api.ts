import { extendFetch } from '@/api/api.util'
import { DataFetchAPIInterface, WaterModelTypeType } from '@/type'
import {
  ProjectActionBodyType,
  ProjectActionResponseType,
  ProjectListResponseType,
  ProjectListType,
  ProjectTreeResponseType,
  ProjectTreeType,
} from './project.type'

export const getProjectListAPI = async (modelType: WaterModelTypeType) => {
  const response: DataFetchAPIInterface<ProjectListType> = await extendFetch(
    `/api/v1/project/list?` +
      new URLSearchParams({
        modelType,
      }),
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
    .then((result: ProjectListResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ProjectListType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const getProjectTreeAPI = async (projectID: string) => {
  const url =
    '/api/v1/project/tree?' +
    new URLSearchParams({
      projectID,
    })
  const response: DataFetchAPIInterface<ProjectTreeType> = await extendFetch(
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
    .then((result: ProjectTreeResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<ProjectTreeType> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}

export const postProjectActionAPI = async (params: ProjectActionBodyType) => {
  const url = `/api/v1/project/action`
  const response: DataFetchAPIInterface<string> = await extendFetch(url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      action: params.action,
      projectID: params.projectID,
      projectName: params.projectName,
      projectExtent: params.projectExtent,
      modelType: params.modelType,
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: ProjectActionResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      const result: DataFetchAPIInterface<string> = {
        status: 'error',
        data: null,
        message: '',
      }
      return result
    })

  return response
}
