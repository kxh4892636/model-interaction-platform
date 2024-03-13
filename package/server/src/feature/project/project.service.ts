import { DATA_FOLDER_PATH } from '@/config/env'
import { ProjectListType, ProjectType } from '@/type/project.type'
import { randomUUID } from 'crypto'
import { mkdir } from 'fs/promises'
import path from 'path'
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
  ): Promise<ProjectType | null> => {
    const projectInfo = await projectDao.getProjectByProjectID(projectID)
    if (!projectInfo) {
      return null
    }
    const datasetList = await projectDao.getDatasetListOfProject(projectID)

    return {
      datasetIDArray: datasetList.map((value) => value.dataset_id),
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
        datasetIDArray: datasetList.map((value) => value.dataset_id),
      }

      result.push(temp)
    })

    await Promise.all(promiseList)

    return result
  },
}
