import { DATA_FOLDER_PATH } from '@/config/env'
import {
  ProjectInfoType,
  ProjectListType,
  ProjectTreeType,
} from '@/feature/project/project.type'
import { randomUUID } from 'crypto'
import { createReadStream } from 'fs'
import { mkdir, rm } from 'fs/promises'
import path from 'path'
import { datasetDao } from '../dataset/dataset.dao'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../modal-data/data.dao'
import { projectDao } from './project.dao'

export const projectService = {
  createProject: async (
    projectName: string,
    projectPositionAndZoom: number[],
    projectTags: string[],
  ) => {
    const timeStamp = Date.now().toString()
    const projectPath = path.join('/project', timeStamp)
    const coverImage = path.join(projectPath, '/cover.png')

    // create folder
    await mkdir(path.join(DATA_FOLDER_PATH, projectPath), {
      recursive: true,
    })

    // create db records
    const projectID = randomUUID()
    await projectDao.createProject(
      coverImage,
      projectPath,
      projectID,
      projectName,
      timeStamp,
      projectPositionAndZoom,
      projectTags,
    )

    return {
      id: projectID,
      path: projectPath,
    }
  },

  createProjectDataset: async (projectID: string, datasetID: string) => {
    const timeStamp = Date.now().toString()
    await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
  },

  getProjectByProjectID: async (
    projectID: string,
  ): Promise<ProjectInfoType | null> => {
    const projectInfo = await projectDao.getProject(projectID)
    if (!projectInfo) {
      return null
    }
    const datasetList = await projectDao.getDatasetListOfProject(projectID)

    return {
      datasetIDArray: datasetList,
      projectId: projectInfo.project_id,
      projectName: projectInfo.project_name,
      projectPositionZoom: projectInfo.project_position_zoom,
      projectTag: projectInfo.project_tag,
    }
  },

  getAllProject: async (): Promise<ProjectListType> => {
    const result: ProjectListType = []
    const projectList = await projectDao.getAllProject()
    const promiseList = projectList.map(async (projectInfo) => {
      const datasetList = await projectDao.getDatasetListOfProject(
        projectInfo.project_id,
      )
      const temp = {
        projectId: projectInfo.project_id,
        projectName: projectInfo.project_name,
        projectPositionZoom: projectInfo.project_position_zoom,
        projectTag: projectInfo.project_tag,
        datasetIDArray: datasetList,
      }

      result.push(temp)
    })

    await Promise.all(promiseList)

    return result
  },

  getProjectCoverImage: async (projectID: string) => {
    const projectInfo = await projectDao.getProject(projectID)
    if (!projectInfo) return null
    const imagePath = path.join(
      DATA_FOLDER_PATH,
      projectInfo.project_cover_image,
    )
    const cs = createReadStream(imagePath)
    return cs
  },

  generateProjectTree: async (projectID: string): Promise<ProjectTreeType> => {
    const result: ProjectTreeType = []

    const datasetList = await projectDao.getDatasetListOfProject(projectID)
    const promiseList = datasetList.map(async (datasetID) => {
      const datasetInfo = await datasetDao.getDatasetInfo(datasetID)
      if (!datasetInfo) {
        return
      }
      const temp = {
        title: datasetInfo.dataset_name,
        key: datasetInfo.dataset_id,
        layerType: 'none',
        layerStyle: 'none',
        group: true,
        isInput: datasetInfo.dataset_input,
        children: [] as ProjectTreeType,
      }
      const dataIDList = await datasetDao.getDataIDListOfDataset(datasetID)
      for (const dataID of dataIDList) {
        const dataInfo = await dataDao.getDataInfo(dataID)
        if (!dataInfo) continue
        temp.children.push({
          title: dataInfo.data_name,
          key: dataInfo.data_id,
          layerType: dataInfo.data_type,
          layerStyle: dataInfo.data_style,
          group: false,
          isInput: dataInfo.data_input,
          children: [],
        })
      }
      result.push(temp)
    })

    await Promise.all(promiseList)

    return result
  },

  updateProjectName: async (projectID: string, projectName: string) => {
    await projectDao.updateProjectName(projectID, projectName)
  },

  deleteProject: async (projectID: string) => {
    const projectInfo = await projectDao.getProject(projectID)
    if (!projectInfo) return
    const datasetIDList = await projectDao.getDatasetListOfProject(projectID)

    // delete db record
    await projectDao.deleteProject(projectID)
    await projectDao.deleteProjectDataset(projectID)
    for (const datasetID of datasetIDList) {
      await datasetService.deleteDataset(datasetID)
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
