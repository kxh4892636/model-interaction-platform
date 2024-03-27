import { orm } from '@/dao'
import {
  DBStatusType,
  WaterDataStyleType,
  WaterDataTypeType,
  WaterModelTypeType,
} from '@/type'
import { prisma } from '@/util/db/prisma'
import { randomUUID } from 'crypto'

export const dataDao = {
  createData: async (
    datasetID: string,
    dataID: string,
    dataName: string,
    dataType: WaterDataTypeType,
    dataStyle: WaterDataStyleType,
    dataExtent: number[],
    dataIdentifier: string,
    dataFilePath: string,
    modelType: WaterModelTypeType,
    dataVisualization: string[],
    status: DBStatusType,
  ) => {
    await orm.data.createData(
      dataID,
      dataName,
      dataType,
      dataStyle,
      dataExtent,
      dataIdentifier,
      dataFilePath,
      modelType,
      dataVisualization,
      status,
    )
    await orm.datasetData.createDatasetData(
      randomUUID(),
      datasetID,
      dataID,
      'valid',
    )
  },

  getDatasetOfUpload: async (
    datasetIdentifier: string,
    datasetType: string,
    modelType: WaterModelTypeType,
  ) => {
    const datasetInfo = await prisma.dataset.findFirst({
      where: {
        dataset_type: datasetType,
        dataset_identifier: datasetIdentifier,
        model_type: modelType,
      },
      select: {
        dataset_id: true,
        status: true,
      },
    })
    return datasetInfo || null
  },

  deleteData: async (dataID: string) => {
    await orm.data.deleteDataByDataID(dataID)
    await orm.datasetData.deleteDatasetDataByDataID(dataID).catch(() => {
      //
    })
  },
}
