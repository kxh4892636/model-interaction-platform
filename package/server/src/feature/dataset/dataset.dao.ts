import { prisma } from '@/util/db/prisma'
import { randomUUID } from 'crypto'

export const datasetDao = {
  createDataset: async (
    datasetPath: string,
    datasetID: string,
    datasetName: string,
    timeStamp: string,
    datasetInput: boolean,
    status: 'active' | 'pending',
  ) => {
    await prisma.dataset.create({
      data: {
        dataset_folder_path: datasetPath,
        dataset_id: datasetID,
        dataset_name: datasetName,
        dataset_timestamp: timeStamp,
        dataset_input: datasetInput,
        status,
        create_time: timeStamp,
        update_time: timeStamp,
      },
    })
  },

  createDatasetData: async (
    datasetID: string,
    dataID: string,
    timeStamp: string,
  ) => {
    await prisma.dataset_data.create({
      data: {
        dataset_data_id: randomUUID(),
        dataset_id: datasetID,
        data_id: dataID,
        status: 'active',
        create_time: timeStamp,
        update_time: timeStamp,
      },
    })
  },

  getDatasetInfo: async (datasetID: string) => {
    const result = await prisma.dataset.findUnique({
      where: {
        dataset_id: datasetID,
      },
      select: {
        dataset_folder_path: true,
        dataset_id: true,
        dataset_input: true,
        dataset_name: true,
        dataset_timestamp: true,
        status: true,
      },
    })

    return result
  },

  getDatasetList: async () => {
    const result = await prisma.dataset.findMany({
      select: {
        dataset_folder_path: true,
        dataset_id: true,
        dataset_input: true,
        dataset_name: true,
        dataset_timestamp: true,
      },
    })
    return result
  },

  getDataIDListOfDataset: async (datasetID: string) => {
    const result = await prisma.dataset_data.findMany({
      where: {
        dataset_id: datasetID,
      },
      select: {
        data_id: true,
      },
    })

    return result.map((value) => value.data_id)
  },

  updateDatasetName: async (datasetID: string, datasetName: string) => {
    const timeStamp = Date.now().toString()
    await prisma.dataset.update({
      where: {
        dataset_id: datasetID,
      },
      data: {
        dataset_name: datasetName,
        update_time: timeStamp.toString(),
      },
    })
  },

  updateDatasetStatus: async (
    datasetID: string,
    status: 'active' | 'pending',
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.dataset.update({
      where: {
        dataset_id: datasetID,
      },
      data: {
        status,
        update_time: timeStamp.toString(),
      },
    })
  },

  deleteProjectDataset: async (datasetID: string) => {
    await prisma.project_dataset.deleteMany({
      where: {
        dataset_id: datasetID,
      },
    })
  },

  deleteDataset: async (datasetID: string) => {
    await prisma.dataset.delete({
      where: {
        dataset_id: datasetID,
      },
    })
  },

  deleteDatasetData: async (datasetID: string) => {
    await prisma.dataset_data.deleteMany({
      where: {
        dataset_id: datasetID,
      },
    })
  },
}
