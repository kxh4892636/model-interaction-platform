/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATA_FOLDER_PATH } from '@/config/env'
import { orm } from '@/dao'
import { projectDatasetDao } from '@/dao/project-dataset'
import { DBStatusType, WaterModelTypeType } from '@/type'
import { copyFolder } from '@/util/fs'
import { randomUUID } from 'crypto'
import { mkdir, rm } from 'fs/promises'
import path from 'path'
import { datasetService } from '../dataset/dataset.service'
import { projectDao } from './project.dao'
import { ProjectListType, ProjectTreeType } from './project.type'

export const projectService = {
  createProject: async (
    projectID: string,
    projectName: string,
    projectExtent: number[],
    identifier: string,
    projectStatus: DBStatusType,
  ) => {
    const projectPath = path.join('/project', identifier)
    // create db records
    await orm.project.createProject(
      projectID,
      projectName,
      projectExtent,
      identifier,
      projectPath,
      projectStatus,
    )
    const projectDatasetMap = [
      ['water-2d', ['water-2d']],
      ['water-3d', ['water-3d']],
      ['quality-wasp', ['water-2d', 'quality-wasp']],
      ['quality-phreec', ['water-2d', 'quality-phreec']],
      ['quality-phreec-3d', ['water-2d', 'quality-phreec-3d']],
      ['sand', ['water-2d', 'sand']],
      ['mud', ['water-2d', 'mud']],
      ['ewe', ['ewe']],
    ]
    const promiseList = projectDatasetMap.map(async (value) => {
      ;(value[1] as string[]).map(async (paramType) => {
        const datasetID = randomUUID()
        const datasetName = paramType + '参数'
        await datasetService.createDataset(
          projectID,
          value[0] as WaterModelTypeType,
          paramType + '-input',
          datasetID,
          datasetName,
          'valid',
        )
      })
    })
    await Promise.all(promiseList)

    // create folder and copy model
    await mkdir(path.join(DATA_FOLDER_PATH, projectPath), {
      recursive: true,
    })
    await copyFolder(
      path.join(DATA_FOLDER_PATH, '/template'),
      path.join(DATA_FOLDER_PATH, projectPath),
    )
  },

  getAllProject: async (): Promise<ProjectListType> => {
    const projectList = await orm.project.getAllProject()
    const result: ProjectListType = projectList.map((value) => {
      return {
        projectExtent: value.project_extent,
        projectId: value.project_id,
        projectName: value.project_name,
      }
    })
    return result
  },

  generateProjectTree: async (projectID: string): Promise<ProjectTreeType> => {
    const result: ProjectTreeType = []
    const datasetList =
      await projectDatasetDao.getDatasetIDListByProjectID(projectID)

    const promiseList = datasetList.map(async (dataset) => {
      const datasetInfo = await orm.dataset.getDatasetByDatasetID(
        dataset.dataset_id,
      )
      if (!datasetInfo) throw Error()
      if (datasetInfo.status === 'pending') {
        return
      }
      const temp = {
        layerName: datasetInfo.dataset_name,
        layerKey: datasetInfo.dataset_id,
        layerType: 'none',
        layerStyle: 'none',
        isGroup: true,
        modelType: datasetInfo.model_type,
        children: [] as ProjectTreeType,
      }
      const dataList = await orm.datasetData.getDataIDListByDatasetID(
        dataset.dataset_id,
      )
      for (const data of dataList) {
        const dataInfo = await orm.data.getDataByDataID(data.data_id)
        if (!dataInfo) continue
        temp.children.push({
          layerName: dataInfo.data_name,
          layerKey: dataInfo.data_id,
          layerType: dataInfo.data_type as any,
          layerStyle: dataInfo.data_style as any,
          isGroup: false,
          modelType: dataInfo.model_type as any,
          children: [],
        })
      }
      result.push(temp as any)
    })
    await Promise.all(promiseList)
    return result
  },

  deleteProject: async (projectID: string) => {
    const projectInfo = await orm.project.getProjectByProjectID(projectID)
    if (!projectInfo) throw Error()
    const datasetIDList =
      await orm.projectDataset.getDatasetIDListByProjectID(projectID)
    // delete project db record
    await projectDao.deleteProject(projectID)
    // delete dataset of project
    for (const datasetID of datasetIDList) {
      await datasetService.deleteDataset(datasetID.dataset_id, false)
    }
    // delete disk data
    const projectPath = path.join(
      DATA_FOLDER_PATH,
      projectInfo.project_folder_path,
    )
    await rm(projectPath, {
      recursive: true,
    })
  },
}
