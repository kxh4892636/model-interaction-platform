import { extendFetch } from '@/util/api'
import {
  ProjectActionResponseType,
  ProjectInfoResponseType,
  ProjectListResponseType,
  TemplateActionResponseType,
  TemplateListResponseType,
} from './project.type'

export const getProjectInfo = async (projectID: string) => {
  const result = await extendFetch(`/api/v1/project/info/${projectID}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((result: ProjectInfoResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const getProjectCoverImage = async (projectID: string) => {
  const result = await extendFetch(`/api/v1/project/cover/${projectID}`, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.blob()
      } else {
        return null
      }
    })
    .catch(() => '/no-data.png')

  return result
}

export const getProjectList = async () => {
  const result = await extendFetch(`/api/v1/project/list`, {
    method: 'GET',
  })
    .then((res) => {
      return res.json()
    })
    .then((result: ProjectListResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const getTemplateCoverImage = async (templateID: string) => {
  const result = await extendFetch(`/api/v1/template/cover/${templateID}`, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.blob()
      } else {
        return null
      }
    })
    .catch(() => '/no-data.png')

  return result
}

export const getTemplateList = async () => {
  const result = await extendFetch(`/api/v1/template/list`, {
    method: 'GET',
  })
    .then((res) => {
      return res.json()
    })
    .then((result: TemplateListResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const createProjectFromTemplate = async (
  templateID: string,
  projectName: string,
) => {
  let jsonHeaders = new Headers({
    'Content-Type': 'application/json',
  })
  const result = await extendFetch(`/api/v1/template/action`, {
    method: 'POST',
    body: JSON.stringify({
      templateID,
      action: 'createFrom',
      projectName,
    }),
    headers: jsonHeaders,
  })
    .then((res) => {
      return res.json()
    })
    .then((result: TemplateActionResponseType) => {
      if (result.code) {
        return true
      } else {
        return false
      }
    })
    .catch(() => false)

  return result
}

export const deleteProject = async (projectID: string) => {
  let jsonHeaders = new Headers({
    'Content-Type': 'application/json',
  })
  const result = await extendFetch(`/api/v1/project/action`, {
    method: 'POST',
    body: JSON.stringify({
      projectID,
      action: 'delete',
      projectName: '',
    }),
    headers: jsonHeaders,
  })
    .then((res) => {
      return res.json()
    })
    .then((result: ProjectActionResponseType) => {
      if (result.code) {
        return true
      } else {
        return false
      }
    })
    .catch(() => false)

  return result
}
