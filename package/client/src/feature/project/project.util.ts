import {
  getProjectCoverImage,
  getProjectList,
  getTemplateCoverImage,
  getTemplateList,
} from './project.api'
import {
  ProjectInfoType,
  ProjectListType,
  TemplateInfoType,
  TemplateListType,
} from './project.type'

export const getProjectListData = async () => {
  const result: ProjectListType = []
  const projectList = await getProjectList()
  if (!projectList) return null
  for (const project of projectList) {
    const id = project.projectId
    const image = await getProjectCoverImage(id)
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
  const templateList = await getTemplateList()
  if (!templateList) return null
  for (const template of templateList) {
    const id = template.templateId
    const image = await getTemplateCoverImage(id)
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
