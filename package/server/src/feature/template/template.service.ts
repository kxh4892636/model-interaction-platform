import { TemplateListType } from '@/type/template.type'
import { datasetService } from '../dataset/dataset.service'
import { dataService } from '../modal-data/data.service'
import { projectService } from '../project/project.service'
import { templateDao } from './template.dao'

export const templateService = {
  getTemplateList: async (): Promise<TemplateListType> => {
    const result = (await templateDao.getAllTemplate()).map((info) => ({
      templateId: info.templateID,
      templateName: info.templateName,
      templatePositionZoom: info.templatePositionAndZoom,
      templateTag: info.templateTag,
    }))

    return result
  },

  createTemplate: async (templateID: string, projectName: string) => {
    const templateInfo = await templateDao.getTemplateByTemplateID(templateID)
    const { id: projectID, path: projectPath } =
      await projectService.createProject(
        projectName,
        templateInfo.templatePositionAndZoom,
        templateInfo.templateTag,
      )
    const datasetIDMap = await datasetService.createDataset(
      projectPath,
      templateInfo.templateFolderPath,
      templateInfo.templateTree,
    )
    const dataIDMap = await dataService.createData(
      projectPath,
      templateInfo.templateTree,
      datasetIDMap,
    )
    const promiseList0 = Object.values(datasetIDMap).map((value) =>
      projectService.createProjectDataset(projectID, value),
    )
    const promiseList1 = Object.keys(dataIDMap).map((datasetID) =>
      datasetService.createDatasetData(datasetID, dataIDMap[datasetID]),
    )

    await Promise.all([...promiseList0, ...promiseList1])
  },
}
