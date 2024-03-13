import { prisma } from '@/util/db/prisma'
import { randomUUID } from 'crypto'

export const datasetDao = {
  createDataset: async (
    datasetPath: string,
    datasetID: string,
    datasetName: string,
    timeStamp: string,
  ) => {
    await prisma.dataset.create({
      data: {
        dataset_folder_path: datasetPath,
        dataset_id: datasetID,
        dataset_name: datasetName,
        dataset_timestamp: timeStamp,
        dataset_input: true,
        status: 'active',
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
}
