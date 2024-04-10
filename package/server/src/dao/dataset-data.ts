import { DBStatusType } from '@/type'
import { prisma } from '@/util/db/prisma'

export const datasetDataDao = {
  createDatasetData: async (
    datasetDataID: string,
    datasetID: string,
    dataID: string,
    status: DBStatusType,
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.dataset_data.create({
      data: {
        dataset_data_id: datasetDataID,
        dataset_id: datasetID,
        data_id: dataID,
        create_time: timeStamp,
        update_time: timeStamp,
        status,
      },
    })
  },

  getDatasetIDByDataID: async (dataID: string) => {
    const result = await prisma.dataset_data.findUnique({
      where: {
        data_id: dataID,
      },
      select: {
        dataset_id: true,
        status: true,
      },
    })
    return result
  },

  getDataIDListByDatasetID: async (datasetID: string) => {
    const result = await prisma.dataset_data.findMany({
      where: {
        dataset_id: datasetID,
      },
      select: {
        data_id: true,
        status: true,
      },
    })
    return result
  },

  deleteDatasetDataByDataID: async (dataID: string) => {
    const result = await prisma.dataset_data.delete({
      where: {
        data_id: dataID,
      },
    })
    return result
  },

  deleteDatasetDataByDatasetID: async (datasetID: string) => {
    const result = await prisma.dataset_data.deleteMany({
      where: {
        dataset_id: datasetID,
      },
    })
    return result
  },
}
