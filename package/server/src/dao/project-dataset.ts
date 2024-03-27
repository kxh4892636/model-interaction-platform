import { DBStatusType } from '@/type'
import { prisma } from '@/util/db/prisma'

export const projectDatasetDao = {
  createProjectDataset: async (
    projectDatasetID: string,
    projectID: string,
    datasetID: string,
    status: DBStatusType,
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.project_dataset.create({
      data: {
        project_dataset_id: projectDatasetID,
        project_id: projectID,
        dataset_id: datasetID,
        create_time: timeStamp,
        update_time: timeStamp,
        status,
      },
    })
  },

  getProjectIDByDatasetID: async (datasetID: string) => {
    const result = await prisma.project_dataset.findUnique({
      where: {
        dataset_id: datasetID,
      },
      select: {
        project_id: true,
        status: true,
      },
    })
    return result
  },

  getDatasetIDListByProjectID: async (projectID: string) => {
    const result = await prisma.project_dataset.findMany({
      where: {
        project_id: projectID,
      },
      select: {
        dataset_id: true,
        status: true,
      },
    })
    return result
  },

  deleteProjectDatasetByDatasetID: async (datasetID: string) => {
    const result = await prisma.project_dataset.delete({
      where: {
        dataset_id: datasetID,
      },
    })
    return result
  },

  deleteProjectDatasetByProjectID: async (projectID: string) => {
    const result = await prisma.project_dataset.deleteMany({
      where: {
        project_id: projectID,
      },
    })
    return result
  },
}
