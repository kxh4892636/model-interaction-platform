import { DBStatusType, WaterModelTypeType } from '@/type'
import { prisma } from '@/util/db/prisma'

export const datasetDao = {
  createDataset: async (
    datasetID: string,
    datasetName: string,
    datasetIdentifier: string,
    datasetFolderPath: string,
    datasetType: string,
    modelType: WaterModelTypeType,
    status: DBStatusType,
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.dataset.create({
      data: {
        create_time: timeStamp,
        dataset_id: datasetID,
        dataset_identifier: datasetIdentifier,
        dataset_type: datasetType,
        dataset_name: datasetName,
        dataset_folder_path: datasetFolderPath,
        status,
        update_time: timeStamp,
        model_type: modelType,
      },
    })
  },

  updateDatasetByDatasetID: async (
    datasetID: string,
    init: {
      datasetName?: string
      datasetIdentifier?: string
      datasetFolderPath?: string
      datasetType?: string
      modelType?: WaterModelTypeType
      status?: DBStatusType
    },
  ) => {
    const timeStamp = Date.now().toString()
    await prisma.dataset.update({
      where: {
        dataset_id: datasetID,
      },
      data: {
        create_time: timeStamp,
        dataset_id: datasetID,
        dataset_identifier: init.datasetIdentifier,
        dataset_type: init.datasetType,
        dataset_name: init.datasetName,
        dataset_folder_path: init.datasetFolderPath,
        status: init.status,
        update_time: timeStamp,
        model_type: init.modelType,
      },
    })
  },

  getDatasetByDatasetID: async (datasetID: string) => {
    const result = await prisma.dataset.findUnique({
      where: {
        dataset_id: datasetID,
      },
    })

    return result
  },

  deleteDatasetByDatasetID: async (datasetID: string) => {
    await prisma.dataset.delete({
      where: {
        dataset_id: datasetID,
      },
    })
  },
}
