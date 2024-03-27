import { DBStatusType } from '@/type'
import { prisma } from '@/util/db/prisma'

export const projectDao = {
  createProject: async (
    projectID: string,
    projectName: string,
    projectExtent: number[],
    projectIdentifier: string,
    projectFolderPath: string,
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

  getAllProject: async () => {
    const result = await prisma.project.findMany()
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
