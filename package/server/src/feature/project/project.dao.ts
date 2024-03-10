import { prisma } from '@/util/db/prisma'

export const projectDao = {
  getAllProject: async () => {
    const result = await prisma.project.findMany()
    return result
  },

  getProjectByProjectID: async (projectID: string) => {
    const result = await prisma.project.findUnique({
      where: {
        project_id: projectID,
      },
    })
    return result
  },

  getDatasetListOfProject: async (projectID: string) => {
    const result = await prisma.project_dataset.findMany({
      where: {
        project_id: projectID,
      },
      select: {
        dataset_id: true,
      },
    })

    return result
  },

  updateProject: async (projectName: string, projectID: string) => {
    //
  },

  deleteProjectByProjectID: async (projectID: string) => {
    //
  },
}
