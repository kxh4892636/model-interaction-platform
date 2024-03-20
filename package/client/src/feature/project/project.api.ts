import { extendFetch } from '@/util/api'
import {
  ProjectInfoResponseType,
  ProjectInfoType,
  ProjectListResponseType,
  ProjectListType,
  TemplateInfoType,
  TemplateListResponseType,
  TemplateListType,
} from './project.type'

const getProjectInfoFromServer = async (projectID: string) => {
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

const getProjectCoverImageFromServer = async (projectID: string) => {
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

const getProjectListFromServer = async () => {
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

const getTemplateCoverImageFromServer = async (templateID: string) => {
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

const getTemplateListFromServer = async () => {
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

export const getProjectListData = async () => {
  const result: ProjectListType = []
  const projectList = await getProjectListFromServer()
  if (!projectList) return null
  for (const project of projectList) {
    const id = project.projectId
    const image = await getProjectCoverImageFromServer(id)
    if (!image) continue
    const imageUrl =
      typeof image === 'string' ? image : URL.createObjectURL(image)
    const temp: ProjectInfoType = {
      datasetIDArray: project.datasetIDArray,
      projectCoverImage: imageUrl,
      projectId: id,
      projectName: project.projectName,
      projectPositionZoom: project.projectPositionZoom,
      projectTag: project.projectTag,
    }
    result.push(temp)
  }

  return result
}

export const getTemplateListData = async () => {
  const result: TemplateListType = []
  const templateList = await getTemplateListFromServer()
  if (!templateList) return null
  for (const template of templateList) {
    const id = template.templateId
    const image = await getTemplateCoverImageFromServer(id)
    if (!image) continue
    const imageUrl =
      typeof image === 'string' ? image : URL.createObjectURL(image)
    const temp: TemplateInfoType = {
      templateCoverImage: imageUrl,
      templateID: id,
      templateName: template.templateName,
      templateTag: template.templateTag,
    }
    result.push(temp)
  }

  return result
}
