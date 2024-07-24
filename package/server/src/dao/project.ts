import { DBStatusType, WaterModelTypeType } from '@/type'
import { prisma } from '@/util/db/prisma'

export const projectDao = {
  createProject: async (
    projectID: string,
    projectName: string,
    projectExtent: number[],
    projectIdentifier: string,
    projectFolderPath: string,
    modelType: WaterModelTypeType,
    status: DBStatusType,
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.project.create({
      data: {
        create_time: timeStamp,
        project_extent: projectExtent,
        project_folder_path: projectFolderPath,
        project_id: projectID,
        project_identifier: projectIdentifier,
        project_name: projectName,
        model_type: modelType,
        status,
        update_time: timeStamp,
      },
    })
  },

  updateProjectByProjectID: async (
    projectID: string,
    init: {
      projectID?: string
      projectName?: string
      projectExtent?: number[]
      projectIdentifier?: string
      projectFolderPath?: string
      modelType?: WaterModelTypeType
      status?: DBStatusType
    },
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.project.update({
      where: {
        project_id: projectID,
      },
      data: {
        project_folder_path: init.projectFolderPath,
        project_identifier: init.projectIdentifier,
        project_name: init.projectName,
        status: init.status,
        update_time: timeStamp,
        project_extent: init.projectExtent,
        model_type: init.modelType,
      },
    })
  },

  getProjectByProjectID: async (projectID: string) => {
    const result = await prisma.project.findUnique({
      where: {
        project_id: projectID,
      },
    })

    return result
  },

  getAllProject: async (modelType: WaterModelTypeType) => {
    const result = await prisma.project.findMany({
      where: {
        model_type: modelType,
      },
    })
    return result
  },

  deleteProjectByProjectID: async (projectID: string) => {
    await prisma.project.delete({
      where: {
        project_id: projectID,
      },
    })
  },
}
